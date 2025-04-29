import { useState } from "react";
import { SectionType } from "@/pages/ResumeMaker";
import { Resume } from "@shared/schema";
import { 
  Input,
  Textarea,
  Button,
  Label 
} from "@/components/ui";
import { PlusCircle, Trash2, MoveUp, MoveDown, Briefcase, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormPanelProps {
  activeSection: SectionType;
  resumeData: Resume;
  setResumeData: (data: Resume) => void;
}

export default function FormPanel({ activeSection, resumeData, setResumeData }: FormPanelProps) {
  // Deep copy function for safe array manipulations
  const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

  // Update a specific field in the resume data
  const updateField = (section: string, field: string, value: string) => {
    const newResumeData = deepCopy(resumeData);
    if (section in newResumeData) {
      (newResumeData as any)[section][field] = value;
      setResumeData(newResumeData);
    }
  };

  // Add a new item to an array in the resume data
  const addNewItem = (section: 'experience' | 'education' | 'skills' | 'certifications') => {
    const updatedResumeData = deepCopy(resumeData);
    
    if (section === 'experience') {
      updatedResumeData.experience.push({
        company: '',
        title: '',
        location: '',
        period: '',
        description: '',
        achievements: ['']
      });
    } else if (section === 'education') {
      updatedResumeData.education.push({
        institution: '',
        degree: '',
        field: '',
        period: '',
        gpa: '',
        additionalInfo: ''
      });
    } else if (section === 'skills') {
      updatedResumeData.skills.push('');
    } else if (section === 'certifications') {
      updatedResumeData.certifications.push({
        name: '',
        issuer: '',
        date: ''
      });
    }
    
    setResumeData(updatedResumeData);
  };

  // Remove an item from an array in the resume data
  const removeItem = (section: 'experience' | 'education' | 'skills' | 'certifications', index: number) => {
    const updatedResumeData = deepCopy(resumeData);
    updatedResumeData[section].splice(index, 1);
    setResumeData(updatedResumeData);
  };

  // Update an item in an array
  const updateArrayItem = (
    section: 'experience' | 'education' | 'skills' | 'certifications', 
    index: number, 
    field: string, 
    value: string
  ) => {
    const updatedResumeData = deepCopy(resumeData);
    
    if (section === 'skills') {
      updatedResumeData.skills[index] = value;
    } else {
      updatedResumeData[section][index][field] = value;
    }
    
    setResumeData(updatedResumeData);
  };

  // Add a new achievement to an experience item
  const addAchievement = (experienceIndex: number) => {
    const updatedResumeData = deepCopy(resumeData);
    updatedResumeData.experience[experienceIndex].achievements.push('');
    setResumeData(updatedResumeData);
  };

  // Update an achievement within an experience item
  const updateAchievement = (experienceIndex: number, achievementIndex: number, value: string) => {
    const updatedResumeData = deepCopy(resumeData);
    updatedResumeData.experience[experienceIndex].achievements[achievementIndex] = value;
    setResumeData(updatedResumeData);
  };

  // Remove an achievement from an experience item
  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const updatedResumeData = deepCopy(resumeData);
    updatedResumeData.experience[experienceIndex].achievements.splice(achievementIndex, 1);
    setResumeData(updatedResumeData);
  };

  // Move an item up in an array
  const moveItemUp = (section: 'experience' | 'education' | 'skills' | 'certifications', index: number) => {
    if (index === 0) return; // Already at the top
    
    const updatedResumeData = deepCopy(resumeData);
    const temp = updatedResumeData[section][index];
    updatedResumeData[section][index] = updatedResumeData[section][index - 1];
    updatedResumeData[section][index - 1] = temp;
    
    setResumeData(updatedResumeData);
  };

  // Move an item down in an array
  const moveItemDown = (section: 'experience' | 'education' | 'skills' | 'certifications', index: number) => {
    if (index === resumeData[section].length - 1) return; // Already at the bottom
    
    const updatedResumeData = deepCopy(resumeData);
    const temp = updatedResumeData[section][index];
    updatedResumeData[section][index] = updatedResumeData[section][index + 1];
    updatedResumeData[section][index + 1] = temp;
    
    setResumeData(updatedResumeData);
  };

  // Render the active section based on the activeSection prop
  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div id="personal-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500">Enter your contact and basic information</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-800">First Name</Label>
                <Input 
                  id="firstName" 
                  value={resumeData.personalInfo.firstName} 
                  onChange={(e) => updateField('personalInfo', 'firstName', e.target.value)}
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-800">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={resumeData.personalInfo.lastName} 
                  onChange={(e) => updateField('personalInfo', 'lastName', e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="title" className="text-gray-800">Professional Title</Label>
              <Input 
                id="title" 
                value={resumeData.personalInfo.title} 
                onChange={(e) => updateField('personalInfo', 'title', e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="email" className="text-gray-800">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={resumeData.personalInfo.email} 
                onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="phone" className="text-gray-800">Phone</Label>
              <Input 
                id="phone" 
                value={resumeData.personalInfo.phone} 
                onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="location" className="text-gray-800">Location</Label>
              <Input 
                id="location" 
                value={resumeData.personalInfo.location} 
                onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="linkedin" className="text-gray-800">LinkedIn</Label>
              <Input 
                id="linkedin" 
                value={resumeData.personalInfo.linkedin || ''} 
                onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
                className="bg-white"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="portfolio" className="text-gray-800">Personal Website</Label>
              <Input 
                id="portfolio" 
                value={resumeData.personalInfo.portfolio || ''} 
                onChange={(e) => updateField('personalInfo', 'portfolio', e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        );
        
      case 'summary':
        return (
          <div id="summary-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Professional Summary</h2>
              <p className="text-sm text-gray-500">Provide a brief overview of your professional background and key qualifications</p>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="summary">Summary</Label>
              <Textarea 
                id="summary" 
                className="min-h-[150px]"
                value={resumeData.summary} 
                onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-2">
                Aim for 3-5 sentences that highlight your most relevant experience and accomplishments.
              </p>
            </div>
          </div>
        );
        
      case 'experience':
        return (
          <div id="experience-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
              <p className="text-sm text-gray-500">Add your work history, starting with your most recent position</p>
            </div>
            
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-gray-800">
                    {exp.title} at {exp.company}
                  </h3>
                  <Button 
                    onClick={() => removeItem('experience', index)} 
                    variant="destructive" 
                    size="sm"
                    className="h-8 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`exp-${index}-company`} className="text-gray-800">Company</Label>
                    <Input 
                      id={`exp-${index}-company`} 
                      value={exp.company} 
                      onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`exp-${index}-title`} className="text-gray-800">Job Title</Label>
                    <Input 
                      id={`exp-${index}-title`} 
                      value={exp.title || ''} 
                      onChange={(e) => updateArrayItem('experience', index, 'title', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor={`exp-${index}-period`} className="text-gray-800">Period</Label>
                  <Input 
                    id={`exp-${index}-period`} 
                    value={exp.period || ''} 
                    onChange={(e) => updateArrayItem('experience', index, 'period', e.target.value)}
                    placeholder="e.g., Jan 2020 - Present"
                    className="bg-white"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor={`exp-${index}-location`} className="text-gray-800">Location</Label>
                  <Input 
                    id={`exp-${index}-location`} 
                    value={exp.location} 
                    onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
                    className="bg-white"
                  />
                </div>
                
                <div className="mb-4">
                  <Label htmlFor={`exp-${index}-description`} className="text-gray-800">Description</Label>
                  <Textarea 
                    id={`exp-${index}-description`} 
                    value={exp.description} 
                    onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                    rows={3}
                    className="bg-white"
                  />
                </div>
              </div>
            ))}
            
            <Button 
              onClick={() => addNewItem('experience')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </div>
        );
        
      case 'education':
        return (
          <div id="education-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              <p className="text-sm text-gray-500">List your educational background</p>
            </div>
            
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-gray-800">{edu.degree || 'Education Entry'}</h3>
                  <Button 
                    onClick={() => removeItem('education', index)} 
                    variant="destructive" 
                    size="sm"
                    className="h-8 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`edu-${index}-institution`} className="text-gray-800">Institution</Label>
                    <Input 
                      id={`edu-${index}-institution`} 
                      value={edu.institution} 
                      onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edu-${index}-degree`} className="text-gray-800">Degree</Label>
                    <Input 
                      id={`edu-${index}-degree`} 
                      value={edu.degree} 
                      onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`edu-${index}-field`} className="text-gray-800">Field of Study</Label>
                    <Input 
                      id={`edu-${index}-field`} 
                      value={edu.field || ''} 
                      onChange={(e) => updateArrayItem('education', index, 'field', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edu-${index}-period`} className="text-gray-800">Period</Label>
                    <Input 
                      id={`edu-${index}-period`} 
                      value={edu.period || ''} 
                      onChange={(e) => updateArrayItem('education', index, 'period', e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor={`edu-${index}-additionalInfo`} className="text-gray-800">Additional Info</Label>
                  <Textarea 
                    id={`edu-${index}-additionalInfo`} 
                    value={edu.additionalInfo || ''} 
                    onChange={(e) => updateArrayItem('education', index, 'additionalInfo', e.target.value)}
                    rows={3}
                    className="bg-white"
                  />
                </div>
              </div>
            ))}
            
            <Button 
              onClick={() => addNewItem('education')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        );
        
      case 'skills':
        return (
          <div id="skills-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              <p className="text-sm text-gray-500">List your professional skills and competencies</p>
            </div>
            
            <div className="space-y-3 mb-4">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={skill} 
                    onChange={(e) => updateArrayItem('skills', index, '', e.target.value)}
                    placeholder="e.g., JavaScript, React, Project Management"
                  />
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => moveItemUp('skills', index)}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => moveItemDown('skills', index)}
                      disabled={index === resumeData.skills.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem('skills', index)}
                      className="text-destructive"
                      disabled={resumeData.skills.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => addNewItem('skills')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        );
        
      case 'certifications':
        return (
          <div id="certifications-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
              <p className="text-sm text-gray-500">List any professional certifications you have earned</p>
            </div>
            
            {resumeData.certifications.map((cert, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Certification {index + 1}</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemUp('certifications', index)}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemDown('certifications', index)}
                        disabled={index === resumeData.certifications.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem('certifications', index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`certName-${index}`}>Certification Name</Label>
                      <Input 
                        id={`certName-${index}`} 
                        value={cert.name} 
                        onChange={(e) => updateArrayItem('certifications', index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`certIssuer-${index}`}>Issuing Organization</Label>
                      <Input 
                        id={`certIssuer-${index}`} 
                        value={cert.issuer} 
                        onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`certDate-${index}`}>Date</Label>
                      <Input 
                        id={`certDate-${index}`} 
                        value={cert.date} 
                        onChange={(e) => updateArrayItem('certifications', index, 'date', e.target.value)}
                        placeholder="e.g., June 2023"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button onClick={() => addNewItem('certifications')} className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        );
        
      case 'targetJob':
        return (
          <div id="target-job-section">
            <div className="pb-2 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Target Job</h2>
              <p className="text-sm text-gray-500">Enter the job you're targeting to get tailored suggestions</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetJobTitle">Job Title</Label>
                <Input 
                  id="targetJobTitle" 
                  value={resumeData.targetJob?.title || ''} 
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    targetJob: {
                      ...resumeData.targetJob,
                      title: e.target.value
                    }
                  })}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              
              <div>
                <Label htmlFor="targetJobCompany">Company (Optional)</Label>
                <Input 
                  id="targetJobCompany" 
                  value={resumeData.targetJob?.company || ''} 
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    targetJob: {
                      ...resumeData.targetJob,
                      company: e.target.value
                    }
                  })}
                  placeholder="e.g., Tech Company"
                />
              </div>
              
              <div>
                <Label htmlFor="targetJobDescription">Job Description</Label>
                <Textarea 
                  id="targetJobDescription" 
                  value={resumeData.targetJob?.description || ''} 
                  onChange={(e) => setResumeData({
                    ...resumeData,
                    targetJob: {
                      ...resumeData.targetJob,
                      description: e.target.value
                    }
                  })}
                  placeholder="Paste the job description here..."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  The AI will use this information to provide tailored suggestions for your resume.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {renderSection()}
    </div>
  );
}
