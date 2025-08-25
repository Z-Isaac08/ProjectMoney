// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X } from 'lucide-react'
import { useBookStore } from '../../stores/bookStore'

const FloatingCartButton = () => {
  const { selectedBooks, showCart, toggleCart, getCartCount, getCartTotal } = useBookStore()
  
  const cartCount = getCartCount()
  const cartTotal = getCartTotal()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  if (cartCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={toggleCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-2xl transition-colors relative group"
        >
          {showCart ? (
            <X className="w-6 h-6" />
          ) : (
            <ShoppingCart className="w-6 h-6" />
          )}
          
          {/* Badge avec le nombre d'articles */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {cartCount}
          </motion.div>
        </motion.button>

        {/* Tooltip avec le total */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {cartCount} livre{cartCount > 1 ? 's' : ''} • {formatPrice(cartTotal)} FCFA
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FloatingCartButton;
*/

// Empty component for MVP
const FloatingCartButton = () => null;
export default FloatingCartButton;
