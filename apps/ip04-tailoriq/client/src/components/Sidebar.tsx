import { ResumeTemplate } from "@shared/schema";
import { SectionType } from "@/pages/ResumeMaker";
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Award 
} from "lucide-react";

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  activeTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  activeTemplate, 
  onTemplateChange 
}: SidebarProps) {
  const sections: {id: SectionType, label: string, icon: React.ReactNode}[] = [
    { id: "personal", label: "Personal Information", icon: <User className="text-lg md:mr-3" /> },
    { id: "summary", label: "Professional Summary", icon: <FileText className="text-lg md:mr-3" /> },
    { id: "experience", label: "Work Experience", icon: <Briefcase className="text-lg md:mr-3" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="text-lg md:mr-3" /> },
    { id: "skills", label: "Skills", icon: <Wrench className="text-lg md:mr-3" /> },
    { id: "certifications", label: "Certifications", icon: <Award className="text-lg md:mr-3" /> }
  ];

  return (
    <div className="w-20 md:w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto hidden md:block">
      <div className="py-6">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 mb-3 hidden md:block">
          Resume Sections
        </div>
        <nav>
          {sections.map((section) => (
            <a 
              key={section.id}
              href={`#${section.id}`} 
              className={`sidebar-item flex items-center py-3 px-6 text-sm font-medium 
                ${activeSection === section.id 
                  ? 'active bg-blue-50 border-l-3 border-primary text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              onClick={(e) => {
                e.preventDefault();
                onSectionChange(section.id);
              }}
            >
              {section.icon}
              <span className="hidden md:inline">{section.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-8 px-6 hidden md:block">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Templates
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div 
              className={`border ${activeTemplate === "modern" 
                ? "border-primary" 
                : "border-gray-200 hover:border-gray-400"} 
                rounded p-1 cursor-pointer`}
              onClick={() => onTemplateChange("modern")}
            >
              <div className="h-20 bg-gray-100 flex items-center justify-center">
                <FileText className={`h-6 w-6 ${activeTemplate === "modern" ? "text-primary" : "text-gray-400"}`} />
              </div>
              <div className={`text-xs text-center mt-1 ${activeTemplate === "modern" ? "font-medium" : ""}`}>Modern</div>
            </div>
            <div 
              className={`border ${activeTemplate === "classic" 
                ? "border-primary" 
                : "border-gray-200 hover:border-gray-400"} 
                rounded p-1 cursor-pointer`}
              onClick={() => onTemplateChange("classic")}
            >
              <div className="h-20 bg-gray-100 flex items-center justify-center">
                <FileText className={`h-6 w-6 ${activeTemplate === "classic" ? "text-primary" : "text-gray-400"}`} />
              </div>
              <div className={`text-xs text-center mt-1 ${activeTemplate === "classic" ? "font-medium" : ""}`}>Classic</div>
            </div>
            <div 
              className={`border ${activeTemplate === "minimal" 
                ? "border-primary" 
                : "border-gray-200 hover:border-gray-400"} 
                rounded p-1 cursor-pointer`}
              onClick={() => onTemplateChange("minimal")}
            >
              <div className="h-20 bg-gray-100 flex items-center justify-center">
                <FileText className={`h-6 w-6 ${activeTemplate === "minimal" ? "text-primary" : "text-gray-400"}`} />
              </div>
              <div className={`text-xs text-center mt-1 ${activeTemplate === "minimal" ? "font-medium" : ""}`}>Minimal</div>
            </div>
            <div 
              className={`border ${activeTemplate === "creative" 
                ? "border-primary" 
                : "border-gray-200 hover:border-gray-400"} 
                rounded p-1 cursor-pointer`}
              onClick={() => onTemplateChange("creative")}
            >
              <div className="h-20 bg-gray-100 flex items-center justify-center">
                <FileText className={`h-6 w-6 ${activeTemplate === "creative" ? "text-primary" : "text-gray-400"}`} />
              </div>
              <div className={`text-xs text-center mt-1 ${activeTemplate === "creative" ? "font-medium" : ""}`}>Creative</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
