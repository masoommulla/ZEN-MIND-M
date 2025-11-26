import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface FakePaymentModalProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentMethod = 'card' | 'upi' | null;

export function FakePaymentModal({ amount, onSuccess, onCancel }: FakePaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI payment field
  const [upiId, setUpiId] = useState('');

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setPaymentSuccess(true);

    // Show success animation, then call onSuccess
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <AnimatePresence mode="wait">
        {paymentSuccess ? (
          // Success Animation
          <motion.div
            key="success"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 1,
              }}
              className="relative"
            >
              <Card className="w-full max-w-md border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-24 h-24 mx-auto text-green-500 mb-6" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl mb-2 text-green-700">Payment Successful!</h2>
                    <p className="text-lg text-gray-600 mb-2">₹{amount} paid</p>
                    <p className="text-sm text-gray-500">Redirecting to appointments...</p>
                  </motion.div>

                  {/* Confetti particles */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'][i % 4],
                        left: '50%',
                        top: '50%',
                      }}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 400 - 200,
                        opacity: [1, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: Math.random() * 0.3,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          // Payment Form
          <motion.div
            key="payment"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md"
          >
            <Card className="border-2 border-purple-200">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl">Complete Payment</h3>
                  <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Amount Display */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl text-purple-600">₹{amount}</p>
                </div>

                {/* Payment Method Selection */}
                {!selectedMethod && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">Select Payment Method</p>
                    
                    <button
                      onClick={() => setSelectedMethod('card')}
                      className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg">Credit / Debit Card</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedMethod('upi')}
                      className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg">UPI Payment</p>
                          <p className="text-sm text-gray-500">PhonePe, Google Pay, Paytm</p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Card Payment Form */}
                {selectedMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Button
                      onClick={() => setSelectedMethod(null)}
                      variant="ghost"
                      className="mb-4"
                    >
                      ← Back
                    </Button>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Card Number</label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Cardholder Name</label>
                      <Input
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Expiry Date</label>
                        <Input
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">CVV</label>
                        <Input
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          maxLength={3}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={processing || !cardNumber || !cardName || !expiryDate || !cvv}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mt-6"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${amount}`
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* UPI Payment Form */}
                {selectedMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Button
                      onClick={() => setSelectedMethod(null)}
                      variant="ghost"
                      className="mb-4"
                    >
                      ← Back
                    </Button>

                    <div>
                      <label className="text-sm font-medium mb-2 block">UPI ID</label>
                      <Input
                        placeholder="username@paytm / username@ybl"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 mb-2">Popular UPI Apps:</p>
                      <div className="flex gap-2 flex-wrap">
                        {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map((app) => (
                          <span key={app} className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border border-blue-200">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={processing || !upiId}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mt-6"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${amount}`
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Fake Payment Note */}
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 text-center">
                    🔒 This is a demo payment. No real transaction will be made.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}