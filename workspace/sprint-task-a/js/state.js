/**
 * state.js - Centralized application state, reactive store, and persistence bridge.
 */

export const createInitialState = () => ({
  currentView: 'dashboard',
  books: [],
  members: [],
  loans: [],
  reservations: [],
  activities: [],
  settings: {
    libraryName: 'Alexandria Central Library',
    defaultLoanPeriodDays: 14,
    dailyFineRate: 0.50,
    defaultMaxBooks: 4,
    theme: 'light'
  },
  filters: {
    books: { search: '', genre: 'all', status: 'all', sort: 'title-asc', page: 1, limit: 8 },
    members: { search: '', status: 'all', type: 'all', page: 1, limit: 10 },
    circulation: { search: '', status: 'all', tab: 'active' },
    reservations: { search: '', status: 'all' }
  }
});

let currentState = createInitialState();
const listeners = new Set();

export const getState = () => {
  return currentState;
};

export const setState = (updater) => {
  if (typeof updater === 'function') {
    currentState = { ...currentState, ...updater(currentState) };
  } else {
    currentState = { ...currentState, ...updater };
  }
  
  // Save to LocalStorage
  try {
    localStorage.setItem('alexandria_lms_state', JSON.stringify(currentState));
  } catch (e) {
    console.error('Failed to persist state to localStorage:', e);
  }

  // Notify listeners
  listeners.forEach(listener => listener(currentState));
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const addActivity = (type, description) => {
  const newActivity = {
    id: 'act-' + Math.random().toString(36.25).substr(2, 9),
    type,
    description,
    timestamp: new Date().toISOString()
  };

  const updatedActivities = [newActivity, ...currentState.activities].slice(0, 50);
  setState({ activities: updatedActivities });
};

export const loadStoredState = () => {
  try {
    const saved = localStorage.getItem('alexandria_lms_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      currentState = { ...createInitialState(), ...parsed };
      return true;
    }
  } catch (e) {
    console.error('Error loading stored state:', e);
  }
  return false;
};
