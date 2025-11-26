import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Clock, Video } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { PageTransition3D } from './3DGraphics';
import { FakePaymentModal } from './FakePaymentModal';
import { toast } from 'sonner@2.0.3';
import { API_URL } from '../config';

interface BookingModalNewProps {
  therapist: any;
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingModalNew({ therapist, onBack, onConfirm }: BookingModalNewProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [availableAt, setAvailableAt] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Check therapist availability
  useEffect(() => {
    checkTherapistStatus();
  }, [therapist._id]);

  const checkTherapistStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/booking/therapist-status/${therapist._id}`);
      const data = await response.json();
      
      if (data.success) {
        setIsAvailable(data.data.isAvailable);
        if (data.data.availableAt) {
          setAvailableAt(new Date(data.data.availableAt));
        }
      }
    } catch (error) {
      console.error('Error checking therapist status:', error);
    }
  };

  const handleProceedToPayment = () => {
    if (!isAvailable) {
      toast.error('Therapist is currently busy. Please try again later.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setBookingInProgress(true);

      const response = await fetch(`${API_URL}/api/booking/instant-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          therapistId: therapist._id,
          duration: selectedDuration
        })
      });

      // Check if response is ok before parsing
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Booking failed:', errorText);
        throw new Error(`Booking failed: ${response.status} ${response.statusText}`);
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Session booked successfully! You can join in 5 minutes.');
        
        setTimeout(() => {
          setShowPaymentModal(false);
          onConfirm(); // Redirect to appointments
        }, 1500);
      } else {
        setShowPaymentModal(false);
        toast.error(data.message || 'Booking failed');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      setShowPaymentModal(false);
      toast.error(error.message || 'Failed to book session');
    } finally {
      setBookingInProgress(false);
    }
  };

  // Calculate price based on duration
  const calculatePrice = () => {
    const perMinuteRate = (therapist.pricing?.perSession || therapist.pricePerSession || 500) / 30;
    return Math.ceil(perMinuteRate * selectedDuration);
  };

  const price = calculatePrice();

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </motion.button>

          {/* Therapist Info */}
          <Card className="mb-6 border-2 border-purple-100">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <img
                  src={therapist.profilePicture}
                  alt={therapist.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-200"
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl mb-1">{therapist.name}</h2>
                  <p className="text-gray-600">{therapist.education}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    {therapist.specializations?.slice(0, 3).map((spec: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                {!isAvailable && availableAt && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700 font-semibold mb-1">Therapist is Busy</p>
                    <p className="text-sm text-red-600">
                      Available at {availableAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instant Booking Info */}
          <Card className="mb-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2">Instant Video Session</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Book now and join your session in just 5 minutes! No waiting, no scheduling conflicts.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span>Join button unlocks 5 minutes after booking</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Duration Selection */}
          <Card className="mb-6 border-2 border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3>Select Session Duration</h3>
              </div>

              <div className="space-y-6">
                {/* Duration Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedDuration(30)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedDuration === 30
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-3xl mb-2">30</p>
                      <p className="text-sm text-gray-600">Minutes</p>
                      {selectedDuration === 30 && (
                        <Check className="w-6 h-6 text-purple-600 mx-auto mt-2" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedDuration(60)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedDuration === 60
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-3xl mb-2">60</p>
                      <p className="text-sm text-gray-600">Minutes</p>
                      {selectedDuration === 60 && (
                        <Check className="w-6 h-6 text-purple-600 mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Price Display */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">Session Price</p>
                  <p className="text-4xl text-purple-600 mb-1">₹{price}</p>
                  <p className="text-sm text-gray-600">for {selectedDuration} minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6 border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <h3 className="mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Therapist:</span>
                    <span className="font-semibold">{therapist.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Type:</span>
                    <span className="font-semibold">Instant Video Call</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{selectedDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available to Join:</span>
                    <span className="font-semibold">In 5 minutes</span>
                  </div>
                  <div className="h-px bg-gray-300 my-2"></div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-purple-600">₹{price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirm Button */}
            <Button
              onClick={handleProceedToPayment}
              disabled={bookingInProgress || !isAvailable}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {bookingInProgress ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : !isAvailable ? (
                <>Therapist Currently Busy</>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Book Now & Pay ₹{price}
                </>
              )}
            </Button>

            {!isAvailable && availableAt && (
              <p className="text-center text-sm text-red-600 mt-3">
                Please wait until {availableAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} to book
              </p>
            )}
          </motion.div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <FakePaymentModal
            amount={price}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </PageTransition3D>
  );
}