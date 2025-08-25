// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, TrendingUp, Sparkles, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useBookStore } from '../stores/bookStore'
import { useAuthStore } from '../stores/authStore'
import SearchAndFilters from '../components/library/SearchAndFilters'
import BookCard from '../components/library/BookCard'
import FloatingCartButton from '../components/library/FloatingCartButton'
import CartSidebar from '../components/library/CartSidebar'
import Loading from '../components/ui/Loading'

const LibraryPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    books, 
    categories = [], // Provide default empty array
    libraryStats,
    loading, 
    error, 
    selectedBooks, 
    currentPage,
    totalPages,
    totalCount,
    initialize,
    clearError,
    fetchBooks,
    goToPage,
    nextPage,
    prevPage
  } = useBookStore()
  
  // Initialize data on component mount
  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header avec navigation */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-primary-500" />
                  Librairie
                </h1>
                <p className="text-gray-400 mt-1">
                  Découvrez notre collection de {libraryStats?.summary?.publicBooks || 0} livres exceptionnels
                </p>
              </div>
            </div>

            {/* Indicateur de sélection */}
            {selectedBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center space-x-2 bg-primary-500/20 border border-primary-500 rounded-lg px-4 py-2"
              >
                <span className="text-primary-400 font-semibold">
                  {selectedBooks.length} livre{selectedBooks.length > 1 ? 's' : ''} sélectionné{selectedBooks.length > 1 ? 's' : ''}
                </span>
              </motion.div>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <SearchAndFilters />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages d'erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-red-400 font-semibold">Erreur</h3>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading state */}
        {loading && !books.length && (
          <div className="flex justify-center items-center py-20">
            <Loading size="lg" text="Chargement de la bibliothèque..." />
          </div>
        )}

        {/* Section Livres populaires (basée sur les téléchargements) */}
        {libraryStats?.popularBooks?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-yellow-500" />
                Livres populaires
              </h2>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {libraryStats.popularBooks.length} livre{libraryStats.popularBooks.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {libraryStats.popularBooks.slice(0, 6).map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Section Nouveautés */}
        {libraryStats?.recentBooks?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-green-500" />
                Nouveautés
              </h2>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {libraryStats.recentBooks.length} livre{libraryStats.recentBooks.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {libraryStats.recentBooks.slice(0, 6).map((book, index) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Section Tous les livres */}
        {!loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Tous les livres
              </h2>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {totalCount} livre{totalCount > 1 ? 's' : ''} au total
              </span>
            </div>
            
            {!loading && books.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                  Aucun livre trouvé
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Aucun livre ne correspond à vos critères de recherche. 
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button
                  onClick={() => fetchBooks()}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Recharger
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {books.map((book, index) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      index={index}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center items-center space-x-4 mt-12"
                  >
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1 || loading}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Précédent
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + Math.max(1, currentPage - 2);
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            disabled={loading}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => goToPage(totalPages)}
                            disabled={loading}
                            className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages || loading}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.section>
        )}

        {/* Statistiques en bas de page */}
        {libraryStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-gray-800"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">
                {libraryStats.summary?.publicBooks || 0}
              </div>
              <div className="text-sm text-gray-400">Livres disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {libraryStats.summary?.totalDownloads || 0}
              </div>
              <div className="text-sm text-gray-400">Téléchargements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {libraryStats.summary?.totalBookmarks || 0}
              </div>
              <div className="text-sm text-gray-400">Favoris</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {libraryStats.summary?.totalCategories || 0}
              </div>
              <div className="text-sm text-gray-400">Catégories</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Composants flottants */}
      <FloatingCartButton />
      <CartSidebar />
    </div>
  )
}

export default LibraryPage
*/

// Empty component for MVP
const LibraryPage = () => <div>Library feature coming soon...</div>;
export default LibraryPage;