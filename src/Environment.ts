import shreyaImg from "./assets/Shreya.jpg";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  desc: string;
  img: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Jane Doe",
    role: "CEO & Founder",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: shreyaImg,
  },
  {
    id: 2,
    name: "Mike Ross",
    role: "Art Director",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: "https://www.w3schools.com/w3images/team2.jpg",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Designer",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: "https://www.w3schools.com/w3images/team3.jpg",
  },
    {
    id: 4,
    name: "Mike Ross",
    role: "Art Director",
    desc: "Some text that describes me lorem ipsum ipsum lorem.",
    img: "https://www.w3schools.com/w3images/team2.jpg",
  },
];
