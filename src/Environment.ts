import shreyaImg from "./assets/Shreya.jpg";
import subhaImg from "./assets/Subhankar.jpg";
import ranaImg from "./assets/Ranabir.jpg";
import rinkiImg from "./assets/Rinki.jpg";

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
    role: "Database Engineer",
    desc: "Manages database structure and basic data organization. Supports data storage, retrieval, and overall system consistency.",
    img: rinkiImg,
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
    question: "Who should use SymptoNexus?",
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
  {
    question: "Can I book both online and in-person appointments?",
    answer:
      "Yes. SymptoNexus allows patients to book both virtual (online) and physical (in-person) appointments with available doctors through the platform.",
  },
  {
    question: "Do I need to create an account to use SymptoNexus?",
    answer:
      "Patients are required to create an account to access features such as appointment booking and personalized services. Doctors and administrators receive login credentials from the system administrator.",
  },
  {
    question: "Does the chatbot suggest medicines or medical tests?",
    answer:
      "No. The chatbot does not recommend medicines, medical tests, or treatments. It only provides general information and safe home remedies for awareness and comfort.",
  },
  {
    question: "How accurate is the symptom prediction feature?",
    answer:
      "The symptom analysis feature provides approximate and educational insights based on available data. It should not be considered a medical diagnosis and must be followed by professional consultation when needed.",
  },
  {
    question: "Can doctors view patient information?",
    answer:
      "Yes. Doctors can view basic patient-provided information relevant to scheduled appointments, helping them prepare for consultations while maintaining data privacy.",
  },
  {
    question: "Who manages doctor accounts on SymptoNexus?",
    answer:
      "Doctor accounts are created and managed exclusively by the system administrator to ensure authenticity and controlled access.",
  },
  {
    question: "Will SymptoNexus store my medical history?",
    answer:
      "Currently, SymptoNexus stores only essential information required for platform functionality. Future versions may include optional medical history features with user consent.",
  },

];


// Password strength levels
export type PasswordStrength = "Weak" | "Medium" | "Strong";

/**
 * Check if password is STRONG (for final submit)
 * Rules:
 * - EXACTLY 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

/**
 * Get password strength level (for UI)
 * Weak   → 0–1 rules satisfied
 * Medium → 2–3 rules satisfied
 * Strong → All 4 rules satisfied
 */
export const getPasswordStrength = (
  password: string
): PasswordStrength => {
  if (!password) return "Weak";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score =
    Number(hasUpper) +
    Number(hasLower) +
    Number(hasNumber) +
    Number(hasSpecial);

  if (score === 4) return "Strong";
  if (score >= 2) return "Medium";

  return "Weak";
};


/**
 * Match password and confirm password
 */
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

export const datePickerStyles = {
  month: {
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontWeight: 500,
    hoverBg: "#ccfbf1",
    selectedBg: "#0d9488",
    selectedColor: "#ffffff",
  },

  year: {
    borderRadius: "6px",
    fontSize: "14px",
    selectedBg: "#1e40af",
    selectedColor: "#ffffff",
  },

  date: {
    borderRadius: "50%",
    fontSize: "14px",
    hoverBg: "#e0f2fe",
    selectedBg: "#2563eb",
    selectedColor: "#ffffff",
    todayBorder: "1px solid #2563eb",
  },

  header: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};


export type Gender = "male" | "female" | "other";

// Allowed gender options
export const genderOptions: { label: string; value: Gender }[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "other" },
];

// Validate gender value
export const isValidGender = (gender: string): boolean => {
  return ["male", "female", "other"].includes(gender);
};

export type Role = "doctor" | "patient" | "admin";

export const getRoleFromUrl = (search: string): Role => {
  const params = new URLSearchParams(search);
  return (params.get("role") as Role) ?? "doctor";
};

// ================= AGE HELPERS =================

export const calculateAge = (dob: string): string => {
  if (!dob) return "";

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

  return age.toString();
};

/* ================= GENDER MAP ================= */

export const GENDER_MAP: Record<string, string> = {
  "1": "Male",
  "2": "Female",
  "3": "Others",
};

export const bloodGroupMap: Record<number, string> = {
  1: "A+",
  2: "A-",
  3: "B+",
  4: "B-",
  5: "AB+",
  6: "AB-",
  7: "O+",
  8: "O-",
};

/* ================= HELPERS ================= */

export const getGenderLabel = (value?: string | number): string => {
  if (!value) return "—";
  return GENDER_MAP[String(value)] ?? "—";
};

export const urls ={
  baseUrl : 'http://localhost:4000/api/',
  loginUrl :'auth/login',
  signupUrl : 'auth/signup',
  profileurl : 'patient/profile',
  createAdminUrl : 'admin/create',
  getAllAdminsUrl: 'admin/alladmins'
}


/* ================= MENU ORDER BY ROLE ================= */

export const SIDE_NAV_CONTROLS: string[] = [
  "patient dashboard",
  "symptom checker",
  "symptobot",
  "patient appointments",
  "feedback",

  "admin dashboard",
  "create admin",
  "admin list",
  "pending doctor list",
  "doctor list",
  "messages",
  "add doctor",

  "doctor dashboard",
  "doctor appointment",
  "appointment requests",

  "logout",
];

// menu ➜ route mapping
export const MENU_ROUTE_MAP: Record<string, string> = {
  "patient dashboard": "/patient",
  "symptom checker": "/patient/symptom_checker",
  "symptobot": "/patient/chatbot",
  "patient appointments": "/patient/appointments",
  "feedback": "/patient/feedback",

  "doctor dashboard": "/doctor",
  "doctor appointment": "/doctor/appointments",
  "appointment requests": "/doctor/appointment_requests",

  "admin dashboard": "/admin",
  "create admin": "/admin/create_admin",
  "admin list": "/admin/admin_list",
  "pending doctor list": "/admin/pending_doctor_list",
  "doctor list": "/admin/doctor_list",
  "messages": "/admin/messages",
  "add doctor": "/admin/add_doctor",

  "logout": "/logout",
};

/* ================= GET ROUTE HELPER ================= */

export const getRoute = (controlKey: string): string => {
  return MENU_ROUTE_MAP[controlKey] || "/";
};
