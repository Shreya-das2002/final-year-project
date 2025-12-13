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
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: shreyaImg,
    email: "das.shreya.sid@gmail.com",
    num: 7001142661
  },
  {
    id: 2,
    name: "Subhankar Basak",
    role: "Designer",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: subhaImg,
    email: "subhankar612003@gmail.com",
    num: 9434824762
  },
  {
    id: 3,
    name: "Ranabir Basak",
    role: "ML Engineer",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: ranaImg,
    email: "ranabirbasak2004@gmail.com",
    num: 7679006309
  },
    {
    id: 4,
    name: "Rinki Singha Roy",
    role: "Detabase Engineer",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: "https://www.w3schools.com/w3images/team2.jpg",
    email: "rinkisingharoy850@gmail.com",
    num: 7797185159
  },
];
