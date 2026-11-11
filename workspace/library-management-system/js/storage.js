/**
 * storage.js - LocalStorage engine, mock seed dataset, JSON import/export
 */

import { setState, createInitialState } from './state.js';

export const SEED_DATA = {
  books: [
    {
      id: "b-101",
      title: "Clean Architecture: A Craftsman's Guide",
      author: "Robert C. Martin",
      isbn: "978-0134494166",
      genre: "Technology",
      publicationYear: 2017,
      publisher: "Prentice Hall",
      totalCopies: 4,
      availableCopies: 2,
      shelfLocation: "TECH-01",
      coverUrl: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
      description: "Practical software architecture rules from Uncle Bob Martin.",
      rating: 4.8,
      createdAt: "2023-01-10T08:00:00.000Z"
    },
    {
      id: "b-102",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      isbn: "978-1449373320",
      genre: "Technology",
      publicationYear: 2017,
      publisher: "O'Reilly Media",
      totalCopies: 3,
      availableCopies: 1,
      shelfLocation: "TECH-02",
      coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      description: "The big ideas behind reliable, scalable, and maintainable systems.",
      rating: 4.9,
      createdAt: "2023-01-12T08:00:00.000Z"
    },
    {
      id: "b-103",
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      isbn: "978-0062316097",
      genre: "History",
      publicationYear: 2015,
      publisher: "Harper",
      totalCopies: 5,
      availableCopies: 4,
      shelfLocation: "HIST-04",
      coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
      description: "Explores the ways in which biology and history have defined humankind.",
      rating: 4.7,
      createdAt: "2023-01-15T08:00:00.000Z"
    },
    {
      id: "b-104",
      title: "Dune: Deluxe Edition",
      author: "Frank Herbert",
      isbn: "978-0441172719",
      genre: "Fiction",
      publicationYear: 1965,
      publisher: "Chilton Books",
      totalCopies: 3,
      availableCopies: 0,
      shelfLocation: "FIC-09",
      coverUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      description: "Epic science fiction saga of Paul Atreides and the desert planet Arrakis.",
      rating: 4.9,
      createdAt: "2023-01-18T08:00:00.000Z"
    },
    {
      id: "b-105",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "978-0553380163",
      genre: "Science",
      publicationYear: 1988,
      publisher: "Bantam Books",
      totalCopies: 4,
      availableCopies: 3,
      shelfLocation: "SCI-02",
      coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
      description: "Cosmology and quantum mechanics exploration written for non-specialist readers.",
      rating: 4.6,
      createdAt: "2023-02-01T08:00:00.000Z"
    },
    {
      id: "b-106",
      title: "Meditations",
      author: "Marcus Aurelius",
      isbn: "978-0140449334",
      genre: "Philosophy",
      publicationYear: 2006,
      publisher: "Penguin Classics",
      totalCopies: 5,
      availableCopies: 4,
      shelfLocation: "PHIL-01",
      coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      description: "Personal writings of the Roman Emperor Marcus Aurelius on Stoic philosophy.",
      rating: 4.8,
      createdAt: "2023-02-05T08:00:00.000Z"
    },
    {
      id: "b-107",
      title: "Steve Jobs",
      author: "Walter Isaacson",
      isbn: "978-1451648539",
      genre: "Biography",
      publicationYear: 2011,
      publisher: "Simon & Schuster",
      totalCopies: 2,
      availableCopies: 1,
      shelfLocation: "BIO-03",
      coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      description: "Exclusive biography of Apple co-founder Steve Jobs.",
      rating: 4.7,
      createdAt: "2023-02-10T08:00:00.000Z"
    },
    {
      id: "b-108",
      title: "The Story of Art",
      author: "E.H. Gombrich",
      isbn: "978-0714832470",
      genre: "Arts",
      publicationYear: 1995,
      publisher: "Phaidon Press",
      totalCopies: 2,
      availableCopies: 2,
      shelfLocation: "ART-01",
      coverUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      description: "One of the most famous introductions to the history of visual arts.",
      rating: 4.9,
      createdAt: "2023-02-12T08:00:00.000Z"
    },
    {
      id: "b-109",
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      isbn: "978-0374533557",
      genre: "Non-Fiction",
      publicationYear: 2011,
      publisher: "Farrar, Straus and Giroux",
      totalCopies: 4,
      availableCopies: 3,
      shelfLocation: "NF-05",
      coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
      description: "Cognitive biases and two modes of thought: fast and slow.",
      rating: 4.6,
      createdAt: "2023-02-14T08:00:00.000Z"
    },
    {
      id: "b-110",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0060935467",
      genre: "Fiction",
      publicationYear: 1960,
      publisher: "J. B. Lippincott & Co.",
      totalCopies: 4,
      availableCopies: 3,
      shelfLocation: "FIC-02",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
      description: "Pulitzer Prize-winning masterpiece set in the American South.",
      rating: 4.9,
      createdAt: "2023-02-18T08:00:00.000Z"
    },
    {
      id: "b-111",
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      isbn: "978-0135957059",
      genre: "Technology",
      publicationYear: 2019,
      publisher: "Addison-Wesley",
      totalCopies: 3,
      availableCopies: 2,
      shelfLocation: "TECH-03",
      coverUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
      description: "Your journey to mastery in software development practices.",
      rating: 4.9,
      createdAt: "2023-02-20T08:00:00.000Z"
    },
    {
      id: "b-112",
      title: "Cosmos",
      author: "Carl Sagan",
      isbn: "978-0345331359",
      genre: "Science",
      publicationYear: 1980,
      publisher: "Random House",
      totalCopies: 3,
      availableCopies: 3,
      shelfLocation: "SCI-01",
      coverUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=600&q=80",
      description: "The story of cosmic evolution and science in human history.",
      rating: 4.8,
      createdAt: "2023-02-22T08:00:00.000Z"
    }
  ],
  members: [
    {
      id: "m-201",
      name: "Alice Johnson",
      email: "alice.j@university.edu",
      phone: "+1 (555) 234-5678",
      type: "student",
      status: "active",
      maxBooksLimit: 4,
      currentBorrowedCount: 1,
      outstandingFines: 0.00,
      joinedDate: "2023-01-15T09:00:00.000Z"
    },
    {
      id: "m-202",
      name: "Dr. Robert Vance",
      email: "rvance@faculty.org",
      phone: "+1 (555) 345-6789",
      type: "faculty",
      status: "active",
      maxBooksLimit: 8,
      currentBorrowedCount: 2,
      outstandingFines: 3.50,
      joinedDate: "2022-09-01T09:00:00.000Z"
    },
    {
      id: "m-203",
      name: "Clara Oswald",
      email: "clara.o@publiclib.com",
      phone: "+1 (555) 456-7890",
      type: "general",
      status: "active",
      maxBooksLimit: 3,
      currentBorrowedCount: 1,
      outstandingFines: 0.00,
      joinedDate: "2023-03-10T10:30:00.000Z"
    },
    {
      id: "m-204",
      name: "Marcus Brody",
      email: "brody@archaeology.edu",
      phone: "+1 (555) 567-8901",
      type: "faculty",
      status: "active",
      maxBooksLimit: 6,
      currentBorrowedCount: 1,
      outstandingFines: 0.00,
      joinedDate: "2022-11-20T14:15:00.000Z"
    },
    {
      id: "m-205",
      name: "Elena Rostova",
      email: "elena.r@techstudent.org",
      phone: "+1 (555) 678-9012",
      type: "student",
      status: "suspended",
      maxBooksLimit: 4,
      currentBorrowedCount: 1,
      outstandingFines: 12.00,
      joinedDate: "2023-02-04T11:00:00.000Z"
    },
    {
      id: "m-206",
      name: "James Wilson",
      email: "jwilson@community.net",
      phone: "+1 (555) 789-0123",
      type: "general",
      status: "expired",
      maxBooksLimit: 3,
      currentBorrowedCount: 0,
      outstandingFines: 0.00,
      joinedDate: "2021-08-14T08:00:00.000Z"
    }
  ],
  loans: [
    {
      id: "l-301",
      bookId: "b-101",
      bookTitle: "Clean Architecture: A Craftsman's Guide",
      memberId: "m-201",
      memberName: "Alice Johnson",
      issueDate: "2025-02-10",
      dueDate: "2025-02-24",
      returnDate: null,
      status: "active",
      renewalCount: 0,
      fineAmount: 0.0,
      finePaid: false
    },
    {
      id: "l-302",
      bookId: "b-102",
      bookTitle: "Designing Data-Intensive Applications",
      memberId: "m-202",
      memberName: "Dr. Robert Vance",
      issueDate: "2025-02-01",
      dueDate: "2025-02-15", // Overdue!
      returnDate: null,
      status: "overdue",
      renewalCount: 0,
      fineAmount: 3.50,
      finePaid: false
    },
    {
      id: "l-303",
      bookId: "b-104",
      bookTitle: "Dune: Deluxe Edition",
      memberId: "m-202",
      memberName: "Dr. Robert Vance",
      issueDate: "2025-02-08",
      dueDate: "2025-02-22",
      returnDate: null,
      status: "active",
      renewalCount: 1,
      fineAmount: 0.0,
      finePaid: false
    },
    {
      id: "l-304",
      bookId: "b-104",
      bookTitle: "Dune: Deluxe Edition",
      memberId: "m-203",
      memberName: "Clara Oswald",
      issueDate: "2025-02-05",
      dueDate: "2025-02-19",
      returnDate: null,
      status: "active",
      renewalCount: 0,
      fineAmount: 0.0,
      finePaid: false
    },
    {
      id: "l-305",
      bookId: "b-104",
      bookTitle: "Dune: Deluxe Edition",
      memberId: "m-204",
      memberName: "Marcus Brody",
      issueDate: "2025-02-12",
      dueDate: "2025-02-26",
      returnDate: null,
      status: "active",
      renewalCount: 0,
      fineAmount: 0.0,
      finePaid: false
    },
    {
      id: "l-306",
      bookId: "b-101",
      bookTitle: "Clean Architecture: A Craftsman's Guide",
      memberId: "m-205",
      memberName: "Elena Rostova",
      issueDate: "2025-01-10",
      dueDate: "2025-01-24", // Highly overdue!
      returnDate: null,
      status: "overdue",
      renewalCount: 0,
      fineAmount: 12.00,
      finePaid: false
    },
    {
      id: "l-307",
      bookId: "b-103",
      bookTitle: "Sapiens: A Brief History of Humankind",
      memberId: "m-201",
      memberName: "Alice Johnson",
      issueDate: "2025-01-02",
      dueDate: "2025-01-16",
      returnDate: "2025-01-15T10:00:00.000Z",
      status: "returned",
      renewalCount: 0,
      fineAmount: 0.0,
      finePaid: true
    }
  ],
  reservations: [
    {
      id: "r-401",
      bookId: "b-104",
      bookTitle: "Dune: Deluxe Edition",
      memberId: "m-201",
      memberName: "Alice Johnson",
      reservedDate: "2025-02-14T14:30:00.000Z",
      status: "pending",
      queuePosition: 1
    },
    {
      id: "r-402",
      bookId: "b-104",
      bookTitle: "Dune: Deluxe Edition",
      memberId: "m-206",
      memberName: "James Wilson",
      reservedDate: "2025-02-16T09:15:00.000Z",
      status: "pending",
      queuePosition: 2
    }
  ],
  activities: [
    {
      id: "act-1",
      type: "issue",
      description: "Alice Johnson borrowed Clean Architecture",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: "act-2",
      type: "reserve",
      description: "James Wilson joined waitlist for Dune",
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: "act-3",
      type: "return",
      description: "Alice Johnson returned Sapiens on time",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: "act-4",
      type: "add_book",
      description: "New title 'The Pragmatic Programmer' added to catalog",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ]
};

export const seedDatabase = () => {
  const initialState = createInitialState();
  const seededState = {
    ...initialState,
    books: SEED_DATA.books,
    members: SEED_DATA.members,
    loans: SEED_DATA.loans,
    reservations: SEED_DATA.reservations,
    activities: SEED_DATA.activities
  };
  setState(seededState);
};

export const exportDatabaseJSON = () => {
  const dataStr = localStorage.getItem('alexandria_lms_state');
  if (!dataStr) return;
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `alexandria_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importDatabaseJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.books || !data.members) {
      throw new Error("Invalid schema format.");
    }
    setState(data);
    return true;
  } catch (err) {
    console.error("Failed to import database:", err);
    return false;
  }
};
