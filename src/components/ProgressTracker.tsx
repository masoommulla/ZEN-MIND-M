import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Award, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { FloatingBackButton } from './FloatingBackButton';
import { Animated3DBackground, PageTransition3D } from './3DGraphics';
import { FloatingSticker } from './DecorativeElements';
import { HappyCharacter } from './AnimeCharacters';

interface ProgressTrackerProps {
  onBack: () => void;
}

export function ProgressTracker({ onBack }: ProgressTrackerProps) {
  const [overallProgress] = useState(75);

  const milestones = [
    { id: 1, title: 'First Session Completed', date: '2024-10-15', completed: true },
    { id: 2, title: 'Shared Personal Goals', date: '2024-10-18', completed: true },
    { id: 3, title: '5 Sessions Milestone', date: '2024-10-25', completed: true },
    { id: 4, title: 'Practiced Coping Strategies', date: '2024-10-30', completed: true },
    { id: 5, title: '10 Sessions Milestone', date: 'In Progress', completed: false },
    { id: 6, title: 'Master Anxiety Management', date: 'Upcoming', completed: false },
  ];

  const goals = [
    { id: 1, title: 'Manage Anxiety', progress: 80, status: 'On Track' },
    { id: 2, title: 'Improve Sleep', progress: 65, status: 'In Progress' },
    { id: 3, title: 'Build Confidence', progress: 90, status: 'Excellent' },
    { id: 4, title: 'Social Skills', progress: 55, status: 'Needs Attention' },
  ];

  const weeklyMood = [
    { day: 'Mon', mood: 7 },
    { day: 'Tue', mood: 6 },
    { day: 'Wed', mood: 8 },
    { day: 'Thu', mood: 7 },
    { day: 'Fri', mood: 9 },
    { day: 'Sat', mood: 8 },
    { day: 'Sun', mood: 7 },
  ];

  const maxMood = 10;

  return (
    <PageTransition3D>
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-24 pb-8 overflow-hidden">
        <Animated3DBackground />
        <FloatingBackButton onBack={onBack} label="Back" onHome={onBack} />

        <FloatingSticker emoji="📈" className="absolute top-20 right-20" delay={0} />
        <FloatingSticker emoji="🎯" className="absolute bottom-40 left-20" delay={1} />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Your Progress
            </h1>
            <p className="text-gray-600 text-lg">
              Track your mental health journey and celebrate your achievements
            </p>
          </motion.div>

          {/* Overall Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-purple-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl mb-1">Overall Progress</h2>
                    <p className="text-purple-100">Keep up the amazing work!</p>
                  </div>
                  <div className="text-5xl">
                    {overallProgress}%
                  </div>
                </div>
                <Progress value={overallProgress} className="h-3 bg-white/20" />
              </div>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Goals Progress */}
            <Card className="border-2 border-purple-100 h-full shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Current Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals.map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{goal.title}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            goal.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                            goal.status === 'On Track' ? 'bg-blue-100 text-blue-700' :
                            goal.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {goal.status}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="text-right text-sm text-gray-600 mt-1">
                          {goal.progress}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 border-purple-300 text-purple-700 hover:bg-purple-50" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Goal
                  </Button>
                </CardContent>
              </Card>

            {/* Weekly Mood Chart */}
            <Card className="border-2 border-purple-100 h-full shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-500" />
                    Weekly Mood Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-48 gap-2">
                    {weeklyMood.map((day, index) => (
                      <motion.div
                        key={day.day}
                        className="flex-1 flex flex-col items-center gap-2"
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative w-full flex-1 flex items-end">
                          <motion.div
                            className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative overflow-hidden"
                            style={{ height: `${(day.mood / maxMood) * 100}%` }}
                            whileHover={{ scale: 1.05 }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: index * 0.1, type: 'spring' }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-white text-xs font-semibold">
                              {day.mood}
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">{day.day}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 text-center">
                      Average mood this week: <strong>7.4/10</strong> 📈
                    </p>
                  </div>
                </CardContent>
              </Card>
          </div>

          {/* Milestones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Milestones & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-gray-300" />

                  <div className="space-y-6">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-4 pl-4"
                      >
                        {/* Timeline dot */}
                        <motion.div
                          className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white ${
                            milestone.completed
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                              : 'bg-gray-300'
                          }`}
                          animate={milestone.completed ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.5, repeat: milestone.completed ? 3 : 0, delay: index * 0.2 }}
                        >
                          {milestone.completed ? (
                            <Award className="w-6 h-6 text-white" />
                          ) : (
                            <Calendar className="w-6 h-6 text-white" />
                          )}
                        </motion.div>

                        <div className="flex-1 ml-12 p-4 bg-white rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold mb-1">{milestone.title}</h3>
                              <p className="text-sm text-gray-600">{milestone.date}</p>
                            </div>
                            {milestone.completed && (
                              <span className="text-2xl">🎉</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-8 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl border-2 border-purple-200 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <HappyCharacter />
            </div>
            <h3 className="text-2xl mb-2">You're Doing Amazing!</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Every step forward is progress, no matter how small. Keep showing up for yourself, 
              and remember that healing isn't linear. You're stronger than you know! 💜
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition3D>
  );
}
