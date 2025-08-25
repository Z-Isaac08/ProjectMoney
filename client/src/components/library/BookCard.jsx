// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { BookOpen, Check, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useBookStore } from "../../stores/bookStore";

const BookCard = ({ book, index }) => {
  const { selectedBooks, addToCart, removeFromCart } = useBookStore();
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = selectedBooks.some((b) => b.id === book.id);

  const formatPrice = (price) => new Intl.NumberFormat("fr-FR").format(price);

  const getDiscountPercentage = () => {
    if (book.originalPrice > book.price) {
      return Math.round(
        ((book.originalPrice - book.price) / book.originalPrice) * 100
      );
    }
    return 0;
  };

  const handleToggleSelection = (e) => {
    e.stopPropagation();
    isSelected ? removeFromCart(book.id) : addToCart(book);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden hover:shadow-xl">
        <div className="relative">
          <img
            src={book.coverImage || book.cover}
            alt={book.title}
            className="w-full h-48 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {book.isFree && (
            <span className="absolute top-2 left-2 bg-green-500 text-xs font-bold px-3 py-1 rounded-full shadow">
              GRATUIT
            </span>
          )}
          {getDiscountPercentage() > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-xs font-bold px-3 py-1 rounded-full shadow">
              -{getDiscountPercentage()}%
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 hover:text-primary-400 transition">
            {book.title}
          </h3>
          <p className="text-sm text-gray-400 font-medium">{book.author}</p>

          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">{book.rating?.toFixed(1) || "0.0"}</span>
            </div>
            <span>({book._count?.reviews || 0} avis)</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full font-medium">
              {book.category?.name || "Catégorie"}
            </span>
            {book.fileType && (
              <span className="bg-gray-800 px-3 py-2 rounded-lg text-gray-300 font-medium">
                {book.fileType}
              </span>
            )}
          </div>

          <div className="text-center py-4">
            {book.isFree ? (
              <span className="text-green-400 font-bold text-xl">GRATUIT</span>
            ) : (
              <div>
                {getDiscountPercentage() > 0 && (
                  <div className="text-sm line-through text-gray-500 mb-1">
                    {formatPrice(book.originalPrice)} FCFA
                  </div>
                )}
                <div className="text-primary-400 font-bold text-xl">
                  {formatPrice(book.price)} FCFA
                </div>
              </div>
            )}
          </div>

          {book.pages && (
            <div className="flex items-center justify-center text-sm text-gray-500 py-2">
              <BookOpen className="w-5 h-5 mr-2" />
              <span className="font-medium">{book.pages} pages</span>
            </div>
          )}

          <button
            onClick={handleToggleSelection}
            className={`w-full py-3 mt-3 rounded-2xl font-bold text-base flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg ${
              isSelected
                ? "bg-green-500 text-white hover:bg-green-600 shadow-green-500/25"
                : "bg-white text-black hover:bg-gray-100 shadow-xl"
            }`}
          >
            {isSelected ? (
              <Check className="w-6 h-6" />
            ) : (
              <ShoppingCart className="w-6 h-6" />
            )}
            <span>{isSelected ? "Ajouté au panier" : "Ajouter au panier"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
*/

// Empty component for MVP
const BookCard = () => null;
export default BookCard;
