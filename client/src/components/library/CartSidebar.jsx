// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Gift,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useBookStore } from "../../stores/bookStore";
import PaymentModal from "./PaymentModal";

const CartSidebar = () => {
  const {
    selectedBooks,
    showCart,
    setShowCart,
    removeFromCart,
    clearCart,
    getCartTotal,

    getCartCount,
    createOrder,
    processPayment,

    loading,
  } = useBookStore();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  // Calculs de prix
  const subtotal = getCartTotal();
  const discount = appliedPromo
    ? Math.round(subtotal * (appliedPromo.discount / 100))
    : 0;
  const shipping = 0; // Digital products, no shipping
  const total = subtotal - discount + shipping;

  const handlePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Veuillez saisir un code promo");
      return;
    }

    setPromoError("");

    try {
      // TODO: Replace with actual API call to validate promo code
      // const response = await libraryAPI.validatePromoCode(promoCode.toUpperCase());
      // setAppliedPromo(response.data.data);

      // For now, show error for any promo code since API is not implemented
      setPromoError("Service de codes promo temporairement indisponible");
      setPromoCode("");
    } catch (error) {
      setPromoError(error.response?.data?.error || "Code promo invalide");
      setPromoCode("");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentData) => {
    setIsCheckingOut(true);

    try {
      // Create order
      const order = await createOrder("CARD");

      // Process payment
      const payment = await processPayment(order.id, paymentData);

      alert(
        `Commande confirmée !\n${
          selectedBooks.length
        } livre(s) pour ${formatPrice(total)} FCFA\n\nNuméro de commande: ${
          order.id
        }\n\nMerci pour votre achat !`
      );

      setAppliedPromo(null);
      setShowPaymentModal(false);
    } catch (error) {
      alert("Erreur lors du paiement: " + error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {showCart && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowCart(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2 text-primary-500" />
                Mon Panier
                {selectedBooks.length > 0 && (
                  <span className="ml-2 bg-primary-500 text-white text-sm px-2 py-1 rounded-full">
                    {selectedBooks.length}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto">
              {selectedBooks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center p-6"
                >
                  <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-3">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-xs">
                    Découvrez notre collection et ajoutez vos livres préférés
                  </p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
                  >
                    Parcourir les livres
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </motion.div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Liste des livres */}
                  <div className="space-y-3">
                    {selectedBooks.map((book, index) => (
                      <motion.div
                        key={book.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                      >
                        <div className="relative">
                          <img
                            src={book.coverImage || book.cover}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded shadow-lg"
                          />
                          {book.bestseller && (
                            <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs font-bold px-1 py-0.5 rounded text-black">
                              ⭐
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                            {book.title}
                          </h4>
                          <p className="text-gray-400 text-xs mb-2">
                            {book.author}
                          </p>
                          <p className="text-gray-500 text-xs mb-2">
                            {book.category?.name || "Catégorie"}
                          </p>

                          <div className="flex items-center justify-between">
                            <div>
                              {book.originalPrice > book.price && (
                                <span className="text-xs text-gray-500 line-through block">
                                  {formatPrice(book.originalPrice)} FCFA
                                </span>
                              )}
                              <span className="text-primary-400 font-bold text-sm">
                                {formatPrice(book.price)} FCFA
                              </span>
                            </div>

                            <button
                              onClick={() => removeFromCart(book.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Retirer du panier"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Code promo */}
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Code promo
                    </h4>

                    {appliedPromo ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/20 border border-green-500 rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <div>
                            <span className="text-green-400 font-semibold text-sm">
                              {appliedPromo.code}
                            </span>
                            <p className="text-green-300 text-xs">
                              {appliedPromo.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removePromo}
                          className="text-green-400 hover:text-green-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value);
                              setPromoError(""); // Clear error when typing
                            }}
                            placeholder="Entrez votre code"
                            className={`flex-1 p-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm ${
                              promoError ? "border-red-500" : "border-gray-600"
                            }`}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handlePromoCode()
                            }
                          />
                          <button
                            onClick={handlePromoCode}
                            className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold"
                          >
                            Appliquer
                          </button>
                        </div>
                        {promoError && (
                          <p className="text-red-400 text-xs">{promoError}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer avec résumé et checkout */}
            {selectedBooks.length > 0 && (
              <div className="border-t border-gray-700 bg-gray-800 p-6 space-y-4">
                {/* Résumé des prix */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>
                      Sous-total ({selectedBooks.length} livre
                      {selectedBooks.length > 1 ? "s" : ""})
                    </span>
                    <span>{formatPrice(subtotal)} FCFA</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-green-400">
                      <span>Réduction ({appliedPromo.code})</span>
                      <span>-{formatPrice(discount)} FCFA</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span>Livraison</span>
                    {shipping === 0 ? (
                      <span className="text-green-400">Gratuite</span>
                    ) : (
                      <span>{formatPrice(shipping)} FCFA</span>
                    )}
                  </div>

                  {shipping === 0 && (
                    <div className="flex items-center text-xs text-green-400">
                      <Gift className="w-3 h-3 mr-1" />
                      <span>Livraison gratuite appliquée</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary-400">
                      {formatPrice(total)} FCFA
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Procéder au paiement
                        </>
                      )}
                    </button>

                    <button
                      onClick={clearCart}
                      disabled={isCheckingOut}
                      className="w-full bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors text-sm"
                    >
                      Vider le panier
                    </button>
                  </div>

                  {/* Informations de sécurité */}
                  <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span>Paiement 100% sécurisé</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={total}
        onPayment={handlePayment}
        loading={isCheckingOut}
      />
    </AnimatePresence>
  );
};

export default CartSidebar;
*/

// Empty component for MVP
const CartSidebar = () => null;
export default CartSidebar;
