import { GoogleGenAI, Type } from "@google/genai";
import { CompassMode, Activity, OracleResponse, OnboardingData, DailyCheckInData, DailyRecommendation } from "../types";

// Helper to get Gemini AI client

const getAI = () => {
  const apiKey = (typeof process !== 'undefined' && process.env ? (process.env.GEMINI_API_KEY || process.env.API_KEY) : '') || '';
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.");
  }
  return new GoogleGenAI({ apiKey });
};

const getDurationCategory = (durationStr: string): 'short' | 'medium' | 'long' => {
  const mins = parseInt(durationStr);
  if (isNaN(mins)) return 'medium';
  if (mins <= 7) return 'short';
  if (mins <= 17) return 'medium';
  return 'long';
};

const ACTIVITY_LIBRARY: Record<CompassMode | 'Quick Win', Activity[]> = {
  [CompassMode.Surviving]: [
    { title: "Cold Water Reset", description: "A quick way to calm your system.", duration: "2 mins", benefits: "Helps lower your heart rate and calm your mind.", steps: ["Splash cold water on your face for 20 seconds.", "Repeat 3 times.", "Focus on the cool feeling."], type: "other" },
    { title: "Energy Anchor", description: "Steady your energy levels.", duration: "5 mins", benefits: "Helps prevent energy crashes.", steps: ["Eat a small protein snack like a hard-boiled egg or nuts.", "Chew slowly, about 30 times per bite.", "Sip a small glass of water."], type: "nutritional" },
    { title: "Wall Pushes", description: "Release built-up tension.", duration: "2 mins", benefits: "Helps release stress and feel more grounded.", steps: ["Push against a wall as hard as you can for 10 seconds.", "Shake out your arms.", "Repeat 5 times."], type: "movement" },
    { title: "Heel Drops", description: "Feel more connected to the ground.", duration: "2 mins", benefits: "A simple way to feel more stable.", steps: ["Rise up on your toes.", "Drop down hard on your heels.", "Feel the vibration through your body.", "Repeat 10 times."], type: "movement" },
    { title: "Jaw & Tongue Relaxation", description: "Release tension in your face.", duration: "2 mins", benefits: "Signals your body that it's okay to relax.", steps: ["Let your tongue rest on the floor of your mouth.", "Keep your jaw slightly open.", "Notice the space behind your ears."], type: "other" },
    { title: "Ear Massage Reset", description: "A quick way to shift your mood.", duration: "2 mins", benefits: "Helps your body relax instantly.", steps: ["Gently pull your ears out and down.", "Trace the inner rim with your finger.", "Take 3 deep breaths."], type: "other" },
    { title: "Shoulder Tapping", description: "Calm your mind and body.", duration: "4 mins", benefits: "Helps you feel more balanced.", steps: ["Cross your arms over your chest.", "Tap opposite shoulders rhythmically.", "Imagine your thoughts floating away like clouds."], type: "other" },
    { title: "Salt Water Sip", description: "Balance your body.", duration: "2 mins", benefits: "Supports your body during stressful times.", steps: ["Add a tiny pinch of sea salt to a glass of water.", "Sip slowly while sitting down.", "Notice the temperature of the water."], type: "nutritional" },
    { title: "Lying on the Floor", description: "Let go of everything.", duration: "10 mins", benefits: "Helps release deep tension in your body.", steps: ["Lie flat on a hard floor.", "Imagine yourself sinking into the ground.", "Scan your body for any tight spots.", "Relax your hips first."], type: "rest" }
  ],
  [CompassMode.Drifting]: [
    { title: "Citrus Refresh", description: "Wake up your senses.", duration: "3 mins", benefits: "Helps clear your head and focus on the now.", steps: ["Smell a fresh lemon or lime.", "Take a tiny sip of the juice.", "Notice how your body reacts."], type: "nutritional" },
    { title: "Horizon Tracking", description: "Reset your focus.", duration: "3 mins", benefits: "Helps your brain feel more oriented and clear.", steps: ["Trace the horizon line from left to right with your eyes.", "Find the furthest point you can see.", "Name 3 things in the distance."], type: "other" },
    { title: "Spice Reset", description: "A quick wake-up call.", duration: "2 mins", benefits: "Brings your focus back to the present moment.", steps: ["Taste a tiny bit of hot sauce or ginger.", "Focus on the tingle on your tongue.", "Breathe through the sensation."], type: "nutritional" },
    { title: "Mindful Walking", description: "Connect with your body.", duration: "5 mins", benefits: "Helps you feel more present in your space.", steps: ["Walk slowly around the room.", "Focus on how your feet feel as they touch the ground.", "Keep your eyes on the horizon, not the floor."], type: "movement" },
    { title: "Hydration Boost", description: "Wake up your body.", duration: "3 mins", benefits: "Helps clear brain fog and boost energy.", steps: ["Drink a large glass of cold water.", "Focus on the feeling of the water.", "Take 3 deep breaths afterward."], type: "nutritional" },
    { title: "Sight & Sound Check", description: "Tune into your surroundings.", duration: "5 mins", benefits: "Helps you feel more present and calm.", steps: ["Snap your fingers near your ears.", "Name 5 colors you see.", "Listen for 3 different sounds."], type: "other" },
    { title: "Digital De-clutter", description: "Clear your space.", duration: "10 mins", benefits: "Reduces mental clutter by clearing your view.", steps: ["Delete 3 old photos you don't need.", "Clear one small corner of your desk.", "Close any tabs you aren't using."], type: "other" }
  ],
  [CompassMode.Healing]: [
    { title: "Soothing Tea", description: "Calm your system.", duration: "10 mins", benefits: "Helps soothe your body from the inside out.", steps: ["Make a warm ginger or chamomile tea.", "Hold the warm mug in your hands.", "Drink slowly and enjoy the quiet."], type: "nutritional" },
    { title: "Gentle Tapping", description: "Help your body recover.", duration: "5 mins", benefits: "Supports your body's natural healing process.", steps: ["Gently tap your collarbones.", "Stroke your neck downwards.", "Lightly massage behind your knees."], type: "movement" },
    { title: "Joint Circles", description: "Move without stress.", duration: "7 mins", benefits: "Helps your joints feel loose and comfortable.", steps: ["Do gentle neck circles.", "Roll your shoulders back.", "Rotate your wrists and ankles.", "Move slowly with your breath."], type: "movement" },
    { title: "Magnesium Soak", description: "Relax your muscles.", duration: "15 mins", benefits: "Helps your muscles relax and supports recovery.", steps: ["Soak your feet in warm water with Epsom salts.", "Make sure the water is warm, not hot.", "Take deep, slow breaths while you soak."], type: "rest" },
    { title: "Sunlight Break", description: "Get some natural light.", duration: "5 mins", benefits: "Helps regulate your sleep and energy levels.", steps: ["Face the sun with your eyes closed.", "Feel the warmth on your eyelids.", "Take 5 deep breaths."], type: "other" },
    { title: "Body Sweep", description: "Release tension.", duration: "12 mins", benefits: "Signals your body that it's time to rest.", steps: ["Lie flat on a firm floor.", "Gently roll your neck from side to side.", "Tighten and then release your glutes."], type: "movement" }
  ],
  [CompassMode.Grounded]: [
    { title: "Mindful Eating", description: "Enjoy your food.", duration: "15 mins", benefits: "Helps your body digest food better and feel calm.", steps: ["Eat a piece of fruit or a vegetable.", "Chew each bite 30 times.", "Put your fork down between bites.", "No screens or distractions."], type: "nutritional" },
    { title: "Gravity Check", description: "Feel your foundation.", duration: "5 mins", benefits: "Helps you feel more stable and present.", steps: ["Notice how your feet feel on the floor.", "Slowly shift your weight from side to side.", "Imagine you have roots growing into the ground."], type: "movement" },
    { title: "Core Hold", description: "Find your center.", duration: "5 mins", benefits: "Helps you feel strong and stable from the inside.", steps: ["Sit up tall and engage your core muscles.", "Hold for 30 seconds while breathing normally.", "Release and feel your body expand.", "Repeat 3 times."], type: "movement" },
    { title: "Balanced Snack", description: "Keep your energy steady.", duration: "10 mins", benefits: "Prevents energy dips and keeps you feeling calm.", steps: ["Have a balanced snack like an apple with nut butter.", "Notice the different textures of the food.", "Take slow breaths between bites."], type: "nutritional" },
    { title: "Values Note", description: "Connect with what matters.", duration: "10 mins", benefits: "Helps you feel more like yourself.", steps: ["Write down one thing you did today that matches your values.", "Read it back to yourself.", "Keep it as a reminder."], type: "writing" },
    { title: "Tidy Up", description: "Clear your environment.", duration: "20 mins", benefits: "Helps you feel more in control of your space.", steps: ["Clean one room in your home.", "Move slowly and with purpose.", "Put things away where they belong."], type: "other" }
  ],
  [CompassMode.Growing]: [
    { title: "Shadow Boxing", description: "Release extra energy.", duration: "5 mins", benefits: "Helps clear stagnant energy and improves focus.", steps: ["Lightly move your feet.", "Throw gentle punches into the air.", "Keep your breathing steady.", "Focus on a point in front of you."], type: "movement" },
    { title: "Berry Boost", description: "Fuel for your brain.", duration: "5 mins", benefits: "Helps protect your brain and keep you sharp.", steps: ["Eat a small bowl of berries or a piece of dark chocolate.", "Notice the rich flavor.", "Think of this as good fuel for your mind."], type: "nutritional" },
    { title: "Quick Sprints", description: "Build your strength.", duration: "5 mins", benefits: "Helps build your capacity for more energy.", steps: ["Run in place with high knees for 30 seconds.", "Rest for 10 seconds.", "Repeat 5 times."], type: "movement" },
    { title: "Cold Finish", description: "A refreshing boost.", duration: "3 mins", benefits: "Helps you feel more resilient and awake.", steps: ["Take your normal shower.", "Turn the water to cold for the last 60 seconds.", "Keep your breathing steady."], type: "other" },
    { title: "Protein Snack", description: "Brain fuel.", duration: "5 mins", benefits: "Provides the building blocks for focus and drive.", steps: ["Eat a handful of pumpkin seeds or almonds.", "Drink a glass of water.", "Stand up tall while you eat."], type: "nutritional" },
    { title: "Strength Flow", description: "Build your resilience.", duration: "15 mins", benefits: "Helps you handle more tension and stay strong.", steps: ["Do as many pushups as you comfortably can.", "Hold a plank until you start to shake.", "Release and take a deep breath."], type: "movement" }
  ],
  [CompassMode.Flowing]: [
    { title: "Brain Fuel", description: "Keep your mind sharp.", duration: "5 mins", benefits: "Supports clear thinking and focus.", steps: ["Eat a small serving of walnuts or chia seeds.", "Eat slowly while thinking about your current project.", "Drink some water with lemon."], type: "nutritional" },
    { title: "Brain Coordination", description: "Get in the zone.", duration: "5 mins", benefits: "Helps your brain work together more effectively.", steps: ["Pat your head and rub your belly at the same time.", "Count backward from 100 by 7s.", "Switch hands and repeat."], type: "movement" },
    { title: "Continuous Hydration", description: "Stay sharp.", duration: "2 mins", benefits: "Keeps your brain cells hydrated for better focus.", steps: ["Drink a small glass of filtered water.", "Swish it around in your mouth before swallowing.", "Take a deep breath and get back to work."], type: "nutritional" },
    { title: "Balance Challenge", description: "Connect mind and body.", duration: "5 mins", benefits: "Helps your focus and body awareness work together.", steps: ["Stand on one leg (close your eyes if you can).", "Name 5 things you are working on mastering.", "Switch legs and repeat."], type: "movement" },
    { title: "Idea Connection", description: "Boost your creativity.", duration: "12 mins", benefits: "Helps you connect different ideas more easily.", steps: ["Pick two random objects near you.", "Find 5 ways they could be connected.", "Think of a business idea for both."], type: "creative" }
  ],
  'Quick Win': [
    { title: "Hydration Snap", description: "A quick wake-up.", duration: "1 min", benefits: "Helps you recover your focus quickly.", steps: ["Drink a glass of water quickly.", "Add a little lemon or salt if you have it.", "Give your jaw a big stretch."], type: "nutritional" },
    { title: "Sight & Sound Snap", description: "A quick check-in.", duration: "1 min", benefits: "Brings your focus back to the present.", steps: ["Snap your fingers near your ears.", "Name one blue thing you see.", "Hum for 5 seconds."], type: "other" },
    { title: "Muscle Release", description: "Release stress.", duration: "1 min", benefits: "Helps your body let go of stress quickly.", steps: ["Tighten every muscle in your body for 10 seconds.", "Let out a loud 'HAA' exhale as you release.", "Repeat 2 times."], type: "movement" },
    { title: "Face Splash", description: "A quick refresh.", duration: "1 min", benefits: "Helps shift your mood instantly.", steps: ["Splash ice-cold water on your face.", "Pat your face dry.", "Give yourself a smile in the mirror."], type: "other" }
  ]
};

const SYSTEM_INSTRUCTION = `
You are "The Reset Compass", a personal wellness guide.

STRICT DURATION COMPLIANCE:
The 'duration' field MUST match the requested category:
- Requested 'short': Must be "2-5 mins".
- Requested 'medium': Must be "10-15 mins".
- Requested 'long': Must be "20-30+ mins".

STRICT DIVERSITY PROTOCOL:
Incorporate resets that focus on:
1. MOVEMENT: Simple physical actions like stretching, wall pushes, or balance challenges.
2. NUTRITION: Simple food or drink actions like hydration, protein snacks, or mindful eating.
3. SENSORY: Using your senses like smell, taste, or sight to feel more present.

STRICT LANGUAGE PROTOCOL:
- Use plain, conversational English.
- NO jargon (e.g., avoid "metabolic", "somatic", "proprioceptive", "ANS", "CNS", "vagus nerve").
- Instead of "somatic reset", use "break to reset".
- Instead of "metabolic stabilization", use "steady energy".
- Keep it warm, simple, and easy to understand for anyone.

NO WELLNESS TROPES. Avoid "Box Breathing", "Simple Stretching", or basic meditation unless it has a unique twist.
`;

const cleanJSON = (text: string) => {
    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return jsonMatch[0];
        return text.replace(/```json/g, '').replace(/```/g, '').trim();
    } catch (e) {
        return text;
    }
}

export const suggestModeFromDescription = async (description: string): Promise<{mode: CompassMode, reason: string}> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: `User State: "${description}". Identify the best direction. Return JSON with 'mode' and 'reason'.`,
       config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                mode: { type: Type.STRING, enum: Object.values(CompassMode) },
                reason: { type: Type.STRING }
            }
        }
       }
    });
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    const json = JSON.parse(cleanJSON(text));
    return { mode: json.mode as CompassMode, reason: json.reason };
  } catch (error) {
    console.error("Error suggesting mode:", error);
    return { mode: CompassMode.Drifting, reason: "Finding a path through the fog." };
  }
};

export const generateActivityForMode = async (mode: CompassMode, duration: string = 'medium', avoidTitles: string[] = []): Promise<Activity> => {
  const library = ACTIVITY_LIBRARY[mode];
  
  // High-Quality library filtering
  const suitableLibrary = library.filter(act => {
    const cat = getDurationCategory(act.duration);
    return cat === duration && !avoidTitles.some(avoid => avoid.toLowerCase() === act.title.toLowerCase());
  });
  
  if (suitableLibrary.length > 0) {
      // Pick random from library
      return suitableLibrary[Math.floor(Math.random() * suitableLibrary.length)];
  }

  // Fallback to Gemini if library is exhausted for this mode/duration
  const targetRange = duration === 'short' ? "2-5 mins" : duration === 'medium' ? "10-15 mins" : "20-30 mins";

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `Create a unique ${mode} reset for ${targetRange}. Focus on somatic movement or nutritional metabolic support. AVOID these titles: [${avoidTitles.slice(-50).join(', ')}].`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    benefits: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    type: { type: Type.STRING, enum: ['breathing', 'movement', 'writing', 'reflection', 'planning', 'creative', 'rest', 'other', 'cognitive', 'nutritional'] }
                },
                required: ["title", "description", "duration", "steps", "type"]
            }
        }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    const result = JSON.parse(cleanJSON(text));
    
    // Final check to ensure we don't return a duplicate even from AI
    if (avoidTitles.some(avoid => avoid.toLowerCase() === result.title.toLowerCase())) {
        throw new Error("AI generated a duplicate title");
    }
    
    return result;
  } catch (error) {
    console.error("Error generating activity:", error);
    // If API fails, try to find ANY unseen activity in the library regardless of duration
    const unseenAnyDuration = library.filter(act => !avoidTitles.some(avoid => avoid.toLowerCase() === act.title.toLowerCase()));
    if (unseenAnyDuration.length > 0) {
        return unseenAnyDuration[Math.floor(Math.random() * unseenAnyDuration.length)];
    }
    // Absolute fallback
    return library[Math.floor(Math.random() * library.length)];
  }
};

export const generateQuickWin = async (avoidTitles: string[] = []): Promise<Activity> => {
    const library = ACTIVITY_LIBRARY['Quick Win'];
    const unseen = library.filter(act => !avoidTitles.some(avoid => avoid.toLowerCase() === act.title.toLowerCase()));
    
    if (unseen.length > 0) {
        return unseen[Math.floor(Math.random() * unseen.length)];
    }

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: `2-Minute Quick Win. Focus on hydration, movement, or sensory snap. Avoid: [${avoidTitles.slice(-50).join(', ')}].`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        benefits: { type: Type.STRING },
                        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        type: { type: Type.STRING }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) throw new Error("Empty response from Quick Win AI");
        return JSON.parse(cleanJSON(text)) as Activity;
    } catch (e) {
        console.error("Quick Win Generation Failed:", e);
        return library[Math.floor(Math.random() * library.length)];
    }
}

const RECOMMENDATION_SYSTEM_INSTRUCTION = `
You are a wellness guide for everyday people. Your user has told you how they feel today and how much time they have. Give them one specific recommendation in each of three areas: movement, nutrition, and recovery. 

Never assume they exercise regularly or have any fitness background. Write as if this person is busy, realistic, and has tried to be healthier before but life got in the way. The goal is one genuinely useful action that fits their real day. 

Keep all language simple, warm, and specific. NO JARGON. No corporate speak. No clinical terms. Every recommendation must feel like it was written specifically for this person on this specific day.

MOVE: One specific physical action. Matched to their energy level and available time. Never use the word workout or training. Use movement, action, or something good for your body.

FUEL: One simple food or drink action. One thing only. Immediately actionable. No meal plans. No calorie counts. Just one clear, simple action they can take today.

RECOVER: One simple way to rest or recharge. Rotate across sleep tips, hydration, mental rest, sunlight, reducing screen time, or social connection.
`;

export const FALLBACK_RECOMMENDATIONS: DailyRecommendation[] = [
    {
        id: 'fallback-1',
        date: new Date().toISOString(),
        header: "Low energy day. Here is what actually helps.",
        move: { title: "Gentle Neck Rolls", action: "Slowly roll your neck in circles for 2 minutes.", benefit: "Releases tension in the upper cervical spine." },
        fuel: { title: "Warm Lemon Water", action: "Drink 8oz of warm water with a squeeze of lemon.", benefit: "Gently wakes up the digestive system." },
        recover: { title: "5-Minute Eye Rest", action: "Close your eyes and palm them with your hands.", benefit: "Reduces optic nerve strain from screens." },
        completedParts: []
    },
    {
        id: 'fallback-2',
        date: new Date().toISOString(),
        header: "A quick reset for a busy day.",
        move: { title: "Wall Pushes", action: "Push against a wall with all your might for 30 seconds.", benefit: "Engages large muscle groups and grounds energy." },
        fuel: { title: "Handful of Almonds", action: "Eat 10-12 raw almonds, chewing each 30 times.", benefit: "Provides stable fats and protein for focus." },
        recover: { title: "Box Breathing", action: "4s in, 4s hold, 4s out, 4s hold. Repeat 4 times.", benefit: "Instantly calms the nervous system." },
        completedParts: []
    },
    {
        id: 'fallback-3',
        date: new Date().toISOString(),
        header: "Feeling good? Let's build on it.",
        move: { title: "Bodyweight Squats", action: "Do 15 slow, controlled squats.", benefit: "Increases lower body circulation and strength." },
        fuel: { title: "Green Tea", action: "Sip a cup of high-quality green tea.", benefit: "Provides L-theanine for calm focus." },
        recover: { title: "Legs Up The Wall", action: "Lie on the floor with your legs resting against a wall.", benefit: "Assists lymphatic drainage and heart rest." },
        completedParts: []
    },
    {
        id: 'fallback-4',
        date: new Date().toISOString(),
        header: "Focus on stability today.",
        move: { title: "Single Leg Stand", action: "Stand on one leg for 45 seconds each side.", benefit: "Improves balance and ankle stability." },
        fuel: { title: "Berry Bowl", action: "Eat a small bowl of blueberries or raspberries.", benefit: "High in antioxidants for neural protection." },
        recover: { title: "Digital Sunset", action: "Put your phone in another room for 20 minutes.", benefit: "Reduces dopamine-driven stress." },
        completedParts: []
    },
    {
        id: 'fallback-5',
        date: new Date().toISOString(),
        header: "Recovery is the priority now.",
        move: { title: "Cat-Cow Stretch", action: "Move between arched and rounded back 10 times.", benefit: "Mobilizes the entire spinal column." },
        fuel: { title: "Magnesium Snack", action: "Eat a square of 85% dark chocolate.", benefit: "Provides magnesium for muscle relaxation." },
        recover: { title: "Child's Pose", action: "Rest in child's pose for 3 minutes.", benefit: "Deeply calming for the brain and back." },
        completedParts: []
    },
    {
        id: 'fallback-6',
        date: new Date().toISOString(),
        header: "Small wins lead to big changes.",
        move: { title: "Standing Desk Marches", action: "March in place for 2 minutes while working.", benefit: "Prevents blood pooling in the legs." },
        fuel: { title: "Apple & Cinnamon", action: "Slice an apple and sprinkle with cinnamon.", benefit: "Stabilizes blood sugar and provides fiber." },
        recover: { title: "Humming Breath", action: "Inhale, then hum loudly on the exhale 5 times.", benefit: "Vibrates the vagus nerve for relaxation." },
        completedParts: []
    },
    {
        id: 'fallback-7',
        date: new Date().toISOString(),
        header: "Energy is high. Use it wisely.",
        move: { title: "Plank Hold", action: "Hold a forearm plank for as long as you can.", benefit: "Builds core integrity and mental resilience." },
        fuel: { title: "Protein Power", action: "Eat two hard-boiled eggs.", benefit: "Provides choline for brain health." },
        recover: { title: "Cold Face Splash", action: "Splash your face with ice-cold water 3 times.", benefit: "Triggers the mammalian dive reflex for calm." },
        completedParts: []
    },
    {
        id: 'fallback-8',
        date: new Date().toISOString(),
        header: "A moment of calm in the chaos.",
        move: { title: "Shoulder Shrugs", action: "Lift shoulders to ears and drop them 15 times.", benefit: "Releases held tension in the trapezius." },
        fuel: { title: "Ginger Tea", action: "Drink warm ginger tea or chew a piece of ginger.", benefit: "Anti-inflammatory and aids digestion." },
        recover: { title: "Horizon Gaze", action: "Look at the furthest point on the horizon for 2 mins.", benefit: "Resets optic flow and reduces myopia stress." },
        completedParts: []
    },
    {
        id: 'fallback-9',
        date: new Date().toISOString(),
        header: "Let's find your center.",
        move: { title: "Heel Drops", action: "Rise on toes and drop hard on heels 10 times.", benefit: "Bone vibration signals safety to the brain." },
        fuel: { title: "Walnut Boost", action: "Eat 5 whole walnuts slowly.", benefit: "Omega-3s for cognitive health." },
        recover: { title: "Physiological Sigh", action: "Double inhale, then one long exhale. Repeat 3x.", benefit: "The fastest way to lower heart rate." },
        completedParts: []
    },
    {
        id: 'fallback-10',
        date: new Date().toISOString(),
        header: "Simple, effective, done.",
        move: { title: "Wrist & Ankle Circles", action: "Rotate each joint 20 times in both directions.", benefit: "Lubricates joints and improves mobility." },
        fuel: { title: "Chia Water", action: "Add 1 tsp chia seeds to water and drink.", benefit: "Hydration with slow-release energy." },
        recover: { title: "Gratitude Text", action: "Send a 'thank you' text to one person.", benefit: "Boosts oxytocin and social connection." },
        completedParts: []
    }
];

export const generateDailyRecommendation = async (
    onboarding: OnboardingData,
    checkIn: DailyCheckInData,
    history: DailyRecommendation[] = []
): Promise<DailyRecommendation> => {
    try {
        const ai = getAI();
        const lastThree = history.slice(0, 3).map(r => r.move.title).join(', ');
        
        const goalText = onboarding.mainGoal;
        const limitationText = onboarding.limitations;
        const locationText = onboarding.location;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: `
                Goal: ${goalText}. Limits: ${limitationText}. Loc: ${locationText}. 
                Energy: ${checkIn.energy}. Time: ${checkIn.time}. 
                Avoid: ${lastThree}.
                
                Generate 3-part plan (MOVE, FUEL, RECOVER).
            `,
            config: {
                systemInstruction: RECOMMENDATION_SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        header: { type: Type.STRING },
                        move: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                action: { type: Type.STRING },
                                benefit: { type: Type.STRING }
                            },
                            required: ["title", "action", "benefit"]
                        },
                        fuel: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                action: { type: Type.STRING },
                                benefit: { type: Type.STRING }
                            },
                            required: ["title", "action", "benefit"]
                        },
                        recover: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                action: { type: Type.STRING },
                                benefit: { type: Type.STRING }
                            },
                            required: ["title", "action", "benefit"]
                        }
                    },
                    required: ["header", "move", "fuel", "recover"]
                }
            }
        });

        const data = JSON.parse(cleanJSON(response.text || ""));
        return {
            ...data,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
            completedParts: []
        };
    } catch (error) {
        console.error("Failed to generate recommendation", error);
        throw error; // Let App.tsx handle the error state
    }
};

export const askOracle = async (question: string, context?: any): Promise<OracleResponse> => {
    try {
        const ai = getAI();
        const contextStr = context ? JSON.stringify(context) : 'No specific context';
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Context: ${contextStr}. Question: "${question}".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { answer: { type: Type.STRING } },
                    required: ["answer"]
                }
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("Empty response from Oracle");
        return JSON.parse(cleanJSON(text));
    } catch (e: any) {
        console.error("Oracle Error:", e);
        
        // Handle API key selection if requested entity was not found
        if (e.message?.includes("Requested entity was not found") && typeof window !== 'undefined' && (window as any).aistudio) {
            try {
                await (window as any).aistudio.openSelectKey();
                return { answer: "Please select a valid API key in the dialog that appeared to continue using the Oracle." };
            } catch (err) {
                console.error("Failed to open key selection:", err);
            }
        }
        
        return { answer: "The mists are too thick. I cannot see clearly right now. Please try again in a moment." };
    }
}
