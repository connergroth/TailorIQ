import React, { useState } from 'react';

const QuestionnaireSection = ({ darkMode }) => {
  const [personal, setPersonal] = useState({
    phone: '', email: '', linkedIn: '', personalLink: '',
    usCitizen: false, jobTitle: '', city: '', state: ''
  });
  const [education, setEducation] = useState([
    { institution: '', startYear: '', endYear: '', major: '', minor: '', coursework: [''], gpa: '' }
  ]);
  const [experience, setExperience] = useState([
    { title: '', company: '', startDate: '', endDate: '', description: '' }
  ]);
  const [projects, setProjects] = useState([
    { name: '', description: '', dates: '' }
  ]);
  const [skills, setSkills] = useState(['']);

  const handlePersonal = (e) => {
    const { name, value, type, checked } = e.target;
    setPersonal((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEduChange = (idx, field, value) => {
    const list = [...education];
    list[idx][field] = value;
    setEducation(list);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { institution: '', startYear: '', endYear: '', major: '', minor: '', coursework: [''], gpa: '' }
    ]);
  };

  const handleExpChange = (idx, field, value) => {
    const list = [...experience];
    list[idx][field] = value;
    setExperience(list);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { title: '', company: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const handleProjChange = (idx, field, value) => {
    const list = [...projects];
    list[idx][field] = value;
    setProjects(list);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { name: '', description: '', dates: '' }
    ]);
  };

  const handleSkillChange = (idx, value) => {
    const list = [...skills];
    list[idx] = value;
    setSkills(list);
  };

  const addSkill = () => {
    if (skills.length < 20) {
      setSkills([...skills, '']);
    }
  };

  return (
    <section id="questionnaire" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tell Us About You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            {[
              { label: 'Phone Number', name: 'phone', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'LinkedIn URL', name: 'linkedIn', type: 'url' },
              { label: 'Personal Website', name: 'personalLink', type: 'url' },
              { label: 'Job Title', name: 'jobTitle', type: 'text' },
              { label: 'City', name: 'city', type: 'text' },
              { label: 'State', name: 'state', type: 'text' }
            ].map(field => (
              <div key={field.name} className="mb-4">
                <label className="block mb-1 font-medium">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={personal[field.name]}
                  onChange={handlePersonal}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                name="usCitizen"
                checked={personal.usCitizen}
                onChange={handlePersonal}
                id="usCitizen"
                className="mr-2"
              />
              <label htmlFor="usCitizen" className="font-medium">U.S. Citizen</label>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Education</h3>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-6 p-4 border rounded bg-white dark:bg-gray-700">
                {['institution', 'startYear', 'endYear', 'major', 'minor', 'gpa'].map(field => (
                  <div key={field} className="mb-3">
                    <label className="block mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      value={edu[field]}
                      onChange={e => handleEduChange(idx, field, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="block mb-1">Coursework (comma separated)</label>
                  <input
                    type="text"
                    value={edu.coursework.join(', ')}
                    onChange={e =>
                      handleEduChange(
                        idx,
                        'coursework',
                        e.target.value.split(',').map(c => c.trim())
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button onClick={addEducation} className="mt-2 text-indigo-600">
                  + Add Another Education
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Experience</h3>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-6 p-4 border rounded bg-white dark:bg-gray-700">
              {['title', 'company', 'startDate', 'endDate', 'description'].map(field => (
                <div key={field} className="mb-3">
                  <label className="block mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={exp[field]}
                    onChange={e => handleExpChange(idx, field, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          ))}
          <button onClick={addExperience} className="text-indigo-600">
            + Add Another Experience
          </button>
        </div>

        {/* Projects Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Projects</h3>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-6 p-4 border rounded bg-white dark:bg-gray-700">
              {['name', 'description', 'dates'].map(field => (
                <div key={field} className="mb-3">
                  <label className="block mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    value={proj[field]}
                    onChange={e => handleProjChange(idx, field, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
          ))}
          <button onClick={addProject} className="text-indigo-600">
            + Add Another Project
          </button>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Skills</h3>
          {skills.map((skill, idx) => (
            <div key={idx} className="mb-3">
              <input
                type="text"
                value={skill}
                onChange={e => handleSkillChange(idx, e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Skill"
              />
            </div>
          ))}
          <button onClick={addSkill} className="text-indigo-600">
            + Add Another Skill
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuestionnaireSection;
