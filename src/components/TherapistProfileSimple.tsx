import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Star, 
  Clock, 
  DollarSign, 
  Calendar,
  Award,
  BookOpen,
  Globe,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { PageTransition3D } from './3DGraphics';
import { reviewAPI } from '../services/api';

interface TherapistProfileSimpleProps {
  therapist: any;
  onBack: () => void;
  onBookSession: () => void;
}

export function TherapistProfileSimple({ 
  therapist, 
  onBack, 
  onBookSession
}: TherapistProfileSimpleProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await reviewAPI.getTherapistReviews(therapist._id, 10, 'recent');
        if (response.success) {
          // Fix: The API returns reviews in response.data.reviews, not response.data directly
          setReviews(response.data?.reviews || []);
        }
      } catch (error: any) {
        console.error('Failed to fetch reviews:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (therapist?._id) {
      fetchReviews();
    }
  }, [therapist?._id]);

  // Add safety check for therapist data
  if (!therapist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading therapist profile...</p>
      </div>
    );
  }

  const ratingPercentage = ((therapist.rating || 5) / 5) * 100;

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Therapists</span>
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-6 border-2 border-purple-100">
                <CardContent className="p-6">
                  {/* Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-purple-200 mb-4">
                      <img
                        src={therapist.profilePicture}
                        alt={therapist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl mb-1">{therapist.name}</h2>
                    <p className="text-gray-600 mb-3">{therapist.education}</p>
                  </div>

                  <Separator className="my-6" />

                  {/* Quick Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span>Experience</span>
                      </div>
                      <span className="font-semibold">{therapist.experience} years</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-5 h-5" />
                        <span>Per Session</span>
                      </div>
                      <span className="font-semibold">₹{therapist.pricing?.perSession || therapist.pricePerSession || 500}/30min</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span>Rating</span>
                      </div>
                      <span className="font-semibold">{therapist.rating || 5.0}/5.0</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-5 h-5" />
                        <span>Languages</span>
                      </div>
                      <span className="font-semibold text-sm text-right">
                        {therapist.languages?.join(', ') || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Book Session Button - PRIMARY ACTION */}
                  <Button
                    onClick={onBookSession}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    size="lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* About Section */}
              <Card className="border-2 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h3>About</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {therapist.about}
                  </p>
                </CardContent>
              </Card>

              {/* Specializations */}
              <Card className="border-2 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-purple-600" />
                    <h3>Specializations</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(therapist.specializations || []).map((spec: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education & Experience */}
              <Card className="border-2 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    <h3>Education & Experience</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Education</p>
                      <p className="font-medium">{therapist.education}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Experience</p>
                      <p className="font-medium">{therapist.experience}+ years of professional practice</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card className="border-2 border-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-purple-600" />
                    <h3>Reviews</h3>
                  </div>
                  
                  {loadingReviews ? (
                    <p className="text-gray-500 text-center py-4">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No reviews yet</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.slice(0, 5).map((review: any, index: number) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.userName || 'Anonymous User'}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600">{review.comment}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition3D>
  );
}