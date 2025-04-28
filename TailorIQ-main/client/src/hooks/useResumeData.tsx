import { useState } from "react";
import { Resume, ResumeTemplate } from "@shared/schema";

// Default resume data with sample content
export const defaultResumeData: Resume = {
  personalInfo: {
    firstName: "Ronan",
    lastName: "Healy",
    title: "Software Engineer",
    email: "ronan.healy@example.com",
    phone: "(555) 123-4567",
    location: "Boulder, CO",
    linkedin: "linkedin.com/in/ronanhealy",
    portfolio: "ronanhealy.dev"
  },
  summary: "Experienced software engineer with a strong background in full-stack development and cloud architecture. Proven track record of delivering scalable solutions and leading technical teams.",
  experience: [
    {
      title: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "Present",
      description: "Lead developer for cloud-based applications",
      achievements: [
        "Architected and implemented microservices infrastructure",
        "Reduced system latency by 40% through optimization",
        "Mentored junior developers and conducted code reviews"
      ]
    },
    {
      title: "Software Engineer",
      company: "StartUp Inc",
      location: "San Francisco, CA",
      startDate: "2018-01",
      endDate: "2019-12",
      description: "Full-stack development for web applications",
      achievements: [
        "Developed RESTful APIs serving 1M+ requests daily",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Collaborated with UX team to improve user experience"
      ]
    }
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      gpa: "3.8",
      additionalInfo: "Dean's List, Computer Science Club President"
    }
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Agile Methodologies"
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2021-06"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google",
      date: "2020-03"
    }
  ],
  targetJob: {
    title: "Senior Software Engineer",
    company: "Tech Company",
    description: "Looking for an experienced software engineer to join our team. The ideal candidate should have strong experience in full-stack development, cloud architecture, and team leadership."
  }
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
