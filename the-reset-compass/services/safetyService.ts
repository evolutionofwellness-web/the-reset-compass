
export const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "want to die", "end it all", "better off dead", 
  "hurt myself", "cutting myself", "self harm", "self-harm", "overdose",
  "jump off", "hang myself", "shoot myself", "end my life"
];

export const CRISIS_RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline (USA)",
    description: "24/7, free and confidential support.",
    action: "Call 988",
    link: "tel:988"
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to 741741 to connect with a Crisis Counselor.",
    action: "Text 741741",
    link: "sms:741741&body=HOME"
  },
  {
    name: "International Befrienders",
    description: "Find a helpline in your country.",
    action: "Find Helpline",
    link: "https://www.befrienders.org/"
  }
];

export const detectHarmfulContent = (text: string): boolean => {
  const normalized = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword));
};
