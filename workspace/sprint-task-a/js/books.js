/**
 * books.js - Book catalog CRUD, search, filter, sort, and modal management
 */

import { getState, setState, addActivity } from './state.js';
import { openModal, closeModal, escapeHtml, showToast } from './ui.js';

let currentEditingBookId = null;
let currentDetailBookId = null;
let bookToDeleteId = null;

export const renderBooksView = () => {
  const state = getState();
  const { search, genre, status, sort, page, limit } = state.filters.books;
  
  // 1. Filter
  let filtered = state.books.filter(book => {
    const matchesSearch = !search || 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.toLowerCase().includes(search.toLowerCase());

    const matchesGenre = genre === 'all' || book.genre === genre;
    
    let matchesStatus = true;
    if (status === 'available') {
      matchesStatus = book.availableCopies > 0;
    } else if (status === 'borrowed') {
      matchesStatus = book.availableCopies === 0;
    }

    return matchesSearch && matchesGenre && matchesStatus;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'author-asc':
        return a.author.localeCompare(b.author);
      case 'year-desc':
        return (b.publicationYear || 0) - (a.publicationYear || 0);
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // 3. Paginate
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  
  const startIndex = (currentPage - 1) * limit;
  const paginatedBooks = filtered.slice(startIndex, startIndex + limit);

  // Update Summary and Pagination Indicators
  const summaryEl = document.getElementById('books-count-summary');
  if (summaryEl) {
    summaryEl.textContent = `Showing ${paginatedBooks.length} of ${totalCount} books`;
  }

  const pageIndicator = document.getElementById('books-page-indicator');
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  const prevBtn = document.getElementById('books-prev-page-btn');
  const nextBtn = document.getElementById('books-next-page-btn');
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  // 4. Render Grid
  const gridEl = document.getElementById('books-grid');
  if (!gridEl) return;

  if (paginatedBooks.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
        <i class="fa-solid fa-book-open fa-3x" style="margin-bottom: 12px; opacity: 0.5;"></i>
        <p>No books found matching your current filter criteria.</p>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = paginatedBooks.map(book => {
    const isAvailable = book.availableCopies > 0;
    const cover = book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
    return `
      <div class="book-card" data-id="${book.id}">
        <div class="book-card-cover-wrap">
          <img src="${escapeHtml(cover)}" alt="${escapeHtml(book.title)}" class="book-card-cover" onerror="this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'">
          <span class="book-card-badge">${escapeHtml(book.genre)}</span>
        </div>
        <div class="book-card-body">
          <h4 class="book-card-title" title="${escapeHtml(book.title)}" onclick="window.booksModule.openBookDetailModal('${book.id}')">${escapeHtml(book.title)}</h4>
          <span class="book-card-author">by ${escapeHtml(book.author)}</span>
          <div class="book-card-meta">
            <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(book.shelfLocation || 'N/A')}</span>
            <span class="copies-badge ${isAvailable ? 'available' : 'out'}">
              ${isAvailable ? `${book.availableCopies}/${book.totalCopies} Avail` : 'Out of Stock'}
            </span>
          </div>
          <div class="book-card-actions">
            <button class="btn btn-outline btn-sm flex-1" onclick="window.booksModule.openBookDetailModal('${book.id}')">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.booksModule.openEditBookModal('${book.id}')" title="Edit Book">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger-outline btn-sm" onclick="window.booksModule.confirmDeleteBook('${book.id}')" title="Delete Book">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

export const handleBookSearch = (query) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      books: { ...prev.filters.books, search: query, page: 1 }
    }
  }));
  renderBooksView();
};

export const handleGenreFilter = (genre) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      books: { ...prev.filters.books, genre, page: 1 }
    }
  }));
  renderBooksView();
};

export const handleStatusFilter = (status) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      books: { ...prev.filters.books, status, page: 1 }
    }
  }));
  renderBooksView();
};

export const handleSortChange = (sortBy) => {
  setState(prev => ({
    filters: {
      ...prev.filters,
      books: { ...prev.filters.books, sort: sortBy }
    }
  }));
  renderBooksView();
};

export const handlePageChange = (delta) => {
  const { page } = getState().filters.books;
  setState(prev => ({
    filters: {
      ...prev.filters,
      books: { ...prev.filters.books, page: Math.max(1, page + delta) }
    }
  }));
  renderBooksView();
};

export const openAddBookModal = () => {
  currentEditingBookId = null;
  const form = document.getElementById('form-book');
  if (form) form.reset();

  document.getElementById('modal-book-title').textContent = 'Add New Book';
  document.getElementById('book-id-hidden').value = '';
  document.getElementById('book-input-copies-total').value = '3';
  openModal('modal-book-form');
};

export const openEditBookModal = (bookId) => {
  const book = getState().books.find(b => b.id === bookId);
  if (!book) return;

  currentEditingBookId = bookId;
  document.getElementById('modal-book-title').textContent = 'Edit Book';
  document.getElementById('book-id-hidden').value = book.id;
  document.getElementById('book-input-title').value = book.title;
  document.getElementById('book-input-author').value = book.author;
  document.getElementById('book-input-isbn').value = book.isbn;
  document.getElementById('book-input-genre').value = book.genre;
  document.getElementById('book-input-year').value = book.publicationYear || '';
  document.getElementById('book-input-publisher').value = book.publisher || '';
  document.getElementById('book-input-copies-total').value = book.totalCopies;
  document.getElementById('book-input-shelf-location').value = book.shelfLocation || '';
  document.getElementById('book-input-cover-url').value = book.coverUrl || '';
  document.getElementById('book-input-description').value = book.description || '';

  openModal('modal-book-form');
};

export const handleSaveBook = (e) => {
  if (e) e.preventDefault();

  const id = document.getElementById('book-id-hidden').value;
  const title = document.getElementById('book-input-title').value.trim();
  const author = document.getElementById('book-input-author').value.trim();
  const isbn = document.getElementById('book-input-isbn').value.trim();
  const genre = document.getElementById('book-input-genre').value;
  const publicationYear = parseInt(document.getElementById('book-input-year').value, 10) || new Date().getFullYear();
  const publisher = document.getElementById('book-input-publisher').value.trim();
  const totalCopies = parseInt(document.getElementById('book-input-copies-total').value, 10) || 1;
  const shelfLocation = document.getElementById('book-input-shelf-location').value.trim();
  const coverUrl = document.getElementById('book-input-cover-url').value.trim();
  const description = document.getElementById('book-input-description').value.trim();

  if (!title || !author || !isbn) {
    showToast('Please fill out all required fields.', 'warning');
    return false;
  }

  const { books, loans } = getState();

  if (id) {
    // Edit existing book
    const existing = books.find(b => b.id === id);
    if (!existing) return false;

    // Check loaned count to ensure totalCopies is not smaller than active loans
    const activeLoans = loans.filter(l => l.bookId === id && l.status !== 'returned').length;
    if (totalCopies < activeLoans) {
      showToast(`Cannot reduce copies below ${activeLoans} (currently loaned out).`, 'error');
      return false;
    }

    const availableCopies = Math.max(0, totalCopies - activeLoans);

    const updatedBooks = books.map(b => {
      if (b.id === id) {
        return {
          ...b,
          title,
          author,
          isbn,
          genre,
          publicationYear,
          publisher,
          totalCopies,
          availableCopies,
          shelfLocation,
          coverUrl: coverUrl || b.coverUrl,
          description
        };
      }
      return b;
    });

    setState({ books: updatedBooks });
    addActivity('add_book', `Book updated: "${title}"`);
    showToast(`"${title}" has been updated successfully.`, 'success');
  } else {
    // Add new book
    const newBook = {
      id: 'b-' + Math.random().toString(36.25).substr(2, 7),
      title,
      author,
      isbn,
      genre,
      publicationYear,
      publisher,
      totalCopies,
      availableCopies: totalCopies,
      shelfLocation,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      description,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };

    setState({ books: [newBook, ...books] });
    addActivity('add_book', `New book added: "${title}"`);
    showToast(`"${title}" added to catalog!`, 'success');
  }

  closeModal('modal-book-form');
  renderBooksView();
  return true;
};

export const openBookDetailModal = (bookId) => {
  const state = getState();
  const book = state.books.find(b => b.id === bookId);
  if (!book) return;

  currentDetailBookId = bookId;

  document.getElementById('detail-book-title').textContent = book.title;
  document.getElementById('detail-book-author').textContent = book.author;
  document.getElementById('detail-book-isbn').textContent = book.isbn;
  document.getElementById('detail-book-genre').textContent = book.genre;
  document.getElementById('detail-book-shelf').textContent = `Shelf: ${book.shelfLocation || 'N/A'}`;
  document.getElementById('detail-book-copies').textContent = `${book.availableCopies} of ${book.totalCopies} copies available`;
  document.getElementById('detail-book-desc').textContent = book.description || 'No description available.';
  
  const coverEl = document.getElementById('detail-book-cover');
  if (coverEl) {
    coverEl.src = book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
  }

  // Active borrowers
  const activeLoans = state.loans.filter(l => l.bookId === bookId && l.status !== 'returned');
  const borrowersTbody = document.getElementById('detail-book-current-borrowers');
  if (borrowersTbody) {
    if (activeLoans.length === 0) {
      borrowersTbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No active loans for this title.</td></tr>`;
    } else {
      borrowersTbody.innerHTML = activeLoans.map(l => `
        <tr>
          <td><strong>${escapeHtml(l.memberName)}</strong></td>
          <td>${escapeHtml(l.issueDate)}</td>
          <td><span class="badge ${new Date(l.dueDate) < new Date() ? 'badge-danger' : 'badge-info'}">${escapeHtml(l.dueDate)}</span></td>
        </tr>
      `).join('');
    }
  }

  // Buttons state
  const borrowBtn = document.getElementById('btn-detail-borrow');
  const reserveBtn = document.getElementById('btn-detail-reserve');
  if (borrowBtn) {
    borrowBtn.disabled = book.availableCopies <= 0;
    borrowBtn.onclick = () => {
      closeModal('modal-book-detail');
      window.circulationModule.openIssueLoanModal(bookId);
    };
  }
  if (reserveBtn) {
    reserveBtn.onclick = () => {
      closeModal('modal-book-detail');
      window.circulationModule.openCreateReservationModal(bookId);
    };
  }

  const editBtn = document.getElementById('btn-detail-edit');
  if (editBtn) {
    editBtn.onclick = () => {
      closeModal('modal-book-detail');
      openEditBookModal(bookId);
    };
  }

  openModal('modal-book-detail');
};

export const confirmDeleteBook = (bookId) => {
  const { books, loans } = getState();
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const activeLoans = loans.filter(l => l.bookId === bookId && l.status !== 'returned');
  if (activeLoans.length > 0) {
    showToast(`Cannot delete "${book.title}" because it currently has ${activeLoans.length} active loan(s).`, 'error');
    return;
  }

  bookToDeleteId = bookId;
  document.getElementById('confirm-delete-title').textContent = 'Delete Book?';
  document.getElementById('confirm-delete-message').textContent = `Are you sure you want to permanently delete "${book.title}" from catalog?`;
  
  const confirmBtn = document.getElementById('btn-confirm-delete');
  confirmBtn.onclick = () => {
    handleDeleteBookConfirmed();
  };

  openModal('modal-confirm-delete');
};

const handleDeleteBookConfirmed = () => {
  if (!bookToDeleteId) return;
  const { books } = getState();
  const book = books.find(b => b.id === bookToDeleteId);
  
  const updatedBooks = books.filter(b => b.id !== bookToDeleteId);
  setState({ books: updatedBooks });
  
  if (book) {
    addActivity('add_book', `Book removed: "${book.title}"`);
    showToast(`"${book.title}" has been deleted.`, 'info');
  }

  closeModal('modal-confirm-delete');
  bookToDeleteId = null;
  renderBooksView();
};
