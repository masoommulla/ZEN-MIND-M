import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import axios from 'axios';
import { API_URL } from '../config';

interface SessionReviewModalProps {
  sessionId: string;
  therapistId: string;
  onClose: () => void;
}

export function SessionReviewModal({
  sessionId,
  therapistId,
  onClose
}: SessionReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/reviews/submit`,
        {
          appointmentId: sessionId,
          therapistId: therapistId,
          rating: rating,
          comment: review
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Thank you for your feedback! 🌟');
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to submit review');
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
    toast.info('You can always rate your session later from your appointments');
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSkip}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
        >
          <Card className="p-6 bg-white shadow-2xl border-2 border-purple-200">
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Skip (You can rate later)"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-2xl mb-2">How was your session?</h2>
              <p className="text-gray-600">
                Rate your experience with your therapist
              </p>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 text-center mb-3">
                Tap to rate (1-5 stars)
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-all ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-2 text-purple-600"
                >
                  {rating === 5 && '🌟 Excellent!'}
                  {rating === 4 && '😊 Great!'}
                  {rating === 3 && '🙂 Good!'}
                  {rating === 2 && '😐 Okay'}
                  {rating === 1 && '😔 Could be better'}
                </motion.p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-700">
                Share your experience (optional)
              </label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="What did you like? How did you feel? (Keep it constructive and respectful)"
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {review.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Your review will be visible to other teens considering this therapist.
              Please be respectful and constructive.
            </p>
          </Card>
        </motion.div>
      </>
    </AnimatePresence>
  );
}