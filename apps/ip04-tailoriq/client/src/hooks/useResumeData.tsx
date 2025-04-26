import { useState } from "react";
import { Resume, ResumeTemplate } from "@shared/schema";

// Default resume data with sample content
const defaultResumeData: Resume = {
  personalInfo: {
    firstName: "John",
    lastName: "Smith",
    title: "Senior Software Engineer",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johnsmith",
    portfolio: "johnsmith.dev"
  },
  summary: "Innovative and deadline-driven Software Engineer with 8+ years of experience designing and developing user-centered digital/print marketing material from initial concept to final, polished deliverable. Proficient in developing databases, creating user interfaces, writing and testing codes, troubleshooting simple/complex issues, and implementing new features based on user feedback.",
  experience: [
    {
      company: "TechCorp Inc.",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      period: "Jan 2020 - Present",
      description: "",
      achievements: [
        "Led a team of 5 engineers to rebuild the company's flagship product, resulting in a 35% increase in user engagement",
        "Implemented microservices architecture that improved system reliability by 99.9%",
        "Mentored junior developers and conducted code reviews to maintain code quality"
      ]
    },
    {
      company: "InnoSoft Solutions",
      title: "Software Engineer",
      location: "San Francisco, CA",
      period: "Mar 2017 - Dec 2019",
      description: "",
      achievements: [
        "Developed RESTful APIs and microservices for the company's e-commerce platform",
        "Reduced page load time by 40% through code optimization and implementing CDN solutions",
        "Collaborated with UX designers to implement responsive and accessible user interfaces"
      ]
    }
  ],
  education: [
    {
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      period: "2015 - 2017",
      gpa: "3.8/4.0",
      additionalInfo: ""
    },
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Software Engineering",
      period: "2011 - 2015",
      gpa: "3.7/4.0",
      additionalInfo: "Graduated with Honors"
    }
  ],
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "CI/CD",
    "Microservices",
    "MongoDB",
    "GraphQL"
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2021"
    },
    {
      name: "Certified Scrum Master",
      issuer: "Scrum Alliance",
      date: "2019"
    }
  ]
};

// Empty resume data for starting with a clean slate
const emptyResumeData: Resume = {
  personalInfo: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: ""
  },
  summary: "",
  experience: [
    {
      company: "",
      title: "",
      location: "",
      period: "",
      description: "",
      achievements: [""]
    }
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      period: "",
      gpa: "",
      additionalInfo: ""
    }
  ],
  skills: [""],
  certifications: [
    {
      name: "",
      issuer: "",
      date: ""
    }
  ]
};

export default function useResumeData(initialData: Resume = defaultResumeData) {
  const [resumeData, setResumeData] = useState<Resume>(initialData);
  const [activeTemplate, setActiveTemplate] = useState<ResumeTemplate>("modern");

  const resetResumeData = () => {
    setResumeData(emptyResumeData);
  };

  const loadSampleData = () => {
    setResumeData(defaultResumeData);
  };

  return {
    resumeData,
    setResumeData,
    resetResumeData,
    loadSampleData,
    activeTemplate,
    setActiveTemplate
  };
}
