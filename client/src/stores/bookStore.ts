// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
import { create } from "zustand";
import { libraryAPI } from "../services/api";

export const useBookStore = create((set, get) => ({
  // État
  books: [],
  categories: [],
  bookmarks: [],
  currentBook: null,
  libraryStats: null,
  selectedBooks: [],
  loading: false,
  error: null,
  
  // Pagination
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  
  // Filtres et recherche
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  showCart: false,
  showFilters: false,
  
  // Filtres de bibliothèque
  filters: {
    author: "",
    language: "",
    fileType: "",
  },

  // Controller pour annuler les requêtes
  _abortController: null,

  // Actions pour les livres (API calls)
  fetchBooks: async (page = 1, customFilters = {}) => {
    // Annuler la requête précédente si elle existe
    const state = get();
    if (state._abortController) {
      state._abortController.abort();
    }

    // Créer un nouveau controller pour cette requête
    const abortController = new AbortController();
    set({ loading: true, error: null, _abortController: abortController });

    try {
      const currentState = get();
      // Build API filters, prioritize customFilters over current state
      const apiFilters = {
        page,
        limit: 20,
        sortBy: currentState.sortBy,
        sortOrder: currentState.sortOrder,
      };

      // Add search filter (customFilters takes priority)
      const searchValue = customFilters.search !== undefined ? customFilters.search : currentState.searchQuery;
      if (searchValue && searchValue.trim()) {
        apiFilters.search = searchValue.trim();
      }

      // Add category filter (customFilters takes priority) 
      const categoryValue = customFilters.category !== undefined ? customFilters.category : currentState.selectedCategory;
      if (categoryValue && categoryValue !== "all") {
        apiFilters.categoryId = categoryValue;
      }

      // Add other filters (customFilters takes priority)
      const authorValue = customFilters.author !== undefined ? customFilters.author : currentState.filters.author;
      if (authorValue && authorValue.trim()) {
        apiFilters.author = authorValue.trim();
      }

      const languageValue = customFilters.language !== undefined ? customFilters.language : currentState.filters.language;
      if (languageValue && languageValue.trim()) {
        apiFilters.language = languageValue.trim();
      }

      const fileTypeValue = customFilters.fileType !== undefined ? customFilters.fileType : currentState.filters.fileType;
      if (fileTypeValue && fileTypeValue.trim()) {
        apiFilters.fileType = fileTypeValue.trim();
      }

      console.log('Calling API with filters:', apiFilters);
      const response = await libraryAPI.getBooks(apiFilters, { signal: abortController.signal });
      
      // Vérifier que la requête n'a pas été annulée
      if (!abortController.signal.aborted) {
        set({
          books: response.data.data.books || [],
          currentPage: response.data.data.pagination?.currentPage || page,
          totalPages: response.data.data.pagination?.totalPages || 0,
          totalCount: response.data.data.pagination?.totalCount || 0,
          loading: false,
          _abortController: null
        });
      }
    } catch (error) {
      // Ne pas afficher d'erreur si la requête a été annulée
      if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
        set({ loading: false, _abortController: null });
        return;
      }
      
      console.error('Error fetching books:', error);
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des livres',
        loading: false,
        _abortController: null
      });
    }
  },

  fetchBookById: async (bookId) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryAPI.getBookById(bookId);
      set({
        currentBook: response.data.data.book,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Livre non trouvé',
        loading: false
      });
    }
  },

  fetchCategories: async (includeInactive = false) => {
    try {
      const response = await libraryAPI.getCategories(includeInactive);
      set({ categories: response.data.data.categories || [] });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      set({ categories: [] }); // Ensure categories is always an array
    }
  },

  fetchBookmarks: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryAPI.getUserBookmarks(page);
      set({
        bookmarks: response.data.data.bookmarks,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des favoris',
        loading: false
      });
    }
  },

  fetchLibraryStats: async () => {
    try {
      const response = await libraryAPI.getLibraryStats();
      set({ libraryStats: response.data.data });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  },

  // Actions de recherche et filtrage
  searchBooks: async (query, page = 1) => {
    set({ searchQuery: query, currentPage: 1 });
    await get().fetchBooks(page, { search: query });
  },

  filterByCategory: async (categoryId, page = 1) => {
    set({ selectedCategory: categoryId, currentPage: 1 });
    await get().fetchBooks(page, { categoryId: categoryId !== "all" ? categoryId : "" });
  },

  setFilters: async (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1
    }));
    await get().fetchBooks(1, newFilters);
  },

  setSortBy: async (sortBy, sortOrder = "desc") => {
    set({ sortBy, sortOrder, currentPage: 1 });
    await get().fetchBooks(1, { sortBy, sortOrder });
  },

  // Actions pour les favoris
  toggleBookmark: async (bookId) => {
    try {
      const response = await libraryAPI.toggleBookmark(bookId);
      
      // Mettre à jour le livre actuel si chargé
      const currentBook = get().currentBook;
      if (currentBook && currentBook.id === bookId) {
        set({
          currentBook: {
            ...currentBook,
            isBookmarked: response.data.isBookmarked
          }
        });
      }
      
      // Mettre à jour la liste des livres
      const books = get().books;
      const updatedBooks = books.map(book => 
        book.id === bookId 
          ? { ...book, isBookmarked: response.data.data.isBookmarked }
          : book
      );
      set({ books: updatedBooks });
      
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erreur lors de la mise à jour des favoris' });
      throw error;
    }
  },

  // Actions pour les avis
  addReview: async (bookId, reviewData) => {
    try {
      const response = await libraryAPI.addReview(bookId, reviewData);
      
      // Recharger le livre pour mettre à jour les avis
      if (get().currentBook?.id === bookId) {
        await get().fetchBookById(bookId);
      }
      
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erreur lors de l\'ajout de l\'avis' });
      throw error;
    }
  },

  deleteReview: async (bookId) => {
    try {
      await libraryAPI.deleteReview(bookId);
      
      // Recharger le livre pour mettre à jour les avis
      if (get().currentBook?.id === bookId) {
        await get().fetchBookById(bookId);
      }
      
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erreur lors de la suppression de l\'avis' });
      throw error;
    }
  },


  // Actions de sélection (pour le panier)
  addBook: (book) => {
    const state = get();
    if (!state.selectedBooks.some((b) => b.id === book.id)) {
      set((state) => ({
        selectedBooks: [...state.selectedBooks, book],
      }));
    }
  },

  removeBook: (bookId) => {
    set((state) => ({
      selectedBooks: state.selectedBooks.filter((b) => b.id !== bookId),
    }));
  },

  clearSelection: () => set({ selectedBooks: [] }),

  // Cart-specific actions
  addToCart: (book) => {
    const state = get();
    if (!state.selectedBooks.some((b) => b.id === book.id)) {
      set((state) => ({
        selectedBooks: [...state.selectedBooks, book],
        showCart: true // Auto-show cart when adding item
      }));
    }
  },

  removeFromCart: (bookId) => {
    set((state) => ({
      selectedBooks: state.selectedBooks.filter((b) => b.id !== bookId),
    }));
  },

  updateCartQuantity: (bookId, quantity) => {
    // For digital books, quantity is always 1, but keeping this for consistency
    if (quantity <= 0) {
      get().removeFromCart(bookId);
    }
  },

  getCartTotal: () => {
    const state = get();
    return state.selectedBooks.reduce((total, book) => {
      const price = book.isFree ? 0 : (book.price || 0);
      return total + price;
    }, 0);
  },

  getCartCount: () => {
    return get().selectedBooks.length;
  },

  clearCart: () => {
    set({ selectedBooks: [], showCart: false });
  },

  // Payment and Order actions
  createOrder: async (paymentMethod = 'CARD') => {
    set({ loading: true, error: null });
    try {
      const state = get();
      const orderData = {
        items: state.selectedBooks.map(book => ({
          bookId: book.id,
          quantity: 1,
          unitPrice: book.isFree ? 0 : (book.price || 0)
        })),
        paymentMethod,
        totalAmount: state.getCartTotal()
      };

      const response = await libraryAPI.createOrder(orderData);
      
      // Clear cart after successful order creation
      set({ 
        selectedBooks: [],
        showCart: false,
        loading: false 
      });
      
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors de la création de la commande',
        loading: false
      });
      throw error;
    }
  },

  processPayment: async (orderId, paymentData) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryAPI.processPayment(orderId, paymentData);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors du paiement',
        loading: false
      });
      throw error;
    }
  },

  getUserOrders: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await libraryAPI.getUserOrders(page);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des commandes',
        loading: false
      });
      throw error;
    }
  },

  // Actions d'interface
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setShowFilters: (show) => set({ showFilters: show }),
  toggleCart: () => set((state) => ({ showCart: !state.showCart })),
  setShowCart: (show) => set({ showCart: show }),
  
  // Filter actions
  setFilters: (newFilters) => {
    set({ filters: newFilters });
    // Trigger refetch with current state plus new filters
    const state = get();
    get().fetchBooks(1, {
      search: state.searchQuery,
      category: state.selectedCategory !== "all" ? state.selectedCategory : "",
      ...newFilters
    });
  },
  
  setSortBy: (sortBy, sortOrder = "desc") => {
    set({ sortBy, sortOrder });
    // Trigger refetch with current filters and new sort
    const state = get();
    get().fetchBooks(1, {
      search: state.searchQuery,
      category: state.selectedCategory !== "all" ? state.selectedCategory : "",
      ...state.filters
    });
  },
  
  // Search and filter functions
  searchBooks: async (query, category = "all", customFilters = {}) => {
    const state = get();
    const newFilters = customFilters || state.filters;
    
    console.log('searchBooks called with:', { query, category, customFilters });
    
    // Update state first
    set({ 
      searchQuery: query || "",
      selectedCategory: category || "all",
      filters: newFilters
    });
    
    // Fetch books with search parameters
    await get().fetchBooks(1, {
      search: query,
      category: category !== "all" ? category : "",
      ...newFilters
    });
  },
  
  filterByCategory: async (categoryId) => {
    set({ selectedCategory: categoryId });
    await get().fetchBooks(1, {
      category: categoryId !== "all" ? categoryId : ""
    });
  },

  // Actions de pagination
  goToPage: async (page) => {
    if (page >= 1 && page <= get().totalPages) {
      await get().fetchBooks(page);
    }
  },

  nextPage: async () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      await get().fetchBooks(currentPage + 1);
    }
  },

  prevPage: async () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      await get().fetchBooks(currentPage - 1);
    }
  },

  // Utilitaires
  clearCurrentBook: () => set({ currentBook: null }),
  clearError: () => set({ error: null }),

  getTotalPrice: () => {
    const state = get();
    return state.selectedBooks.reduce((total, book) => total + (book.price || 0), 0);
  },

  getBookById: (id) => {
    const state = get();
    return state.books.find((book) => book.id === id);
  },

  // Getters calculés pour compatibilité
  getFilteredBooks: () => {
    return get().books; // Les livres sont déjà filtrés par l'API
  },

  getCategories: () => {
    return get().categories.map(cat => cat.name);
  },

  // Initialisation
  initialize: async () => {
    try {
      const actions = [
        get().fetchBooks(),
        get().fetchCategories(),
        get().fetchLibraryStats()
      ];
      
      const results = await Promise.allSettled(actions);
      
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Action ${index} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Initialize error:', error);
    }
  },

  // Reset du store
  reset: () => {
    const state = get();
    // Annuler les requêtes en cours
    if (state._abortController) {
      state._abortController.abort();
    }
    
    set({
      books: [],
      categories: [],
      bookmarks: [],
      currentBook: null,
      libraryStats: null,
      selectedBooks: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      searchQuery: "",
      selectedCategory: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      showCart: false,
      showFilters: false,
      filters: {
        author: "",
        language: "",
        fileType: "",
      },
      _abortController: null
    });
  },
}));
*/

// Empty store for MVP
export const useBookStore = () => ({
  books: [],
  categories: [],
  selectedBooks: [],
  loading: false,
  error: null,
  showCart: false,
  initialize: () => {},
  clearError: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  toggleCart: () => {},
  getCartCount: () => 0,
  getCartTotal: () => 0,
  clearCart: () => {},
  createOrder: () => Promise.resolve({ id: 'test' }),
  processPayment: () => Promise.resolve({ success: true }),
  searchBooks: () => {},
  filterByCategory: () => {},
  fetchBooks: () => {},
  goToPage: () => {},
  nextPage: () => {},
  prevPage: () => {},
  setSearchQuery: () => {},
  setSelectedCategory: () => {},
  setSortBy: () => {},
  setShowCart: () => {},
  setShowFilters: () => {},
  setFilters: () => {},
});
