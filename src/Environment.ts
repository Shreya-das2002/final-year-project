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
