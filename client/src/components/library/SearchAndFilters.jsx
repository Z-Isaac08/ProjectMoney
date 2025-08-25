// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { Filter, Search, X, Book } from "lucide-react";
import { useBookStore } from "../../stores/bookStore";

const SearchAndFilters = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    sortOrder,
    setSortBy,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    categories = [], // Provide default empty array
    books,
    totalCount,
    loading,
    searchBooks,
    filterByCategory,
  } = useBookStore();

  const sortOptions = [
    { value: "createdAt", label: "Plus récents" },
    { value: "title", label: "Titre (A-Z)" },
    { value: "author", label: "Auteur" },
    { value: "rating", label: "Note" },
    { value: "views", label: "Plus consultés" },
    { value: "downloads", label: "Plus téléchargés" },
  ];

  const fileTypeOptions = [
    { value: "", label: "Tous les formats" },
    { value: "PDF", label: "PDF" },
    { value: "EPUB", label: "EPUB" },
    { value: "MOBI", label: "MOBI" },
    { value: "DOC", label: "DOC" },
    { value: "MP3", label: "Audio" },
    { value: "MP4", label: "Vidéo" },
  ];

  const languageOptions = [
    { value: "", label: "Toutes les langues" },
    { value: "fr", label: "Français" },
    { value: "en", label: "Anglais" },
    { value: "es", label: "Espagnol" },
    { value: "de", label: "Allemand" },
  ];

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set new timeout
    window.searchTimeout = setTimeout(() => {
      searchBooks(value.trim());
    }, 500);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterByCategory(categoryId);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy, sortOrder);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setFilters({
      author: "",
      language: "",
      fileType: "",
    });
    // Trigger a fresh fetch with cleared filters
    searchBooks("", "all", {
      author: "",
      language: "",
      fileType: "",
    });
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur ou tag..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Toggle des filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg transition-all ${
              showFilters
                ? "bg-primary-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Bouton Mes Livres */}
          <button
            onClick={() => window.location.href = '/mes-livres'}
            className="flex items-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            <Book className="w-4 h-4" />
            <span className="hidden sm:inline">Mes Livres</span>
          </button>
        </div>
      </div>

      {/* Résultats de recherche */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          {totalCount} livre(s) trouvé(s)
          {books.length < totalCount && ` (${books.length} affichés)`}
        </span>
        {(searchQuery || selectedCategory !== "all" || filters.author || filters.language || filters.fileType) && (
          <button
            onClick={clearAllFilters}
            className="text-primary-400 hover:text-primary-300 flex items-center space-x-1"
            disabled={loading}
          >
            <X className="w-4 h-4" />
            <span>Effacer les filtres</span>
          </button>
        )}
      </div>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Catégories */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type de fichier */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Format
                </label>
                <select
                  value={filters.fileType}
                  onChange={(e) => handleFiltersChange({ ...filters, fileType: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                >
                  {fileTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Langue */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Langue
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFiltersChange({ ...filters, language: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Author search */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-white mb-3">
                Rechercher par auteur
              </label>
              <input
                type="text"
                placeholder="Nom de l'auteur..."
                value={filters.author}
                onChange={(e) => handleFiltersChange({ ...filters, author: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAndFilters;
*/

// Empty component for MVP
const SearchAndFilters = () => null;
export default SearchAndFilters;
