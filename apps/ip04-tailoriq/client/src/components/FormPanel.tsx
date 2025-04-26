import { useState } from "react";
import { SectionType } from "@/pages/ResumeMaker";
import { Resume } from "@shared/schema";
import { 
  Input,
  Textarea,
  Button,
  Label 
} from "@/components/ui";
import { PlusCircle, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    setResumeData({
      ...resumeData,
      [section]: {
        ...resumeData[section as keyof Resume],
        [field]: value
      }
    });
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
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={resumeData.personalInfo.firstName} 
                  onChange={(e) => updateField('personalInfo', 'firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={resumeData.personalInfo.lastName} 
                  onChange={(e) => updateField('personalInfo', 'lastName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title" 
                value={resumeData.personalInfo.title} 
                onChange={(e) => updateField('personalInfo', 'title', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={resumeData.personalInfo.email} 
                onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={resumeData.personalInfo.phone} 
                onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={resumeData.personalInfo.location} 
                onChange={(e) => updateField('personalInfo', 'location', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
              <Input 
                id="linkedin" 
                value={resumeData.personalInfo.linkedin || ''} 
                onChange={(e) => updateField('personalInfo', 'linkedin', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="portfolio">Portfolio/Website (optional)</Label>
              <Input 
                id="portfolio" 
                value={resumeData.personalInfo.portfolio || ''} 
                onChange={(e) => updateField('personalInfo', 'portfolio', e.target.value)}
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
              <p className="text-sm text-gray-500">List your work history, starting with the most recent position</p>
            </div>
            
            {resumeData.experience.map((exp, index) => (
              <Card key={index} className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Position {index + 1}</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemUp('experience', index)}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemDown('experience', index)}
                        disabled={index === resumeData.experience.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem('experience', index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input 
                        id={`company-${index}`} 
                        value={exp.company} 
                        onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input 
                        id={`title-${index}`} 
                        value={exp.title} 
                        onChange={(e) => updateArrayItem('experience', index, 'title', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`location-${index}`}>Location</Label>
                        <Input 
                          id={`location-${index}`} 
                          value={exp.location} 
                          onChange={(e) => updateArrayItem('experience', index, 'location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`period-${index}`}>Period</Label>
                        <Input 
                          id={`period-${index}`} 
                          placeholder="Jan 2020 - Present" 
                          value={exp.period} 
                          onChange={(e) => updateArrayItem('experience', index, 'period', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${index}`}>Description</Label>
                      <Textarea 
                        id={`description-${index}`} 
                        value={exp.description} 
                        onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Key Achievements</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addAchievement(index)}
                          className="h-8"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-center gap-2 mb-2">
                          <Input 
                            value={achievement} 
                            onChange={(e) => updateAchievement(index, achievementIndex, e.target.value)}
                            placeholder="Describe a key achievement"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeAchievement(index, achievementIndex)}
                            className="text-destructive"
                            disabled={exp.achievements.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <p className="text-sm text-gray-500">List your educational background, starting with the most recent</p>
            </div>
            
            {resumeData.education.map((edu, index) => (
              <Card key={index} className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Education {index + 1}</h3>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemUp('education', index)}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItemDown('education', index)}
                        disabled={index === resumeData.education.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem('education', index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`institution-${index}`}>Institution</Label>
                      <Input 
                        id={`institution-${index}`} 
                        value={edu.institution} 
                        onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input 
                        id={`degree-${index}`} 
                        value={edu.degree} 
                        onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`field-${index}`}>Field of Study</Label>
                      <Input 
                        id={`field-${index}`} 
                        value={edu.field} 
                        onChange={(e) => updateArrayItem('education', index, 'field', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`period-${index}`}>Period</Label>
                        <Input 
                          id={`period-${index}`} 
                          placeholder="2015 - 2019" 
                          value={edu.period} 
                          onChange={(e) => updateArrayItem('education', index, 'period', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`gpa-${index}`}>GPA (optional)</Label>
                        <Input 
                          id={`gpa-${index}`} 
                          placeholder="3.8/4.0" 
                          value={edu.gpa} 
                          onChange={(e) => updateArrayItem('education', index, 'gpa', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`additionalInfo-${index}`}>Additional Information (optional)</Label>
                      <Input 
                        id={`additionalInfo-${index}`} 
                        placeholder="Honors, relevant coursework, etc." 
                        value={edu.additionalInfo} 
                        onChange={(e) => updateArrayItem('education', index, 'additionalInfo', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                    
                    <div className="grid grid-cols-2 gap-4">
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
                          placeholder="May 2022" 
                          value={cert.date} 
                          onChange={(e) => updateArrayItem('certifications', index, 'date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              onClick={() => addNewItem('certifications')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        );
        
      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <div className="p-6">
      {renderSection()}
    </div>
  );
}
