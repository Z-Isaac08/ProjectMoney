// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Download, Search, Calendar, Eye } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useBookStore } from '../stores/bookStore'
import Loading from '../components/ui/Loading'

const MyBooksPage = () => {
  const navigate = useNavigate()
  const { loading, error } = useBookStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [purchasedBooks, setPurchasedBooks] = useState([])

  useEffect(() => {
    const fetchPurchasedBooks = async () => {
      try {
        // TODO: Replace with actual API call to fetch user's purchased books
        // const response = await libraryAPI.getUserPurchasedBooks();
        // setPurchasedBooks(response.data.data);
        
        // For now, set empty array until API is implemented
        setPurchasedBooks([]);
      } catch (error) {
        console.error('Error fetching purchased books:', error);
      }
    };
    
    fetchPurchasedBooks();
  }, [])

  const handleDownload = (book) => {
    // Créer un lien de téléchargement
    const link = document.createElement('a')
    link.href = book.fileUrl
    link.download = `${book.title}.${book.fileType.toLowerCase()}`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredBooks = purchasedBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/librairie')}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-primary-500" />
                  Mes Livres
                </h1>
                <p className="text-gray-400 mt-1">
                  {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''} acheté{filteredBooks.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher dans mes livres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loading size="lg" text="Chargement de vos livres..." />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {!loading && filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-3">
              {searchQuery ? 'Aucun livre trouvé' : 'Aucun livre acheté'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Aucun livre ne correspond à votre recherche.'
                : 'Vous n\'avez encore acheté aucun livre. Découvrez notre collection et commencez votre bibliothèque.'
              }
            </p>
            <button
              onClick={() => navigate('/library')}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Parcourir la librairie
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10"
              >
                <div className="relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {book.fileType}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-lg leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">{book.author}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Acheté le {formatDate(book.purchaseDate)}</span>
                    </span>
                    {book.pages && (
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{book.pages}p</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-300 px-3 py-1 rounded-full border border-primary-500/20 inline-block">
                    {book.category.name}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleDownload(book)}
                      className="flex-1 bg-primary-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-primary-600 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger</span>
                    </button>
                    <button
                      className="p-2.5 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-300"
                      title="Prévisualiser"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBooksPage
*/

// Empty component for MVP
const MyBooksPage = () => <div>My Books feature coming soon...</div>;
export default MyBooksPage;