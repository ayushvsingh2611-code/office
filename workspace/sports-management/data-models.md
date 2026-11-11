Namaste! Nami here, your Data Architect. ⚓🧭

Let's chart out the data architecture for our **Sports Management Portal**. To handle live match fixtures, real-time arena turf bookings, complex team rosters, and dynamic player stats, we need a robust, scalable, and ACID-compliant data model. 

Here is the complete data architecture blueprint: PostgreSQL for relational entities, Redis for live match state & caching, Redux/Zustand state structure, and OpenAPI-standard contracts with Zod validation rules.

---

## 1. Database Entity-Relationship Models (PostgreSQL / Relational)

### A. Users & Roles
```sql
CREATE TYPE user_role AS ENUM ('ADMIN', 'ARENA_MANAGER', 'TEAM_CAPTAIN', 'PLAYER', 'SPECTATOR');

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role user_role DEFAULT 'SPECTATOR',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### B. Arena & Turf Management
```sql
CREATE TABLE arenas (
    arena_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    location JSONB NOT NULL, -- {address, city, lat, lng}
    contact_email VARCHAR(255),
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE turf_sport_type AS ENUM ('FOOTBALL', 'CRICKET', 'BASKETBALL', 'TENNIS', 'BADMINTON');

CREATE TABLE turfs (
    turf_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    arena_id UUID REFERENCES arenas(arena_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sport_type turf_sport_type NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    dimensions VARCHAR(50)
);

CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turf_id UUID REFERENCES turfs(turf_id) ON DELETE RESTRICT,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status booking_status DEFAULT 'PENDING',
    payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_double_booking EXCLUDE USING gist (
        turf_id WITH =,
        tstrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status = 'CONFIRMED')
);
```

### C. Teams & Rosters
```sql
CREATE TABLE teams (
    team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) UNIQUE NOT NULL,
    logo_url TEXT,
    captain_id UUID REFERENCES users(user_id) ON DELETE RESTRICT,
    sport_type turf_sport_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE player_position AS ENUM ('FORWARD', 'MIDFIELDER', 'DEFENDER', 'GOALKEEPER', 'BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER');
CREATE TYPE roster_status AS ENUM ('ACTIVE', 'INJURED', 'SUSPENDED', 'ALUMNI');

CREATE TABLE team_rosters (
    roster_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(team_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    jersey_number INT,
    position player_position NOT NULL,
    status roster_status DEFAULT 'ACTIVE',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, jersey_number),
    UNIQUE(team_id, user_id)
);
```

### D. Fixtures & Live Match Management
```sql
CREATE TYPE match_status AS ENUM ('SCHEDULED', 'LIVE', 'HALFTIME', 'COMPLETED', 'CANCELLED');

CREATE TABLE fixtures (
    fixture_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    turf_id UUID REFERENCES turfs(turf_id) ON DELETE SET NULL,
    home_team_id UUID REFERENCES teams(team_id) ON DELETE RESTRICT,
    away_team_id UUID REFERENCES teams(team_id) ON DELETE RESTRICT,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status match_status DEFAULT 'SCHEDULED',
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    match_metadata JSONB, -- Sport specific extra metrics (e.g., overs for cricket, quarters for basketball)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player_match_stats (
    stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fixture_id UUID REFERENCES fixtures(fixture_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(team_id) ON DELETE CASCADE,
    goals INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    minutes_played INT DEFAULT 0,
    sport_specific_stats JSONB -- e.g., { "wickets": 2, "runs_scored": 45, "catches": 1 }
);
```

---

## 2. State Management Architecture (Frontend - Redux Toolkit / Zustand)

Here is the state tree designed for performance, minimizing unnecessary re-renders during high-frequency live match updates.

```typescript
interface RootState {
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  turfs: {
    arenas: Record<string, Arena>;
    turfs: Record<string, Turf>;
    selectedDate: string;
    filters: { sport: string; priceRange: [number, number] };
    bookings: Record<string, Booking>;
  };
  teams: {
    myTeams: string[]; // Team IDs
    entities: Record<string, Team>;
    rosters: Record<string, RosterMember[]>; // keyed by team_id
  };
  liveMatches: {
    activeFixtureId: string | null;
    fixtures: Record<string, Fixture>; // Updated via WebSockets
    liveStats: Record<string, PlayerMatchStat[]>; // keyed by fixture_id
    connectionStatus: 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING';
  };
}
```

---

## 3. API Contracts & Endpoints (REST & WebSocket)

### REST Endpoints

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | `RegisterDTO` |
| `POST` | `/api/v1/bookings` | Book a turf slot | `CreateBookingDTO` |
| `GET` | `/api/v1/turfs/availability` | Check slot availability | `?turf_id=uuid&date=YYYY-MM-DD` |
| `POST` | `/api/v1/teams` | Create a new team | `CreateTeamDTO` |
| `POST` | `/api/v1/teams/{id}/roster` | Add player to team roster | `AddPlayerDTO` |
| `GET` | `/api/v1/fixtures` | Get matches list | `?status=LIVE&sport=FOOTBALL` |
| `PATCH` | `/api/v1/fixtures/{id}/score`| Admin/Referee updates score | `UpdateScoreDTO` |

### WebSocket Protocol (Live Match Feed)
* **Connection URL:** `wss://api.sportsportal.com/ws/match/{fixture_id}`
* **Client to Server (Action):**
  ```json
  {
    "event": "SUBSCRIBE_MATCH",
    "payload": { "fixture_id": "uuid-123" }
  }
  ```
* **Server to Client (Broadcast Event):**
  ```json
  {
    "event": "SCORE_UPDATE",
    "timestamp": 1698765432,
    "payload": {
      "fixture_id": "uuid-123",
      "home_score": 2,
      "away_score": 1,
      "latest_incident": {
        "type": "GOAL",
        "player_id": "uuid-player",
        "minute": 74
      }
    }
  }
  ```

---

## 4. Data Validation Rules & Integrity (Zod Implementation)

Here are the strict validation rules implemented at the API gateway/application boundary using **Zod**:

```typescript
import { z } from 'zod';

export const CreateBookingSchema = z.object({
  turf_id: z.string().uuid({ message: "Invalid turf ID format" }),
  start_time: z.string().datetime({ message: "Must be a valid ISO 8601 date-time" }),
  end_time: z.string().datetime({ message: "Must be a valid ISO 8601 date-time" }),
}).refine(data => new Date(data.end_time) > new Date(data.start_time), {
  message: "End time must be strictly greater than start time",
  path: ["end_time"],
}).refine(data => {
  const start = new Date(data.start_time);
  const now = new Date();
  return start > now;
}, {
  message: "Cannot book slots in the past",
  path: ["start_time"],
});

export const AddPlayerRosterSchema = z.object({
  team_id: z.string().uuid(),
  user_id: z.string().uuid(),
  jersey_number: z.number().int().min(1).max(99),
  position: z.enum([
    'FORWARD', 'MIDFIELDER', 'DEFENDER', 'GOALKEEPER', 
    'BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER'
  ]),
});

export const FixtureScoreUpdateSchema = z.object({
  home_score: z.number().int().nonnegative(),
  away_score: z.number().int().nonnegative(),
  status: z.enum(['SCHEDULED', 'LIVE', 'HALFTIME', 'COMPLETED', 'CANCELLED']),
  match_metadata: z.record(z.any()).optional(),
});
```

---

### Nami’s Navigation Notes:
1. **Concurrency Control:** The PostgreSQL `EXCLUDE USING gist` constraint guarantees zero double-bookings on turfs even under high race-condition loads.
2. **Real-time Scaling:** Cache active fixture states in **Redis** and publish via Redis Pub/Sub to WebSocket servers to avoid hammering the primary SQL database during live matches. 

The structural blueprint is locked in. Let's build this powerhouse portal! 🚀