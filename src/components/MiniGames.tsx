import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Star, 
  Trophy,
  RotateCcw,
  Play,
  Wind,
  Smile,
  Frown,
  Meh,
  Brain,
  Timer,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export function MiniGames() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Test your memory with this fun card matching game',
      icon: Brain,
      color: 'from-purple-400 to-pink-400',
      emoji: '🧠'
    },
    {
      id: 'breathing',
      title: 'Breathing Exercise',
      description: 'Calm your mind with guided breathing',
      icon: Wind,
      color: 'from-blue-400 to-cyan-400',
      emoji: '🫁'
    },
    {
      id: 'mood-quiz',
      title: 'Mood Booster Quiz',
      description: 'Fun quiz to understand and boost your mood',
      icon: Smile,
      color: 'from-yellow-400 to-orange-400',
      emoji: '😊'
    },
    {
      id: 'reaction',
      title: 'Reaction Time',
      description: 'Test your reflexes and concentration',
      icon: Zap,
      color: 'from-green-400 to-teal-400',
      emoji: '⚡'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!selectedGame ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm group overflow-hidden"
                onClick={() => setSelectedGame(game.id)}
              >
                <div className={`relative h-40 bg-gradient-to-r ${game.color} flex items-center justify-center`}>
                  <motion.div
                    className="text-6xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {game.emoji}
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <game.icon className="w-5 h-5" />
                    {game.title}
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedGame(null)}
            className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center gap-2"
          >
            ← Back to Games
          </motion.button>
          
          {selectedGame === 'memory' && <MemoryGame />}
          {selectedGame === 'breathing' && <BreathingExercise />}
          {selectedGame === 'mood-quiz' && <MoodQuiz />}
          {selectedGame === 'reaction' && <ReactionGame />}
        </div>
      )}
    </motion.div>
  );
}

// Memory Match Game
function MemoryGame() {
  const emojis = ['🌟', '💖', '🌈', '🦋', '🌸', '✨', '🎨', '🎵'];
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (cards[first].emoji === cards[second].emoji) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setMatches(matches + 1);
        setFlippedIndices([]);

        if (matches + 1 === emojis.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Memory Match
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializeGame}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </motion.button>
        </CardTitle>
        <CardDescription>
          Find all matching pairs! Moves: {moves} | Matches: {matches}/{emojis.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gameWon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-6 p-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl text-center text-white"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-white mb-2">You Won! 🎉</h3>
            <p className="text-white/90">Completed in {moves} moves!</p>
          </motion.div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: card.matched ? 1 : 1.05 }}
              whileTap={{ scale: card.matched ? 1 : 0.95 }}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer transition-all ${
                card.matched
                  ? 'bg-gradient-to-r from-green-400 to-teal-400 scale-95'
                  : card.flipped
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                  : 'bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500'
              }`}
            >
              {(card.flipped || card.matched) ? card.emoji : '?'}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Breathing Exercise
function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const phases = {
      inhale: 4000,
      hold: 4000,
      exhale: 4000
    };

    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('hold');
      } else if (phase === 'hold') {
        setPhase('exhale');
      } else {
        setPhase('inhale');
        setCycleCount(cycleCount + 1);
      }
    }, phases[phase]);

    return () => clearTimeout(timer);
  }, [isActive, phase, cycleCount]);

  const circleScale = phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1;
  const duration = 4;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-blue-600" />
          Box Breathing Exercise
        </CardTitle>
        <CardDescription>
          Follow the circle: Inhale (4s) → Hold (4s) → Exhale (4s) → Repeat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{
              scale: circleScale,
              backgroundColor: phase === 'inhale' 
                ? '#60A5FA' 
                : phase === 'hold' 
                ? '#F59E0B' 
                : '#10B981'
            }}
            transition={{ duration, ease: 'easeInOut' }}
            className="w-64 h-64 rounded-full flex items-center justify-center text-white shadow-2xl"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">
                {phase === 'inhale' ? '↑' : phase === 'hold' ? '⏸' : '↓'}
              </div>
              <p className="text-2xl capitalize">{phase}</p>
            </div>
          </motion.div>

          <p className="mt-8 text-lg text-gray-600">
            Cycles completed: {cycleCount}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-4 rounded-full text-white flex items-center gap-2 ${
              isActive 
                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
          >
            {isActive ? 'Pause' : 'Start'}
          </motion.button>
          
          {cycleCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsActive(false);
                setPhase('inhale');
                setCycleCount(0);
              }}
              className="px-8 py-4 bg-gray-200 rounded-full flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </motion.button>
          )}
        </div>

        {cycleCount >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl text-center"
          >
            <p className="text-green-800">
              Great job! You're doing amazing! 🌟 Keep breathing!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Mood Booster Quiz
function MoodQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = [
    {
      question: "What's your go-to activity when you're feeling stressed?",
      answers: [
        { text: "Listening to music 🎵", points: 3 },
        { text: "Talking to friends 💬", points: 2 },
        { text: "Going for a walk 🚶", points: 3 },
        { text: "Playing games 🎮", points: 2 }
      ]
    },
    {
      question: "How do you usually start your day?",
      answers: [
        { text: "Checking my phone 📱", points: 1 },
        { text: "Stretching or exercising 🧘", points: 3 },
        { text: "Having breakfast 🍳", points: 2 },
        { text: "Hitting snooze 😴", points: 1 }
      ]
    },
    {
      question: "What makes you feel most energized?",
      answers: [
        { text: "Spending time with loved ones ❤️", points: 3 },
        { text: "Accomplishing a goal 🎯", points: 3 },
        { text: "Trying something new 🌟", points: 2 },
        { text: "Relaxing alone 🛋️", points: 2 }
      ]
    },
    {
      question: "When facing a challenge, you usually...",
      answers: [
        { text: "Break it into smaller steps 📋", points: 3 },
        { text: "Ask for help 🤝", points: 2 },
        { text: "Take a break first 💭", points: 2 },
        { text: "Dive right in! 🚀", points: 3 }
      ]
    },
    {
      question: "Your ideal way to wind down?",
      answers: [
        { text: "Reading or journaling 📖", points: 3 },
        { text: "Watching shows/videos 📺", points: 2 },
        { text: "Creative activities 🎨", points: 3 },
        { text: "Social media scrolling 📱", points: 1 }
      ]
    }
  ];

  const handleAnswerClick = (points: number, index: number) => {
    setSelectedAnswer(index);
    setTimeout(() => {
      setScore(score + points);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const getMoodResult = () => {
    if (score >= 12) {
      return {
        title: "Mood Master! 🌟",
        message: "You have amazing self-care habits! Keep up the fantastic work!",
        color: "from-green-400 to-teal-400",
        emoji: "🎉"
      };
    } else if (score >= 8) {
      return {
        title: "On the Right Track! 😊",
        message: "You're doing well! A few small tweaks and you'll feel even better!",
        color: "from-blue-400 to-cyan-400",
        emoji: "👍"
      };
    } else {
      return {
        title: "Room to Grow! 🌱",
        message: "Everyone starts somewhere! Try incorporating more positive habits daily!",
        color: "from-purple-400 to-pink-400",
        emoji: "💪"
      };
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-yellow-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-6 h-6 text-yellow-600" />
          Mood Booster Quiz
        </CardTitle>
        {!showResult && (
          <CardDescription>
            Question {currentQuestion + 1} of {questions.length}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!showResult ? (
          <div className="space-y-6">
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
            
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-gray-800">{questions[currentQuestion].question}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerClick(answer.points, index)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedAnswer === index
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300 bg-white'
                    }`}
                  >
                    {answer.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className={`p-8 rounded-2xl bg-gradient-to-r ${getMoodResult().color} text-white`}>
              <div className="text-6xl mb-4">{getMoodResult().emoji}</div>
              <h2 className="text-white mb-4">{getMoodResult().title}</h2>
              <p className="text-white/90 mb-4">{getMoodResult().message}</p>
              <div className="text-4xl text-white">
                Score: {score}/{questions.length * 3}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Take Quiz Again
            </motion.button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// Reaction Time Game
function ReactionGame() {
  const [gameState, setGameState] = useState<'ready' | 'waiting' | 'click' | 'result'>('ready');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  const startGame = () => {
    setGameState('waiting');
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      setGameState('click');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('ready');
      return;
    }

    if (gameState === 'click') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setAttempts(attempts + 1);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
      }
      setGameState('result');
    }
  };

  const reset = () => {
    setGameState('ready');
    setReactionTime(0);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-600" />
          Reaction Time Test
        </CardTitle>
        <CardDescription>
          Click as fast as you can when the color changes!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-gray-600 mb-1">Attempts</p>
            <p className="text-2xl text-purple-600">{attempts}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-gray-600 mb-1">Best Time</p>
            <p className="text-2xl text-green-600">
              {bestTime ? `${bestTime}ms` : '-'}
            </p>
          </div>
        </div>

        <motion.div
          onClick={handleClick}
          className={`h-80 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            gameState === 'ready'
              ? 'bg-gradient-to-r from-blue-400 to-cyan-400'
              : gameState === 'waiting'
              ? 'bg-gradient-to-r from-red-400 to-orange-400'
              : gameState === 'click'
              ? 'bg-gradient-to-r from-green-400 to-teal-400'
              : 'bg-gradient-to-r from-purple-400 to-pink-400'
          }`}
        >
          {gameState === 'ready' && (
            <div className="text-center text-white">
              <Target className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-white mb-2">Ready?</h3>
              <p className="text-white/90">Click to start!</p>
            </div>
          )}
          {gameState === 'waiting' && (
            <div className="text-center text-white">
              <Timer className="w-20 h-20 mx-auto mb-4 animate-pulse" />
              <h3 className="text-white mb-2">Wait for it...</h3>
              <p className="text-white/90">Don't click yet!</p>
            </div>
          )}
          {gameState === 'click' && (
            <div className="text-center text-white">
              <Zap className="w-20 h-20 mx-auto mb-4 animate-bounce" />
              <h3 className="text-white mb-2">CLICK NOW!</h3>
            </div>
          )}
          {gameState === 'result' && (
            <div className="text-center text-white">
              <Trophy className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-white mb-4">Your Time</h3>
              <p className="text-6xl text-white mb-4">{reactionTime}ms</p>
              <p className="text-white/90">
                {reactionTime < 200 ? 'Lightning fast! ⚡' :
                 reactionTime < 300 ? 'Great reflexes! 🎯' :
                 reactionTime < 400 ? 'Good job! 👍' :
                 'Keep practicing! 💪'}
              </p>
            </div>
          )}
        </motion.div>

        {gameState === 'result' && (
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                reset();
                setAttempts(0);
                setBestTime(null);
              }}
              className="px-8 py-4 bg-gray-200 rounded-full flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset All
            </motion.button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
