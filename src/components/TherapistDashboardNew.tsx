import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  DollarSign,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PageTransition3D } from './3DGraphics';
import { TherapistProfileSimple } from './TherapistProfileSimple';
import { BookingModalNew } from './BookingModalNew';
import { useNavigate } from 'react-router-dom';
import { therapistAPI } from '../services/api';
import { toast } from 'sonner@2.0.3';

// Type definition matching backend response
interface Therapist {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  about: string;
  specializations: string[];
  education: string;
  experience: number;
  languages: string[];
  pricePerSession: number;
  sessionDuration: number;
  rating: number;
  reviewCount?: number;
  totalReviews?: number;
  isActive: boolean;
  currentSession?: {
    isActive: boolean;
  };
}

type ViewMode = 'browse' | 'profile' | 'booking';

interface TherapistDashboardNewProps {
  onBack?: () => void;
}

export function TherapistDashboardNew({ onBack }: TherapistDashboardNewProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'cost'>('rating');

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await therapistAPI.getAll();
      if (response.success) {
        setTherapists(response.data);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Failed to load therapists');
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  // Filter and sort therapists
  const filteredTherapists = therapists
    .filter(therapist => {
      const matchesSearch = 
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        therapist.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'experience':
          return b.experience - a.experience;
        case 'cost':
          return a.pricePerSession - b.pricePerSession;
        default:
          return 0;
      }
    });

  const handleSelectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setViewMode('profile');
  };

  const handleBookSession = () => {
    setViewMode('booking');
  };

  // Render different views
  if (viewMode === 'profile' && selectedTherapist) {
    return (
      <TherapistProfileSimple
        therapist={selectedTherapist}
        onBack={() => setViewMode('browse')}
        onBookSession={handleBookSession}
      />
    );
  }

  if (viewMode === 'booking' && selectedTherapist) {
    return (
      <BookingModalNew
        therapist={selectedTherapist}
        onBack={() => setViewMode('profile')}
        onConfirm={() => {
          // Navigate to appointments section after successful booking
          navigate('/dashboard/appointments');
        }}
      />
    );
  }

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-8 pb-8 overflow-hidden">
        {/* Home Button - Top Left */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleHome}
          className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          title="Back to Dashboard"
        >
          <Home className="w-5 h-5" />
        </motion.button>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 max-w-7xl pt-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Find Your Perfect Therapist
            </h1>
            <p className="text-gray-600">
              Connect with licensed professionals who understand you 💜
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-2 border-purple-200 focus:border-purple-400"
                />
              </div>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full md:w-48 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="cost">Lowest Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Therapists Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading therapists...</p>
            </div>
          ) : filteredTherapists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No therapists found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapists.map((therapist, index) => (
                <motion.div
                  key={therapist._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-6">
                      {/* Profile Picture */}
                      <div className="relative mb-4">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-purple-200 group-hover:ring-purple-400 transition-all">
                          <img
                            src={therapist.profilePicture}
                            alt={therapist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Busy Indicator */}
                        {therapist.currentSession?.isActive && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Busy
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center mb-4">
                        <h3 className="mb-1">{therapist.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{therapist.education}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{therapist.rating || 5.0}</span>
                          <span className="text-xs text-gray-500">
                            ({therapist.totalReviews || 0} reviews)
                          </span>
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {therapist.specializations.slice(0, 3).map((spec, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>

                        {/* Experience & Cost */}
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                          <span>{therapist.experience}+ years exp</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{therapist.pricePerSession}/session</span>
                          </div>
                        </div>

                        {/* Languages */}
                        <p className="text-xs text-gray-500 mb-4">
                          Speaks: {therapist.languages.join(', ')}
                        </p>
                      </div>

                      {/* View Profile Button */}
                      <Button
                        onClick={() => handleSelectTherapist(therapist)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition3D>
  );
}