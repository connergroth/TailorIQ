import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { signOutUser } from "../firebase";

// Logo Component
const Logo = ({ darkMode }) => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center">
        <span className="text-white font-bold text-xl">T</span>
      </div>
      <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>TailorIQ</h1>
    </Link>
  );
};

// Navbar for Questionnaire Page
const QuestionnairePage = ({ darkMode, toggleDarkMode }) => {
  const handleLogout = async () => {
    try {
      await signOutUser();
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 shadow-sm py-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        <Logo darkMode={darkMode} />
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode} 
            className={`p-2.5 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} transition-all duration-300`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button 
            onClick={handleLogout}
            className={`${darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'} transition-colors duration-300`}
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

/**
 * QuestionnaireSection
 * --------------------
 * A multi‑step form that gathers the user's résumé details.
 * Styled to match TailorIQ's landing‑page theme with full
 * light / dark‑mode support and smooth UI transitions.
 */
const QuestionnaireSection = ({ darkMode, onSubmit, toggleDarkMode }) => {
  /* -------------------------- state management -------------------------- */
  const [personal, setPersonal] = useState({
    phone: "",
    email: "",
    linkedIn: "",
    personalLink: "",
    usCitizen: false,
    jobTitle: "",
    city: "",
    state: ""
  });

  const [education, setEducation] = useState([
    {
      institution: "",
      startYear: "",
      endYear: "",
      major: "",
      minor: "",
      coursework: [""],
      gpa: ""
    }
  ]);

  const [experience, setExperience] = useState([
    { title: "", company: "", startDate: "", endDate: "", description: "" }
  ]);

  const [projects, setProjects] = useState([
    { name: "", description: "", dates: "" }
  ]);

  const [skills, setSkills] = useState([""]);

  /* ----------------------------- handlers ------------------------------- */
  // personal
  const handlePersonal = (e) => {
    const { name, value, type, checked } = e.target;
    setPersonal((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // education
  const handleEduChange = (idx, field, value) => {
    setEducation((prev) => {
      const next = [...prev];
      next[idx][field] = value;
      return next;
    });
  };
  const addEducation = () =>
    setEducation((prev) => [
      ...prev,
      {
        institution: "",
        startYear: "",
        endYear: "",
        major: "",
        minor: "",
        coursework: [""],
        gpa: ""
      }
    ]);
  const removeEducation = (idx) =>
    setEducation((prev) => prev.filter((_, i) => i !== idx));

  // experience
  const handleExpChange = (idx, field, value) => {
    setExperience((prev) => {
      const next = [...prev];
      next[idx][field] = value;
      return next;
    });
  };
  const addExperience = () =>
    setExperience((prev) => [
      ...prev,
      { title: "", company: "", startDate: "", endDate: "", description: "" }
    ]);
  const removeExperience = (idx) =>
    setExperience((prev) => prev.filter((_, i) => i !== idx));

  // projects
  const handleProjChange = (idx, field, value) => {
    setProjects((prev) => {
      const next = [...prev];
      next[idx][field] = value;
      return next;
    });
  };
  const addProject = () =>
    setProjects((prev) => [...prev, { name: "", description: "", dates: "" }]);
  const removeProject = (idx) =>
    setProjects((prev) => prev.filter((_, i) => i !== idx));

  // skills
  const handleSkillChange = (idx, value) => {
    setSkills((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };
  const addSkill = () => skills.length < 20 && setSkills((prev) => [...prev, ""]);
  const removeSkill = (idx) =>
    setSkills((prev) => prev.filter((_, i) => i !== idx));

  /* --------------------------- helper UI -------------------------------- */
  const inputClasses =
  "w-full p-3 rounded-md border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500";
const inputLight = "bg-white border-gray-300 placeholder-gray-500";
const inputDark = "bg-gray-800 border-gray-700 text-white placeholder-gray-400";

  const cardClasses =
    "mb-6 p-6 rounded-xl shadow-sm transition-colors duration-300";
  const cardLight = "bg-white border border-gray-200";
  const cardDark = "bg-gray-800 border border-gray-700";

  const sectionTitle =
    "text-2xl font-semibold mb-6 transition-colors duration-300";

  const actionBtn =
    "font-medium text-indigo-600 dark:text-indigo-400 hover:underline transition-colors duration-300";

  /* ------------------------------ render -------------------------------- */
  return (
    <>
      <QuestionnairePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <section
          id="questionnaire"
          className={`py-20 ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors duration-300`}
      >
          <div className="container mx-auto px-4">
              {/* heading */}
              <h2
                  className={`text-3xl font-bold mb-12 text-center ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
              >
                  Tell Us About You
              </h2>

              {/* ----------------------- Personal Info ----------------------- */}
              <div className="mb-16">
                  <h3 className={`${sectionTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                          { label: "Phone Number", name: "phone", type: "text" },
                          { label: "Email", name: "email", type: "email" },
                          { label: "LinkedIn URL", name: "linkedIn", type: "url" },
                          { label: "Personal Website", name: "personalLink", type: "url" },
                          { label: "Job Title", name: "jobTitle", type: "text" },
                          { label: "City", name: "city", type: "text" },
                          { label: "State", name: "state", type: "text" }
                      ].map((field) => (
                          <div key={field.name}>
                              <label className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{field.label}</label>
                              <input
                                  type={field.type}
                                  name={field.name}
                                  value={personal[field.name]}
                                  onChange={handlePersonal}
                                  className={`${inputClasses} ${darkMode ? inputDark : inputLight}`} />
                          </div>
                      ))}

                      {/* citizenship checkbox */}
                      <div className="flex items-center mt-1">
                          <input
                              id="usCitizen"
                              type="checkbox"
                              name="usCitizen"
                              checked={personal.usCitizen}
                              onChange={handlePersonal}
                              className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600" />
                          <label htmlFor="usCitizen" className={`ml-3 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              U.S. Citizen
                          </label>
                      </div>
                  </div>
              </div>

              {/* -------------------------- Education ------------------------- */}
              <div className="mb-16">
                  <h3 className={`${sectionTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>Education</h3>
                  {education.map((edu, idx) => (
                      <div
                          key={idx}
                          className={`${cardClasses} ${darkMode ? cardDark : cardLight}`}
                      >
                          {[
                              "institution",
                              "startYear",
                              "endYear",
                              "major",
                              "minor",
                              "gpa"
                          ].map((field) => (
                              <div key={field} className="mb-4">
                                  <label className={`block mb-1 capitalize ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      {field.replace(/([A-Z])/g, " $1")}
                                  </label>
                                  <input
                                      type="text"
                                      value={edu[field]}
                                      onChange={(e) => handleEduChange(idx, field, e.target.value)}
                                      className={`${inputClasses} ${darkMode ? inputDark : inputLight}`} />
                              </div>
                          ))}
                          <div className="mb-4">
                              <label className={`block mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Coursework (comma separated)</label>
                              <input
                                  type="text"
                                  value={edu.coursework.join(", ")}
                                  onChange={(e) => handleEduChange(
                                      idx,
                                      "coursework",
                                      e.target.value.split(",").map((c) => c.trim())
                                  )}
                                  className={`${inputClasses} ${darkMode ? inputDark : inputLight}`} />
                          </div>
                          <div className="flex space-x-6 mt-2">
                              <button onClick={addEducation} className={actionBtn}>
                                  + Add Education
                              </button>
                              {education.length > 1 && (
                                  <button
                                      onClick={() => removeEducation(idx)}
                                      className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                  >
                                      Remove
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
              </div>

              {/* -------------------------- Experience ------------------------ */}
              <div className="mb-16">
                  <h3 className={`${sectionTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>Experience</h3>
                  {experience.map((exp, idx) => (
                      <div
                          key={idx}
                          className={`${cardClasses} ${darkMode ? cardDark : cardLight}`}
                      >
                          {[
                              "title",
                              "company",
                              "startDate",
                              "endDate",
                              "description"
                          ].map((field) => (
                              <div key={field} className="mb-4">
                                  <label className={`block mb-1 capitalize ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      {field.replace(/([A-Z])/g, " $1")}
                                  </label>
                                  <input
                                      type="text"
                                      value={exp[field]}
                                      onChange={(e) => handleExpChange(idx, field, e.target.value)}
                                      className={`${inputClasses} ${darkMode ? inputDark : inputLight}`} />
                              </div>
                          ))}
                          <div className="flex space-x-6 mt-2">
                              <button onClick={addExperience} className={actionBtn}>
                                  + Add Experience
                              </button>
                              {experience.length > 1 && (
                                  <button
                                      onClick={() => removeExperience(idx)}
                                      className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                  >
                                      Remove
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
              </div>

              {/* -------------------------- Projects -------------------------- */}
              <div className="mb-16">
                  <h3 className={`${sectionTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>Projects</h3>
                  {projects.map((proj, idx) => (
                      <div
                          key={idx}
                          className={`${cardClasses} ${darkMode ? cardDark : cardLight}`}
                      >
                          {[
                              "name",
                              "description",
                              "dates"
                          ].map((field) => (
                              <div key={field} className="mb-4">
                                  <label className={`block mb-1 capitalize ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                      {field.replace(/([A-Z])/g, " $1")}
                                  </label>
                                  <input
                                      type="text"
                                      value={proj[field]}
                                      onChange={(e) => handleProjChange(idx, field, e.target.value)}
                                      className={`${inputClasses} ${darkMode ? inputDark : inputLight}`} />
                              </div>
                          ))}
                          <div className="flex space-x-6 mt-2">
                              <button onClick={addProject} className={actionBtn}>
                                  + Add Project
                              </button>
                              {projects.length > 1 && (
                                  <button
                                      onClick={() => removeProject(idx)}
                                      className="text-red-600 dark:text-red-400 hover:underline font-medium"
                                  >
                                      Remove
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
              </div>

              {/* --------------------------- Skills --------------------------- */}
              <div className="mb-12">
                  <h3 className={`${sectionTitle} ${darkMode ? "text-white" : "text-gray-900"}`}>Skills</h3>
                  {skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center space-x-4 mb-4">
                          <input
                              type="text"
                              value={skill}
                              onChange={(e) => handleSkillChange(idx, e.target.value)}
                              className={`${inputClasses} flex-1 ${darkMode ? inputDark : inputLight}`}
                              placeholder="Skill" />
                          {skills.length > 1 && (
                              <button
                                  onClick={() => removeSkill(idx)}
                                  className="text-red-600 dark:text-red-400 hover:underline font-medium"
                              >
                                  Remove
                              </button>
                          )}
                      </div>
                  ))}
                  <button onClick={addSkill} className={actionBtn}>
                      + Add Another Skill
                  </button>
              </div>
          </div>
      </section>
      <div className={`mt-3 mb-16 flex justify-center px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <button
          onClick={onSubmit}
          className={`mt-12 w-full md:w-auto px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 ${darkMode
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          See Resume!
        </button>
      </div>
    </>
  );
};

export default QuestionnaireSection;