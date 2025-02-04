export const onboardingSteps = [
  {
    id: 1,
    question: "What would you like us to call you?",
    type: "text",
    placeholder: "Your name",
  },
  {
    id: 2,
    question: "How can we help you?",
    type: "multi-select",
    options: [
      "Improve sleep",
      "Reduce stress",
      "Increase productivity",
      "Other",
    ],
  },
  {
    id: 3,
    question: "Would you like to achieve other goals?",
    type: "multi-select",
    options: ["Lose weight", "Exercise more", "Eat healthier", "Other"],
  },
  {
    id: 4,
    question: "What is stopping you from getting better rest?",
    type: "multi-select",
    options: [
      "Very busy schedule",
      "Donate notifications",
      "I don't know how to start",
      "Other",
    ],
  },
  {
    id: 5,
    question: "Do you know the stages of sleep?",
    type: "multi-select",
    options: ["Yes", "No", "A little"],
  },
];
