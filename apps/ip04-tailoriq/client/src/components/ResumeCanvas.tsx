import { Resume, ResumeTemplate } from "@shared/schema";

interface ResumeCanvasProps {
  resumeData: Resume;
  template: ResumeTemplate;
  settings?: {
    fontSize: number;
    fontFamily: string;
    lineSpacing: number;
    autoAdjust: boolean;
    atsMode: boolean;
    paperSize: string;
    fileFormat: string;
  };
}

export default function ResumeCanvas({ resumeData, template, settings = {
  fontSize: 11,
  fontFamily: "times",
  lineSpacing: 1.15,
  autoAdjust: true,
  atsMode: true,
  paperSize: "letter",
  fileFormat: "pdf"
} }: ResumeCanvasProps) {
  // Function to get the font family CSS based on the selected font
  const getFontFamily = (fontFamily: string): string => {
    switch (fontFamily) {
      case 'times':
        return "'Times New Roman', Times, serif";
      case 'calibri':
        return "Calibri, 'Segoe UI', sans-serif";
      case 'arial':
        return "Arial, Helvetica, sans-serif";
      case 'garamond':
        return "Garamond, Georgia, serif";
      case 'helvetica':
        return "Helvetica, Arial, sans-serif";
      default:
        return "'Times New Roman', Times, serif";
    }
  };

  // Apply global styles based on settings
  const resumeStyles = {
    fontFamily: getFontFamily(settings.fontFamily),
    fontSize: `${settings.fontSize}pt`,
    lineHeight: settings.lineSpacing.toString(),
  };

  // A function to render different templates based on the template prop
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return renderModernTemplate();
      case "classic":
        return renderClassicTemplate();
      case "minimal":
        return renderMinimalTemplate();
      case "creative":
        return renderCreativeTemplate();
      default:
        return renderModernTemplate();
    }
  };

  // Modern template
  const renderModernTemplate = () => {
    return (
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-primary font-medium">
              {resumeData.personalInfo.title}
            </h2>
          </div>
          <div className="text-right text-sm text-gray-600">
            {resumeData.personalInfo.email && <div className="mb-1">{resumeData.personalInfo.email}</div>}
            {resumeData.personalInfo.phone && <div className="mb-1">{resumeData.personalInfo.phone}</div>}
            {resumeData.personalInfo.location && <div className="mb-1">{resumeData.personalInfo.location}</div>}
            {resumeData.personalInfo.linkedin && <div className="mb-1">{resumeData.personalInfo.linkedin}</div>}
            {resumeData.personalInfo.portfolio && <div>{resumeData.personalInfo.portfolio}</div>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-2">
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              WORK EXPERIENCE
            </h3>
            
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{exp.title}</h4>
                    <h5 className="text-sm font-medium text-primary">{exp.company}</h5>
                  </div>
                  <div className="text-xs text-gray-600">{exp.period}</div>
                </div>
                {exp.description && <p className="mt-1 text-sm text-gray-700">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700 pl-5 list-disc">
                    {exp.achievements.map((achievement, i) => (
                      achievement.trim() && (
                        <li key={i} className={i < exp.achievements.length - 1 ? "mb-1" : ""}>
                          {achievement}
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
              EDUCATION
            </h3>
            
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <h5 className="text-sm font-medium text-primary">{edu.institution}</h5>
                  </div>
                  <div className="text-xs text-gray-600">{edu.period}</div>
                </div>
                {(edu.gpa || edu.additionalInfo) && (
                  <div className="text-xs text-gray-700 mt-1">
                    {edu.gpa && `GPA: ${edu.gpa}`} 
                    {edu.gpa && edu.additionalInfo && ", "}
                    {edu.additionalInfo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills & Certifications in two columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                SKILLS
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {resumeData.skills.map((skill, index) => (
                  skill.trim() && (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-2">
                CERTIFICATIONS
              </h3>
              <ul className="text-sm text-gray-700 pl-5 list-disc">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className={index < resumeData.certifications.length - 1 ? "mb-1" : ""}>
                    {cert.name} {cert.issuer && `(${cert.issuer})`} {cert.date && `- ${cert.date}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Classic template
  const renderClassicTemplate = () => {
    return (
      <div className="p-8">
        {/* Header - centered for classic style */}
        <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 uppercase">
            {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
          </h1>
          <h2 className="text-lg text-gray-700 font-medium mt-1">
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
            {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
            {resumeData.personalInfo.phone && <div>{resumeData.personalInfo.phone}</div>}
            {resumeData.personalInfo.location && <div>{resumeData.personalInfo.location}</div>}
          </div>
          <div className="flex justify-center gap-4 mt-1 text-sm text-gray-600">
            {resumeData.personalInfo.linkedin && <div>{resumeData.personalInfo.linkedin}</div>}
            {resumeData.personalInfo.portfolio && <div>{resumeData.personalInfo.portfolio}</div>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 uppercase mb-2">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 uppercase mb-3">
              Professional Experience
            </h3>
            
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{exp.title}</h4>
                    <h5 className="text-sm italic text-gray-700">{exp.company}, {exp.location}</h5>
                  </div>
                  <div className="text-xs text-gray-600">{exp.period}</div>
                </div>
                {exp.description && <p className="mt-1 text-sm text-gray-700">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-700 pl-5 list-disc">
                    {exp.achievements.map((achievement, i) => (
                      achievement.trim() && (
                        <li key={i} className={i < exp.achievements.length - 1 ? "mb-1" : ""}>
                          {achievement}
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 uppercase mb-3">
              Education
            </h3>
            
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <h5 className="text-sm italic text-gray-700">{edu.institution}</h5>
                  </div>
                  <div className="text-xs text-gray-600">{edu.period}</div>
                </div>
                {(edu.gpa || edu.additionalInfo) && (
                  <div className="text-xs text-gray-700 mt-1">
                    {edu.gpa && `GPA: ${edu.gpa}`} 
                    {edu.gpa && edu.additionalInfo && ", "}
                    {edu.additionalInfo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills & Certifications */}
        <div className="mb-6">
          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-900 uppercase mb-2">
                Skills
              </h3>
              <p className="text-sm text-gray-700">
                {resumeData.skills
                  .filter(skill => skill.trim())
                  .join(" • ")}
              </p>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-900 uppercase mb-2">
                Certifications
              </h3>
              <ul className="text-sm text-gray-700 pl-5 list-disc">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className={index < resumeData.certifications.length - 1 ? "mb-1" : ""}>
                    {cert.name} {cert.issuer && `(${cert.issuer})`} {cert.date && `- ${cert.date}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Minimal template
  const renderMinimalTemplate = () => {
    return (
      <div className="p-8">
        {/* Header - super minimal */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
          </h1>
          <h2 className="text-md text-gray-600 mt-1">
            {resumeData.personalInfo.title}
          </h2>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {resumeData.personalInfo.email && <div>{resumeData.personalInfo.email}</div>}
            {resumeData.personalInfo.phone && <div>• {resumeData.personalInfo.phone}</div>}
            {resumeData.personalInfo.location && <div>• {resumeData.personalInfo.location}</div>}
            {resumeData.personalInfo.linkedin && <div>• {resumeData.personalInfo.linkedin}</div>}
            {resumeData.personalInfo.portfolio && <div>• {resumeData.personalInfo.portfolio}</div>}
          </div>
        </div>

        {/* Horizontal line */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Experience
            </h3>
            
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{exp.title} @ {exp.company}</h4>
                  </div>
                  <div className="text-xs text-gray-500">{exp.period}</div>
                </div>
                {exp.description && <p className="mt-1 text-xs text-gray-600">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-600 pl-4 list-disc">
                    {exp.achievements.map((achievement, i) => (
                      achievement.trim() && (
                        <li key={i} className="mb-1">
                          {achievement}
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Education
            </h3>
            
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <h5 className="text-xs text-gray-600">{edu.institution}</h5>
                  </div>
                  <div className="text-xs text-gray-500">{edu.period}</div>
                </div>
                {(edu.gpa || edu.additionalInfo) && (
                  <div className="text-xs text-gray-600 mt-1">
                    {edu.gpa && `GPA: ${edu.gpa}`} 
                    {edu.gpa && edu.additionalInfo && ", "}
                    {edu.additionalInfo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills & Certifications */}
        <div className="grid grid-cols-2 gap-4">
          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {resumeData.skills.map((skill, index) => (
                  skill.trim() && (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">
                Certifications
              </h3>
              <ul className="text-xs text-gray-600 pl-4 list-disc">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className="mb-1">
                    {cert.name} {cert.date && `(${cert.date})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Creative template
  const renderCreativeTemplate = () => {
    return (
      <div className="p-0 h-full">
        {/* Split design with sidebar */}
        <div className="flex h-full">
          {/* Left sidebar with contact info and skills */}
          <div className="w-1/3 bg-primary text-white p-6">
            <div className="mb-8 mt-6">
              <h1 className="text-2xl font-bold">
                {resumeData.personalInfo.firstName}<br/>{resumeData.personalInfo.lastName}
              </h1>
              <h2 className="text-md opacity-90 mt-2 font-medium">
                {resumeData.personalInfo.title}
              </h2>
            </div>

            {/* Contact info */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase mb-3 tracking-wider">Contact</h3>
              <div className="space-y-2 text-sm">
                {resumeData.personalInfo.email && (
                  <div className="flex items-center">
                    <span className="w-5">📧</span>
                    <span className="ml-2">{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center">
                    <span className="w-5">📱</span>
                    <span className="ml-2">{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center">
                    <span className="w-5">📍</span>
                    <span className="ml-2">{resumeData.personalInfo.location}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="flex items-center">
                    <span className="w-5">🔗</span>
                    <span className="ml-2">{resumeData.personalInfo.linkedin}</span>
                  </div>
                )}
                {resumeData.personalInfo.portfolio && (
                  <div className="flex items-center">
                    <span className="w-5">🌐</span>
                    <span className="ml-2">{resumeData.personalInfo.portfolio}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills section */}
            {resumeData.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase mb-3 tracking-wider">Skills</h3>
                <div className="space-y-2">
                  {resumeData.skills
                    .filter(skill => skill.trim())
                    .map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <span className="ml-2 text-sm">{skill}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Certifications section */}
            {resumeData.certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase mb-3 tracking-wider">Certifications</h3>
                <div className="space-y-3">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-xs opacity-80">{cert.issuer} {cert.date && `• ${cert.date}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right content area */}
          <div className="w-2/3 p-6 bg-white">
            {/* Summary */}
            {resumeData.summary && (
              <div className="mb-6">
                <h3 className="text-primary text-md font-bold uppercase mb-2 tracking-wider">
                  About Me
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-primary text-md font-bold uppercase mb-3 tracking-wider">
                  Experience
                </h3>
                
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-4 relative pl-4 border-l-2 border-primary/30">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{exp.title}</h4>
                      <div className="flex justify-between">
                        <h5 className="text-sm text-gray-600">{exp.company}</h5>
                        <div className="text-xs text-gray-500">{exp.period}</div>
                      </div>
                    </div>
                    {exp.description && <p className="mt-1 text-xs text-gray-600">{exp.description}</p>}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-600 pl-4 list-disc">
                        {exp.achievements.map((achievement, i) => (
                          achievement.trim() && (
                            <li key={i} className="mb-1">
                              {achievement}
                            </li>
                          )
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h3 className="text-primary text-md font-bold uppercase mb-3 tracking-wider">
                  Education
                </h3>
                
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-3 relative pl-4 border-l-2 border-primary/30">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1"></div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                      <div className="flex justify-between">
                        <h5 className="text-sm text-gray-600">{edu.institution}</h5>
                        <div className="text-xs text-gray-500">{edu.period}</div>
                      </div>
                    </div>
                    {(edu.gpa || edu.additionalInfo) && (
                      <div className="text-xs text-gray-600 mt-1">
                        {edu.gpa && `GPA: ${edu.gpa}`} 
                        {edu.gpa && edu.additionalInfo && ", "}
                        {edu.additionalInfo}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`resume-page ${settings.paperSize === 'letter' ? 'w-[8.5in] h-[11in]' : 'w-[210mm] h-[297mm]'} bg-white shadow-md`} 
      id="resume-preview"
      style={resumeStyles}
    >
      {renderTemplate()}
    </div>
  );
}
