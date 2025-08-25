// LIBRARY FEATURE - COMMENTED OUT FOR MVP
// TODO: Uncomment when library feature is needed in future release

/*
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Lock, CheckCircle } from 'lucide-react'

const PaymentModal = ({ isOpen, onClose, totalAmount, onPayment, loading }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolder: ''
  })

  const [errors, setErrors] = useState({})

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleCardNumberChange = (value) => {
    // Remove spaces and limit to numbers
    const cleanValue = value.replace(/\s/g, '').replace(/\D/g, '')
    
    // Add spaces every 4 digits
    const formattedValue = cleanValue.replace(/(\d{4})/g, '$1 ').trim()
    
    if (cleanValue.length <= 19) {
      handleInputChange('cardNumber', formattedValue)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    const cardNumber = paymentData.cardNumber.replace(/\s/g, '')
    if (!cardNumber || cardNumber.length < 13) {
      newErrors.cardNumber = 'Numéro de carte invalide'
    }
    
    if (!paymentData.expiryMonth || !paymentData.expiryYear) {
      newErrors.expiry = 'Date d\'expiration requise'
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV invalide'
    }
    
    if (!paymentData.cardHolder.trim()) {
      newErrors.cardHolder = 'Nom du titulaire requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const cleanPaymentData = {
      ...paymentData,
      cardNumber: paymentData.cardNumber.replace(/\s/g, '')
    }
    
    onPayment(cleanPaymentData)
  }

  const handleClose = () => {
    if (!loading) {
      setPaymentData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardHolder: ''
      })
      setErrors({})
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-primary-500 mr-3" />
                  <h2 className="text-xl font-bold text-white">Paiement sécurisé</h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Total */}
              <div className="p-6 bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Montant total</span>
                  <span className="text-2xl font-bold text-primary-400">
                    {formatPrice(totalAmount)} FCFA
                  </span>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Numéro de carte
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full p-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                      }`}
                      disabled={loading}
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nom du titulaire
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardHolder}
                    onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                    placeholder="JOHN DOE"
                    className={`w-full p-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.cardHolder ? 'border-red-500' : 'border-gray-600'
                    }`}
                    disabled={loading}
                  />
                  {errors.cardHolder && (
                    <p className="text-red-400 text-sm mt-1">{errors.cardHolder}</p>
                  )}
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Mois
                    </label>
                    <select
                      value={paymentData.expiryMonth}
                      onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                      className={`w-full p-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.expiry ? 'border-red-500' : 'border-gray-600'
                      }`}
                      disabled={loading}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0')
                        return (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Année
                    </label>
                    <select
                      value={paymentData.expiryYear}
                      onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                      className={`w-full p-3 bg-gray-700 border rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.expiry ? 'border-red-500' : 'border-gray-600'
                      }`}
                      disabled={loading}
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString()
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      CVV
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 4) {
                            handleInputChange('cvv', value)
                          }
                        }}
                        placeholder="123"
                        className={`w-full p-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.cvv ? 'border-red-500' : 'border-gray-600'
                        }`}
                        disabled={loading}
                      />
                      <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                {errors.expiry && (
                  <p className="text-red-400 text-sm">{errors.expiry}</p>
                )}
                {errors.cvv && (
                  <p className="text-red-400 text-sm">{errors.cvv}</p>
                )}

                {/* Security Notice */}
                <div className="bg-green-500/10 border border-green-500 rounded-lg p-3 flex items-center">
                  <Lock className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                  <p className="text-green-300 text-sm">
                    Vos informations sont sécurisées et cryptées
                  </p>
                </div>


                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Payer {formatPrice(totalAmount)} FCFA
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal
*/

// Empty component for MVP
const PaymentModal = () => null;
export default PaymentModal;