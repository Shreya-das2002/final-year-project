import shreyaImg from "./assets/Shreya.jpg";
import subhaImg from "./assets/Subhankar.jpg";
import ranaImg from "./assets/Ranabir.jpg";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  desc: string;
  img: string;
  email: string;
  num: number;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Shreya Das",
    role: "Full-Stack Developer",
    desc: "Works on both frontend and backend parts of the project. Focuses on implementing features and ensuring smooth application functionality.",
    img: shreyaImg,
    email: "das.shreya.sid@gmail.com",
    num: 7001142661
  },
  {
    id: 2,
    name: "Subhankar Basak",
    role: "Designer",
    desc: "Handles the visual layout and user interface design. Pays attention to clarity, usability, and consistent design across the application.",
    img: subhaImg,
    email: "subhankar612003@gmail.com",
    num: 9434824762
  },
  {
    id: 3,
    name: "Ranabir Basak",
    role: "ML Engineer",
    desc: "Works on machine learning components and data handling tasks. Assists in building and testing models used within the project.",
    img: ranaImg,
    email: "ranabirbasak2004@gmail.com",
    num: 7679006309
  },
    {
    id: 4,
    name: "Rinki Singha Roy",
    role: "Detabase Engineer",
    desc: "Manages database structure and basic data organization. Supports data storage, retrieval, and overall system consistency.",
    img: "https://www.w3schools.com/w3images/team2.jpg",
    email: "rinkisingharoy850@gmail.com",
    num: 7797185159
  },
];


// for faq questions
export interface  FAQItem  {
  question: string;
  answer: string;
};


  export const faqData: FAQItem[] = [
  {
    question: "What is SymptoNexus?",
    answer:
      "SymptoNexus is a digital healthcare platform designed to help users assess symptoms, manage health-related information, and connect with healthcare professionals securely.",
  },
  {
    question: "Who can use SymptoNexus?",
    answer:
      "SymptoNexus can be used by patients, doctors, and administrators. Each user role has specific features and access permissions.",
  },
  {
    question: "Is SymptoNexus a replacement for a doctor?",
    answer:
      "No. SymptoNexus is not a substitute for professional medical advice. It is intended to support users in understanding symptoms and seeking appropriate care.",
  },
  {
    question: "How does SymptoNexus analyze symptoms?",
    answer:
      "The platform uses structured medical data and predefined logic to analyze symptoms and provide general health insights for informational purposes.",
  },
  {
    question: "Is my personal and medical data secure?",
    answer:
      "Yes. SymptoNexus uses secure authentication and role-based access control to protect personal and medical information.",
  },
  {
    question: "What should I do in case of a medical emergency?",
    answer:
      "In a medical emergency, users should immediately contact local emergency services or visit the nearest hospital. SymptoNexus should not be used for emergency diagnosis.",
  },
];

// Check if password is strong
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

// Match password & confirm password
export const doPasswordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

export const isValidDOB = (dob: string): boolean => {
  if (!dob) return false;

  const birthDate = new Date(dob);
  const today = new Date();

  return birthDate < today;
};

// Calculate age from DOB (optional but useful)
export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export type Gender = "male" | "female" | "other";

// Allowed gender options
export const genderOptions: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

// Validate gender value
export const isValidGender = (gender: string): boolean => {
  return ["male", "female", "other"].includes(gender);
};