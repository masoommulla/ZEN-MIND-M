// Comprehensive mood-based suggestions system
// Generates personalized content based on mood intensity (1-10) and selected emotion

const moodSuggestions = {
  // Anxious emotions across intensity levels
  anxious: {
    1: { // Severe anxiety
      activity: '🧘 Deep Breathing Exercise: Try box breathing - breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 5 times.',
      book: '📚 "The Anxiety and Phobia Workbook" by Edmund Bourne - Practical techniques for managing severe anxiety',
      song: '🎵 "Weightless" by Marconi Union - Scientifically proven to reduce anxiety by up to 65%',
      exercise: '🏃 Gentle yoga or stretching - Focus on slow movements to calm your nervous system'
    },
    2: {
      activity: '🌿 Grounding Exercise: Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste',
      book: '📚 "Dare" by Barry McDonagh - Powerful approach to end anxiety and panic attacks',
      song: '🎵 "Clair de Lune" by Debussy - Soothing classical music to ease your mind',
      exercise: '🚶 15-minute nature walk - Being outdoors helps reduce anxiety naturally'
    },
    3: {
      activity: '🧘 Guided meditation - Try a 10-minute anxiety relief meditation on YouTube',
      book: '📚 "The Worry Trick" by David Carbonell - Learn to outsmart anxiety',
      song: '🎵 "River Flows in You" by Yiruma - Calming piano music',
      exercise: '💪 Light cardio - A short jog or bike ride can help release nervous energy'
    },
    4: {
      activity: '✍️ Worry journal - Write down your worries to get them out of your head',
      book: '📚 "Anxious for Nothing" by Max Lucado - Finding calm in a chaotic world',
      song: '🎵 "Breathe Me" by Sia - Emotional but comforting',
      exercise: '🏊 Swimming - The rhythmic movement and water can be very calming'
    },
    5: {
      activity: '🎨 Creative expression - Draw, paint, or color to distract your mind',
      book: '📚 "The Mindful Way Through Anxiety" - Breaking free from chronic worry',
      song: '🎵 "Let It Be" by The Beatles - Reassuring and peaceful',
      exercise: '🧘 Yin yoga - Slow, meditative poses to release tension'
    },
    6: {
      activity: '☕ Chamomile tea break - Take 10 minutes for yourself with a calming drink',
      book: '📚 "Hope and Help for Your Nerves" by Claire Weekes - Classic guide to overcoming anxiety',
      song: '🎵 "Three Little Birds" by Bob Marley - "Every little thing gonna be alright"',
      exercise: '🚴 Cycling - Moderate exercise to clear your mind'
    },
    7: {
      activity: '🎮 Play a calm game - Try Stardew Valley or Animal Crossing',
      book: '📚 "The Anxiety Toolkit" by Alice Boyes - Practical strategies that work',
      song: '🎵 "Here Comes the Sun" by The Beatles - Uplifting and hopeful',
      exercise: '⛰️ Hiking - Nature exposure combined with exercise reduces anxiety'
    },
    8: {
      activity: '👥 Connect with a friend - Talk about something fun and light',
      book: '📚 "Feeling Good" by David Burns - Mood therapy techniques',
      song: '🎵 "Good Vibrations" by The Beach Boys - Positive and energizing',
      exercise: '🏐 Play a sport - Group activities help shift focus from worries'
    },
    9: {
      activity: '🎯 Set a small goal - Accomplishing something boosts confidence',
      book: '📚 "The Upward Spiral" by Alex Korb - Using neuroscience to reverse anxiety',
      song: '🎵 "Beautiful Day" by U2 - Celebrate feeling better',
      exercise: '💃 Dance - Let loose and move freely to music you love'
    },
    10: { // Happy but slightly anxious
      activity: '🎉 Plan something fun - Channel that energy into excitement',
      book: '📚 "The Power of Now" by Eckhart Tolle - Stay present and enjoy the moment',
      song: '🎵 "Don\'t Stop Me Now" by Queen - Match your high energy',
      exercise: '🏃 HIIT workout - Use that extra energy productively'
    }
  },

  // Happy emotions across intensity levels
  happy: {
    1: { // Very low happiness
      activity: '🌅 Watch the sunset - Find small moments of beauty',
      book: '📚 "The Book of Joy" by Dalai Lama & Desmond Tutu - Finding lasting happiness',
      song: '🎵 "Lean on Me" by Bill Withers - You\'re not alone',
      exercise: '🚶 Gentle walk - Small steps toward feeling better'
    },
    2: {
      activity: '📝 Gratitude list - Write 3 tiny things that went okay today',
      book: '📚 "The Happiness Project" by Gretchen Rubin - Practical ways to boost joy',
      song: '🎵 "What a Wonderful World" by Louis Armstrong - Appreciate life\'s beauty',
      exercise: '🧘 Restorative yoga - Be gentle with yourself'
    },
    3: {
      activity: '☀️ Get sunlight - 15 minutes outside can improve mood',
      book: '📚 "Authentic Happiness" by Martin Seligman - Science of positive psychology',
      song: '🎵 "Three Little Birds" by Bob Marley - Things will get better',
      exercise: '🏊 Water activities - Swimming or walking by water is soothing'
    },
    4: {
      activity: '🎬 Watch a feel-good movie - Sometimes we need a little escape',
      book: '📚 "The Art of Happiness" by Dalai Lama - Timeless wisdom on joy',
      song: '🎵 "Here Comes the Sun" by The Beatles - Hope is coming',
      exercise: '🚴 Bike ride - Movement generates endorphins'
    },
    5: {
      activity: '🎨 Try something creative - Art therapy can lift spirits',
      book: '📚 "Happiness: A Guide to Developing Life\'s Most Important Skill" by Matthieu Ricard',
      song: '🎵 "Good Vibrations" by The Beach Boys - Classic happiness booster',
      exercise: '🏃 Light jog - Get those feel-good chemicals flowing'
    },
    6: {
      activity: '👥 Meet a friend - Social connection boosts happiness',
      book: '📚 "The Happiness Advantage" by Shawn Achor - Success through happiness',
      song: '🎵 "Walking on Sunshine" by Katrina and the Waves - Feel the good vibes',
      exercise: '🎾 Play a sport - Fun and exercise combined'
    },
    7: {
      activity: '🎉 Do something you love - Lean into activities that bring joy',
      book: '📚 "Flow" by Mihaly Csikszentmihalyi - Psychology of optimal experience',
      song: '🎵 "Happy" by Pharrell Williams - Celebrate feeling good!',
      exercise: '💃 Dance party - Move to your favorite upbeat music'
    },
    8: {
      activity: '🌟 Share your joy - Help someone else and double the happiness',
      book: '📚 "The How of Happiness" by Sonja Lyubomirsky - Scientific approach to lasting happiness',
      song: '🎵 "Don\'t Stop Me Now" by Queen - You\'re on fire!',
      exercise: '🏃 Energetic workout - Match your high energy level'
    },
    9: {
      activity: '📸 Capture the moment - Take photos or journal about today',
      book: '📚 "The Happiness Equation" by Neil Pasricha - 9 secrets to happiness',
      song: '🎵 "Best Day of My Life" by American Authors - This is your moment!',
      exercise: '🎪 Try something new and adventurous - Rock climbing, skateboarding'
    },
    10: { // Maximum happiness!
      activity: '🎊 Celebrate big! - Do something special to mark this awesome feeling',
      book: '📚 "The Joy of Living" by Yongey Mingyur Rinpoche - Make happiness last',
      song: '🎵 "I Feel Good" by James Brown - You deserve this joy!',
      exercise: '⚡ Full energy workout - Channel this amazing energy into something epic!'
    }
  },

  // Sad emotions across intensity levels
  sad: {
    1: { // Very deep sadness
      activity: '🫂 Reach out for support - Call a helpline or trusted person. You don\'t have to be alone.',
      book: '📚 "The Upward Spiral" by Alex Korb - Neuroscience approach to depression',
      song: '🎵 "Hallelujah" by Jeff Buckley - It\'s okay to feel, let it out',
      exercise: '🌿 Sit outside - Just being in nature can help, even for 5 minutes'
    },
    2: {
      activity: '😢 Allow yourself to cry - Tears release stress hormones, it\'s healing',
      book: '📚 "The Noonday Demon" by Andrew Solomon - Understanding depression',
      song: '🎵 "Fix You" by Coldplay - You are not broken',
      exercise: '🧘 Gentle stretching - Be kind to your body'
    },
    3: {
      activity: '☕ Self-care routine - Take a warm shower, make tea, change into comfy clothes',
      book: '📚 "Reasons to Stay Alive" by Matt Haig - Hope from someone who\'s been there',
      song: '🎵 "The Scientist" by Coldplay - Emotional release through music',
      exercise: '🚶 Short walk - Just around the block is enough'
    },
    4: {
      activity: '📝 Write your feelings - Get them out of your head and onto paper',
      book: '📚 "Lost Connections" by Johann Hari - Real causes of depression and solutions',
      song: '🎵 "Lean on Me" by Bill Withers - You have support',
      exercise: '🧘 Yoga for sadness - Specific poses like child\'s pose are comforting'
    },
    5: {
      activity: '🎬 Watch a comfort movie - Something familiar and soothing',
      book: '📚 "Feeling Good" by David Burns - Practical mood therapy',
      song: '🎵 "Here Comes the Sun" by The Beatles - Better days are ahead',
      exercise: '🏊 Swimming - Water can be therapeutic'
    },
    6: {
      activity: '👥 Connect gently - Text a friend, you don\'t have to explain everything',
      book: '📚 "The Happiness Trap" by Russ Harris - ACT approach to difficult emotions',
      song: '🎵 "Brave" by Sara Bareilles - You\'re stronger than you think',
      exercise: '🚴 Easy bike ride - Fresh air and movement help'
    },
    7: {
      activity: '🎨 Creative expression - Art, music, or writing to process feelings',
      book: '📚 "The Mindful Way Through Depression" - Freedom from chronic unhappiness',
      song: '🎵 "Stronger" by Kelly Clarkson - What doesn\'t kill you makes you stronger',
      exercise: '🏃 Light jog - Endorphins are your friend'
    },
    8: {
      activity: '🌅 Plan a small adventure - Something to look forward to tomorrow',
      book: '📚 "The Gifts of Imperfection" by Brené Brown - Embrace who you are',
      song: '🎵 "Fight Song" by Rachel Platten - You\'ve still got fight left',
      exercise: '💪 Moderate workout - Prove to yourself what you can do'
    },
    9: {
      activity: '🎯 Set a positive goal - Something achievable and meaningful',
      book: '📚 "Man\'s Search for Meaning" by Viktor Frankl - Finding purpose',
      song: '🎵 "Beautiful Day" by U2 - Appreciate the good moments',
      exercise: '🎾 Play a sport - Social exercise is especially helpful'
    },
    10: { // Mild sadness with mostly happiness
      activity: '🌟 Practice mindfulness - Notice the sad feeling but don\'t let it take over',
      book: '📚 "The Power of Now" by Eckhart Tolle - Stay present',
      song: '🎵 "Good Life" by OneRepublic - Focus on the positive',
      exercise: '💃 Dance it out - Movement and music lift spirits'
    }
  },

  // Stressed emotions across intensity levels
  stressed: {
    1: { // Extreme stress
      activity: '🆘 Take an immediate break - Step away from everything for 10 minutes, RIGHT NOW',
      book: '📚 "When the Body Says No" by Gabor Maté - Understanding stress and disease',
      song: '🎵 "Weightless" by Marconi Union - Proven to reduce stress',
      exercise: '🧘 Emergency relaxation - Lie down, close eyes, breathe deeply for 5 minutes'
    },
    2: {
      activity: '📵 Digital detox - Turn off notifications for the next hour',
      book: '📚 "The Stress Solution" by Dr. Rangan Chatterjee - Practical stress management',
      song: '🎵 "Breathe Me" by Sia - Remind yourself to breathe',
      exercise: '🚶 Walk away - Literally walk away from the stressor if possible'
    },
    3: {
      activity: '✅ Brain dump - Write down EVERYTHING stressing you out',
      book: '📚 "The Relaxation and Stress Reduction Workbook" - Proven techniques',
      song: '🎵 "Let It Be" by The Beatles - Some things are beyond control',
      exercise: '💪 Progressive muscle relaxation - Tense and release each muscle group'
    },
    4: {
      activity: '🎯 Prioritize - Choose ONE thing to focus on, ignore the rest for now',
      book: '📚 "The Upside of Stress" by Kelly McGonigal - Change your stress mindset',
      song: '🎵 "Three Little Birds" by Bob Marley - Every little thing gonna be alright',
      exercise: '🏃 Stress-relief run - Run until you can\'t think anymore'
    },
    5: {
      activity: '⏰ Time blocking - Schedule breaks between tasks, stress needs boundaries',
      book: '📚 "Why Zebras Don\'t Get Ulcers" by Robert Sapolsky - Understanding stress',
      song: '🎵 "Shake It Off" by Taylor Swift - Let go of what you can\'t control',
      exercise: '🧘 Yoga flow - Moving meditation to process stress'
    },
    6: {
      activity: '🎮 Strategic break - 20 minutes of a game or hobby to reset',
      book: '📚 "10% Happier" by Dan Harris - Meditation for skeptics',
      song: '🎵 "Don\'t Worry, Be Happy" by Bobby McFerrin - Perspective shift',
      exercise: '🏊 Swimming - Repetitive movement is meditative'
    },
    7: {
      activity: '👥 Delegate - Ask for help with something, you can\'t do everything',
      book: '📚 "Essentialism" by Greg McKeown - Do less, better',
      song: '🎵 "Here Comes the Sun" by The Beatles - This phase will pass',
      exercise: '🚴 Bike ride - Distance yourself physically from stress'
    },
    8: {
      activity: '📊 Make a plan - Breaking things down makes them less overwhelming',
      book: '📚 "The Joy of Missing Out" by Tonya Dalton - Say no to overwhelm',
      song: '🎵 "Good Vibrations" by The Beach Boys - Shift to positive energy',
      exercise: '💃 Dance break - Shake off the stress literally'
    },
    9: {
      activity: '🎨 Creative outlet - Channel stress into art or music',
      book: '📚 "Atomic Habits" by James Clear - Small systems reduce stress',
      song: '🎵 "Beautiful Day" by U2 - Celebrate manageable stress',
      exercise: '🏃 Energetic workout - Turn stress into strength'
    },
    10: { // Mild stress with good mood
      activity: '✨ Use the energy - Stress can fuel productivity if channeled right',
      book: '📚 "Peak Performance" by Brad Stulberg - Stress as a growth tool',
      song: '🎵 "Eye of the Tiger" by Survivor - You\'ve got this!',
      exercise: '⚡ High-intensity workout - Match and channel that energy'
    }
  },

  // Angry emotions across intensity levels
  angry: {
    1: { // Extreme anger
      activity: '🥊 Physical release - Punch a pillow, rip paper, anything safe to release rage',
      book: '📚 "The Cow in the Parking Lot" by Susan Edmiston - Mastering anger',
      song: '🎵 "In the End" by Linkin Park - Channel that intensity',
      exercise: '🏃 Sprint or intense cardio - Burn off that adrenaline FAST'
    },
    2: {
      activity: '🛑 Time out - Remove yourself from the situation immediately',
      book: '📚 "The Anger Control Workbook" by Matthew McKay - Practical techniques',
      song: '🎵 "Numb" by Linkin Park - It\'s okay to feel this',
      exercise: '🥊 Boxing or martial arts - Controlled way to release anger'
    },
    3: {
      activity: '🗣️ Vent safely - Talk to someone who will listen without judgment',
      book: '📚 "Rage Becomes Her" by Soraya Chemaly - Understanding anger',
      song: '🎵 "Breaking the Habit" by Linkin Park - Working through intense feelings',
      exercise: '💪 Heavy strength training - Lift weights, feel powerful'
    },
    4: {
      activity: '✍️ Angry letter - Write what you really think (don\'t send it!)',
      book: '📚 "The Dance of Anger" by Harriet Lerner - Transform anger into wisdom',
      song: '🎵 "Lose Yourself" by Eminem - Channel that fire',
      exercise: '🏃 Long run - Run until the anger exhausts itself'
    },
    5: {
      activity: '🎯 Identify the trigger - What\'s REALLY making you angry?',
      book: '📚 "Emotional Agility" by Susan David - Work with difficult emotions',
      song: '🎵 "Stronger" by Kanye West - That which doesn\'t kill you...',
      exercise: '🧘 Power yoga - Strong poses to work through anger'
    },
    6: {
      activity: '🌊 Cool down strategy - Cold shower, ice, or splash water on face',
      book: '📚 "The Power of Now" by Eckhart Tolle - Don\'t let anger control you',
      song: '🎵 "Let It Go" from Frozen - Release what you can\'t change',
      exercise: '🏊 Swimming - Water is calming, swimming is intense'
    },
    7: {
      activity: '🎨 Creative destruction - Make art, then destroy it if you need to',
      book: '📚 "Anger Management For Dummies" - Practical, proven strategies',
      song: '🎵 "Shake It Off" by Taylor Swift - Don\'t let it stick to you',
      exercise: '🚴 Hard bike ride - Push yourself, use that energy'
    },
    8: {
      activity: '😤 Productive channeling - Clean aggressively, organize, do physical work',
      book: '📚 "The Gifts of Imperfection" by Brené Brown - Let go of perfection',
      song: '🎵 "Fight Song" by Rachel Platten - Turn anger into determination',
      exercise: '⛰️ Hiking uphill - Challenge yourself physically'
    },
    9: {
      activity: '🎯 Problem-solving mode - What action can you take about this?',
      book: '📚 "Difficult Conversations" by Douglas Stone - Communicate effectively',
      song: '🎵 "Roar" by Katy Perry - Channel anger into confidence',
      exercise: '💃 Aggressive dance - Let it out through movement'
    },
    10: { // Mild anger with good mood
      activity: '✨ Assertiveness practice - Use that energy to set healthy boundaries',
      book: '📚 "Boundaries" by Henry Cloud - Healthy limits',
      song: '🎵 "Stronger" by Kelly Clarkson - You\'ve got this under control',
      exercise: '🏃 Competitive sports - Channel into healthy competition'
    }
  },

  // Calm emotions across intensity levels
  calm: {
    1: { // Seeking calm in distress
      activity: '🧘 Meditation - Even 3 minutes of mindfulness can help',
      book: '📚 "Wherever You Go, There You Are" by Jon Kabat-Zinn - Mindfulness meditation',
      song: '🎵 "Weightless" by Marconi Union - Ultra-calming',
      exercise: '🌿 Nature walk - Slow, mindful walking outdoors'
    },
    2: {
      activity: '☕ Tea ceremony - Make tea slowly and mindfully',
      book: '📚 "The Miracle of Mindfulness" by Thich Nhat Hanh - Peace in each moment',
      song: '🎵 "Clair de Lune" by Debussy - Classical serenity',
      exercise: '🧘 Gentle yoga - Slow, flowing movements'
    },
    3: {
      activity: '🎨 Mandala coloring - Repetitive, soothing creativity',
      book: '📚 "Peace Is Every Step" by Thich Nhat Hanh - Mindfulness in daily life',
      song: '🎵 "Spiegel im Spiegel" by Arvo Pärt - Minimalist calm',
      exercise: '🌊 Float or swim gently - Water is naturally calming'
    },
    4: {
      activity: '📖 Read something peaceful - Poetry, philosophy, or spiritual texts',
      book: '📚 "The Book of Joy" by Dalai Lama - Cultivating inner peace',
      song: '🎵 "River Flows in You" by Yiruma - Peaceful piano',
      exercise: '🚶 Mindful walking - Notice each step'
    },
    5: {
      activity: '🌅 Watch nature - Clouds, water, trees, anything natural',
      book: '📚 "The Power of Now" by Eckhart Tolle - Present moment awareness',
      song: '🎵 "Gymnopédie No. 1" by Erik Satie - Tranquil classical',
      exercise: '🧘 Restorative yoga - Deep relaxation poses'
    },
    6: {
      activity: '🎋 Organize mindfully - Tidying can be meditative',
      book: '📚 "The Art of Stillness" by Pico Iyer - Finding peace in a busy world',
      song: '🎵 "Albatross" by Fleetwood Mac - Gentle and soothing',
      exercise: '🏊 Floating - Just be still in water'
    },
    7: {
      activity: '🌸 Garden or tend plants - Connecting with nature',
      book: '📚 "The Calm Buddha at Bedtime" - Stories of wisdom',
      song: '🎵 "Morning Mood" by Grieg - Peaceful awakening',
      exercise: '🚴 Easy bike ride - Gentle movement, enjoy scenery'
    },
    8: {
      activity: '🎵 Play gentle music - Instrument or just listening',
      book: '📚 "The Untethered Soul" by Michael Singer - Inner peace',
      song: '🎵 "Edelweiss" from Sound of Music - Simple beauty',
      exercise: '⛰️ Nature hike - Moderate pace, appreciate surroundings'
    },
    9: {
      activity: '✨ Gratitude practice - Appreciate your calm state',
      book: '📚 "The Art of Happiness" by Dalai Lama - Sustained peace',
      song: '🎵 "What a Wonderful World" by Louis Armstrong - Appreciate life',
      exercise: '🎾 Gentle sports - Tai chi or easy tennis'
    },
    10: { // Maximum calm and happiness
      activity: '🌟 Share your peace - Help someone else find calm',
      book: '📚 "The Joy of Living" by Mingyur Rinpoche - Meditation and science',
      song: '🎵 "Here Comes the Sun" by The Beatles - Pure contentment',
      exercise: '💃 Flow movement - Whatever feels good to your body'
    }
  },

  // Confused emotions across intensity levels
  confused: {
    1: { // Very confused and distressed
      activity: '📝 Brain dump - Write everything swirling in your mind without organizing',
      book: '📚 "The Gifts of Imperfection" by Brené Brown - It\'s okay not to have answers',
      song: '🎵 "Let It Be" by The Beatles - Sometimes you just have to let things unfold',
      exercise: '🚶 Walk without destination - Let your mind wander'
    },
    2: {
      activity: '🗣️ Talk it out - Explaining to someone helps clarify your own thinking',
      book: '📚 "The Road Less Traveled" by M. Scott Peck - Finding direction',
      song: '🎵 "Fix You" by Coldplay - You\'ll find your way',
      exercise: '🧘 Meditation - Clear the mental clutter'
    },
    3: {
      activity: '🎯 List what you DO know - Start with certainties',
      book: '📚 "The Untethered Soul" by Michael Singer - Clarity of mind',
      song: '🎵 "The Scientist" by Coldplay - Working through confusion',
      exercise: '🏊 Swimming - Repetitive movement helps thinking'
    },
    4: {
      activity: '🌳 Nature time - Sometimes stepping back gives perspective',
      book: '📚 "Thinking, Fast and Slow" by Daniel Kahneman - Understanding your mind',
      song: '🎵 "Viva La Vida" by Coldplay - Change and transition',
      exercise: '🚴 Bike ride - Movement helps process thoughts'
    },
    5: {
      activity: '📊 Mind map - Visual organization of your thoughts',
      book: '📚 "Designing Your Life" by Bill Burnett - Finding clarity on direction',
      song: '🎵 "Unwritten" by Natasha Bedingfield - The future is open',
      exercise: '🧘 Yoga - Body awareness can ground confused mind'
    },
    6: {
      activity: '⏸️ Take a break - Sometimes confusion means you need rest',
      book: '📚 "The Power of Now" by Eckhart Tolle - Be present, answers come',
      song: '🎵 "Let It Go" from Frozen - Release the need to know everything',
      exercise: '🏃 Light jog - Fresh air and endorphins clear thinking'
    },
    7: {
      activity: '💡 Research - Learning more might clarify things',
      book: '📚 "Atomic Habits" by James Clear - Small steps when uncertain',
      song: '🎵 "Brave" by Sara Bareilles - Move forward anyway',
      exercise: '⛰️ Hiking - Each step forward is progress'
    },
    8: {
      activity: '🎲 Trust your gut - Try making a small decision and see how it feels',
      book: '📚 "Blink" by Malcolm Gladwell - Trust your instincts',
      song: '🎵 "Roar" by Katy Perry - Find your confidence',
      exercise: '💪 Strength training - Feel strong and capable'
    },
    9: {
      activity: '✨ Pros and cons list - Organize your thoughts methodically',
      book: '📚 "The 7 Habits of Highly Effective People" - Clarity through principles',
      song: '🎵 "Fight Song" by Rachel Platten - You\'ve got this',
      exercise: '🎾 Play sports - Sometimes action beats overthinking'
    },
    10: { // Mild confusion with good mood
      activity: '🎨 Embrace the unknown - Creativity thrives in uncertainty',
      book: '📚 "Big Magic" by Elizabeth Gilbert - Living creatively with uncertainty',
      song: '🎵 "Happy" by Pharrell Williams - It\'s okay not to have all answers',
      exercise: '💃 Dance - Move freely without a plan'
    }
  },

  // Excited emotions across intensity levels
  excited: {
    1: { // Seeking excitement when low
      activity: '📺 Watch inspiring content - TED talks, motivational videos',
      book: '📚 "The Motivation Myth" by Jeff Haden - Creating excitement',
      song: '🎵 "Eye of the Tiger" by Survivor - Pump up energy',
      exercise: '🏃 Start slow - A little movement builds momentum'
    },
    2: {
      activity: '🎯 Plan something fun - Having something to look forward to builds excitement',
      book: '📚 "The Happiness Project" by Gretchen Rubin - Finding joy',
      song: '🎵 "Walking on Sunshine" by Katrina and the Waves - Uplifting',
      exercise: '💃 Dance to upbeat music - Fake it till you make it'
    },
    3: {
      activity: '🎮 Play an engaging game - Something challenging and fun',
      book: '📚 "Flow" by Mihaly Csikszentmihalyi - Optimal experience',
      song: '🎵 "Good Vibrations" by The Beach Boys - Classic energy boost',
      exercise: '🚴 Bike ride somewhere new - Novel experiences create excitement'
    },
    4: {
      activity: '👥 Connect with enthusiastic people - Energy is contagious',
      book: '📚 "The Art of Possibility" by Rosamund Zander - Open to opportunities',
      song: '🎵 "Don\'t Stop Me Now" by Queen - Feel the energy rising',
      exercise: '🏊 Swimming - Invigorating and energizing'
    },
    5: {
      activity: '✨ Try something new - New experiences spark excitement',
      book: '📚 "Year of Yes" by Shonda Rhimes - Say yes to opportunities',
      song: '🎵 "Happy" by Pharrell Williams - Celebrate good feelings',
      exercise: '⛰️ Adventure activity - Hiking, climbing, something challenging'
    },
    6: {
      activity: '🎨 Create something - Channel excitement into creation',
      book: '📚 "Big Magic" by Elizabeth Gilbert - Creative living',
      song: '🎵 "Can\'t Stop the Feeling" by Justin Timberlake - Pure joy',
      exercise: '💪 Energetic workout - Match your rising energy'
    },
    7: {
      activity: '🎉 Plan a celebration - Mark good moments',
      book: '📚 "The Power of Moments" by Chip Heath - Creating peak experiences',
      song: '🎵 "Celebration" by Kool & The Gang - Party time!',
      exercise: '🏃 High-intensity interval training - Explosive energy'
    },
    8: {
      activity: '🌟 Share your excitement - Tell others what you\'re pumped about',
      book: '📚 "Contagious" by Jonah Berger - Spreading enthusiasm',
      song: '🎵 "Best Day of My Life" by American Authors - Maximum energy',
      exercise: '🎪 Try extreme sports - Skateboarding, parkour, anything thrilling'
    },
    9: {
      activity: '📸 Document the moment - You\'ll want to remember this feeling',
      book: '📚 "The Happiness Advantage" by Shawn Achor - Sustaining positive energy',
      song: '🎵 "Firework" by Katy Perry - You\'re on fire!',
      exercise: '⚡ HIIT or CrossFit - Intense, varied, exciting'
    },
    10: { // Maximum excitement!
      activity: '🎊 GO ALL IN - Whatever you\'re excited about, DO IT NOW!',
      book: '📚 "The Magic of Thinking Big" by David Schwartz - Dream huge',
      song: '🎵 "We Are the Champions" by Queen - You\'re unstoppable!',
      exercise: '🏆 Competition - Channel into winning, achieving, dominating'
    }
  },

  // Lonely emotions across intensity levels
  lonely: {
    1: { // Severe loneliness
      activity: '🆘 Reach out NOW - Call a helpline, text a friend, don\'t stay isolated',
      book: '📚 "The Lonely City" by Olivia Laing - You\'re not alone in feeling alone',
      song: '🎵 "You\'ve Got a Friend" by James Taylor - Comfort in music',
      exercise: '🚶 Walk in public spaces - Being around people helps even without interaction'
    },
    2: {
      activity: '📱 Connect online - Join a supportive community or forum',
      book: '📚 "Lost Connections" by Johann Hari - Understanding loneliness',
      song: '🎵 "Lean on Me" by Bill Withers - You have support',
      exercise: '🏋️ Group fitness class - Be around people while exercising'
    },
    3: {
      activity: '🐕 Spend time with animals - Pets or volunteer at shelter',
      book: '📚 "Together" by Vivek Murthy - Healing power of connection',
      song: '🎵 "Bridge Over Troubled Water" by Simon & Garfunkel - Someone cares',
      exercise: '👥 Join a walking/running group - Social and active'
    },
    4: {
      activity: '☕ Visit a café - Work or read in a public space with others',
      book: '📚 "The Village Effect" by Susan Pinker - Face-to-face contact matters',
      song: '🎵 "With a Little Help from My Friends" by The Beatles - Reach out',
      exercise: '🎾 Take a class - Sports, dance, anything with people'
    },
    5: {
      activity: '💌 Write to someone - Old friend, family, pen pal',
      book: '📚 "Bowling Alone" by Robert Putnam - Understanding social connection',
      song: '🎵 "Count on Me" by Bruno Mars - Friends are there',
      exercise: '🧘 Group yoga - Shared peaceful experience'
    },
    6: {
      activity: '🎮 Online gaming - Voice chat with teammates',
      book: '📚 "The Art of Gathering" by Priya Parker - Meaningful connections',
      song: '🎵 "Here Comes the Sun" by The Beatles - Things improve',
      exercise: '🏊 Community pool or gym - Around others'
    },
    7: {
      activity: '👥 Volunteer - Helping others creates connection',
      book: '📚 "How to Win Friends and Influence People" by Dale Carnegie - Social skills',
      song: '🎵 "Three Little Birds" by Bob Marley - Things will be okay',
      exercise: '🚴 Join a cycling group - Social exercise'
    },
    8: {
      activity: '🎨 Take a class - Learn with others, shared interest',
      book: '📚 "The Friendship Cure" by Kate Leaver - Building connections',
      song: '🎵 "Good Vibrations" by The Beach Boys - Positive social energy',
      exercise: '⛰️ Hiking group - Adventure with others'
    },
    9: {
      activity: '🎉 Plan a gathering - Host something small',
      book: '📚 "The Happiness Project" by Gretchen Rubin - Social chapter insights',
      song: '🎵 "We Are Family" by Sister Sledge - Community feeling',
      exercise: '🏐 Team sports - Collaborate and connect'
    },
    10: { // Mild loneliness with good mood
      activity: '📱 Reconnect - Reach out to someone you\'ve been meaning to talk to',
      book: '📚 "Never Eat Alone" by Keith Ferrazzi - Networking for connection',
      song: '🎵 "Happy" by Pharrell Williams - Enjoy your company too',
      exercise: '💃 Social dance class - Salsa, swing, anything fun and social'
    }
  },

  // Energetic emotions across intensity levels
  energetic: {
    1: { // Seeking energy when low
      activity: '☀️ Get sunlight - 10 minutes outside boosts energy naturally',
      book: '📚 "The Circadian Code" by Satchin Panda - Natural energy rhythms',
      song: '🎵 "Eye of the Tiger" by Survivor - Motivational energy',
      exercise: '🚶 Gentle walk - Small movement creates momentum'
    },
    2: {
      activity: '💧 Hydrate! - Dehydration kills energy',
      book: '📚 "The Power of Full Engagement" by Jim Loehr - Managing energy',
      song: '🎵 "Wake Me Up" by Avicii - Uplifting and energizing',
      exercise: '🧘 Energizing yoga - Sun salutations to wake up'
    },
    3: {
      activity: '🎵 Upbeat music - Create an energy-boost playlist',
      book: '📚 "Spark" by John Ratey - Exercise and the brain',
      song: '🎵 "Can\'t Stop the Feeling" by Justin Timberlake - Infectious energy',
      exercise: '💃 Dance to fast music - Move to build energy'
    },
    4: {
      activity: '🥤 Healthy snack - Protein and complex carbs for sustained energy',
      book: '📚 "The Energy Bus" by Jon Gordon - Positive energy',
      song: '🎵 "Uptown Funk" by Bruno Mars - Pure energy',
      exercise: '🏃 Light jog - Start building momentum'
    },
    5: {
      activity: '🎯 Start a project - Channel emerging energy into action',
      book: '📚 "Atomic Habits" by James Clear - Energy-creating routines',
      song: '🎵 "Shut Up and Dance" by Walk the Moon - Get moving',
      exercise: '🚴 Moderate bike ride - Sustained cardio'
    },
    6: {
      activity: '🎮 Active gaming - VR or motion-based games',
      book: '📚 "Peak Performance" by Brad Stulberg - Managing high energy',
      song: '🎵 "Don\'t Stop Me Now" by Queen - Momentum building',
      exercise: '💪 Circuit training - Varied, keeps energy high'
    },
    7: {
      activity: '🧹 Productive burst - Clean, organize with high energy',
      book: '📚 "The 5 AM Club" by Robin Sharma - Using morning energy',
      song: '🎵 "Happy" by Pharrell Williams - Positive high energy',
      exercise: '🏃 Running - Match your energy level'
    },
    8: {
      activity: '🎨 High-energy creation - Fast painting, energetic music-making',
      book: '📚 "Flow" by Mihaly Csikszentmihalyi - Channel energy into flow state',
      song: '🎵 "Levels" by Avicii - EDM energy boost',
      exercise: '⚡ HIIT workout - Match intensity'
    },
    9: {
      activity: '🏆 Challenge yourself - Use energy for something difficult',
      book: '📚 "Relentless" by Tim Grover - Channeling fierce energy',
      song: '🎵 "Stronger" by Kanye West - Maximum power',
      exercise: '🎪 Extreme sports - Skateboarding, parkour, rock climbing'
    },
    10: { // Maximum energy!
      activity: '🚀 GO BIG - Whatever you\'ve been putting off, DO IT NOW!',
      book: '📚 "The War of Art" by Steven Pressfield - Unleash creative energy',
      song: '🎵 "Thunderstruck" by AC/DC - MAXIMUM ENERGY!',
      exercise: '💥 All-out workout - CrossFit, sprints, whatever pushes limits'
    }
  }
};

// Helper function to generate suggestion based on intensity and emotion
export const generateMoodSuggestion = (intensity, emotion) => {
  // Map emotion to suggestion category
  const emotionMap = {
    'Happy': 'happy',
    'Sad': 'sad',
    'Anxious': 'anxious',
    'Angry': 'angry',
    'Calm': 'calm',
    'Stressed': 'stressed',
    'Excited': 'excited',
    'Lonely': 'lonely',
    'Confused': 'confused',
    'Energetic': 'energetic'
  };

  const category = emotionMap[emotion] || 'happy';
  const levelData = moodSuggestions[category][intensity] || moodSuggestions.happy[5];

  return {
    activity: levelData.activity,
    book: levelData.book,
    song: levelData.song,
    exercise: levelData.exercise,
    emotion: emotion,
    intensity: intensity
  };
};

export default moodSuggestions;
