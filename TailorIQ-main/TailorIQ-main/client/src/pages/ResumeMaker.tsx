import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FormPanel from "@/components/FormPanel";
import ResumeCanvas from "@/components/ResumeCanvas";
import LLMAssistantModal from "@/components/LLMAssistantModal";
import AIAssistantChat from "@/components/AIAssistantChat";
import SettingsPanel from "@/components/SettingsPanel";
import useResumeData from "@/hooks/useResumeData";
import { ResumeTemplate } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export type SectionType = 
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications";

export default function ResumeMaker() {
  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [llmSuggestions, setLlmSuggestions] = useState<{
    section: string;
    title: string;
    original: string;
    suggestion: string;
  }[]>([]);
  
  const [settings, setSettings] = useState({
    fontSize: 11,
    fontFamily: "times",
    lineSpacing: 1.15,
    autoAdjust: true,
    atsMode: true,
    paperSize: "letter", // letter or a4
    fileFormat: "pdf"
  });

  const { toast } = useToast();
  const { resumeData, setResumeData, activeTemplate, setActiveTemplate } = useResumeData();

  const generatePdfMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/resume/generate-pdf", { 
        resumeData, 
        template: activeTemplate,
        settings
      });
      return response.blob();
    },
    onSuccess: (blob) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a link element
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${new Date().toISOString().split('T')[0]}.pdf`;
      // Append the link to the body
      document.body.appendChild(a);
      // Click the link
      a.click();
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Generated Successfully",
        description: "Your resume has been downloaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Generating PDF",
        description: "An error occurred while generating your PDF.",
        variant: "destructive",
      });
      console.error("PDF generation error:", error);
    }
  });

  const llmReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/resume/llm-review", { resumeData });
      const data = await response.json();
      return data.suggestions;
    },
    onSuccess: (suggestions) => {
      setLlmSuggestions(suggestions);
      setIsLLMModalOpen(true);
    },
    onError: (error) => {
      toast({
        title: "AI Review Failed",
        description: "Unable to generate AI suggestions at this time.",
        variant: "destructive",
      });
      console.error("LLM review error:", error);
    }
  });

  const handleDownloadPDF = () => {
    generatePdfMutation.mutate();
  };

  const handleAIAssistant = () => {
    // Use the new interactive chat assistant instead of the modal
    setIsAIChatOpen(true);
    
    // Legacy modal-based assistant (disabled)
    // llmReviewMutation.mutate();
  };

  const handleApplySuggestion = (index: number) => {
    const suggestion = llmSuggestions[index];
    if (!suggestion) return;

    // Creating a deep copy of resumeData
    const updatedResumeData = JSON.parse(JSON.stringify(resumeData));

    // Update the correct section based on the suggestion
    if (suggestion.section === "summary") {
      updatedResumeData.summary = suggestion.suggestion;
    } else if (suggestion.section.startsWith("experience")) {
      // Parse the experience index from the section string (e.g., "experience[0]")
      const matches = suggestion.section.match(/experience\[(\d+)\]\.(.+)/);
      if (matches && matches.length >= 3) {
        const expIndex = parseInt(matches[1]);
        const field = matches[2];
        
        if (updatedResumeData.experience[expIndex]) {
          updatedResumeData.experience[expIndex][field] = suggestion.suggestion;
        }
      }
    } // Add other section handlers as needed

    setResumeData(updatedResumeData);
    
    // Remove the applied suggestion
    const updatedSuggestions = [...llmSuggestions];
    updatedSuggestions.splice(index, 1);
    setLlmSuggestions(updatedSuggestions);
    
    toast({
      title: "Suggestion Applied",
      description: "The resume has been updated with the AI suggestion.",
    });
  };

  const handleApplyAllSuggestions = () => {
    // Creating a deep copy of resumeData
    const updatedResumeData = JSON.parse(JSON.stringify(resumeData));

    // Apply all suggestions
    llmSuggestions.forEach(suggestion => {
      if (suggestion.section === "summary") {
        updatedResumeData.summary = suggestion.suggestion;
      } else if (suggestion.section.startsWith("experience")) {
        const matches = suggestion.section.match(/experience\[(\d+)\]\.(.+)/);
        if (matches && matches.length >= 3) {
          const expIndex = parseInt(matches[1]);
          const field = matches[2];
          
          if (updatedResumeData.experience[expIndex]) {
            updatedResumeData.experience[expIndex][field] = suggestion.suggestion;
          }
        }
      } // Add other section handlers as needed
    });

    setResumeData(updatedResumeData);
    setLlmSuggestions([]);
    setIsLLMModalOpen(false);
    
    toast({
      title: "All Suggestions Applied",
      description: "Your resume has been updated with all AI suggestions.",
    });
  };

  const toggleMobilePreview = () => {
    setIsMobilePreviewVisible(!isMobilePreviewVisible);
  };
  
  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onDownloadPDF={handleDownloadPDF} 
        onAIAssistant={handleAIAssistant}
        onOpenSettings={handleOpenSettings}
        isPdfLoading={generatePdfMutation.isPending}
        isLlmLoading={llmReviewMutation.isPending}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          activeTemplate={activeTemplate}
          onTemplateChange={setActiveTemplate}
        />
        
        {/* Form Panel */}
        <div className={`${isMobilePreviewVisible ? 'hidden' : 'block'} w-full lg:w-1/3 bg-white border-r border-gray-200 overflow-y-auto`}>
          <FormPanel
            activeSection={activeSection}
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        </div>
        
        {/* Resume Preview */}
        <div 
          className={`${isMobilePreviewVisible ? 'block' : 'hidden'} lg:flex lg:w-2/3 bg-gray-100 justify-center items-start p-8 overflow-y-auto`}
          id="resume-preview-container"
        >
          <ResumeCanvas 
            resumeData={resumeData} 
            template={activeTemplate}
            settings={settings}
          />
        </div>
        
        {/* LLM Assistant Modal */}
        <LLMAssistantModal
          isOpen={isLLMModalOpen}
          onClose={() => setIsLLMModalOpen(false)}
          suggestions={llmSuggestions}
          onApplySuggestion={handleApplySuggestion}
          onApplyAll={handleApplyAllSuggestions}
        />

        {/* AI Chat Assistant */}
        <AIAssistantChat 
          resumeData={resumeData}
          setResumeData={setResumeData}
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
        />
      </div>

      {/* AI Chat Button (Fixed Position) */}
      <Button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-20 right-6 z-40 rounded-full w-12 h-12 shadow-lg lg:flex items-center justify-center hidden"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSettingsOpen(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="overflow-y-auto h-full">
            <SettingsPanel 
              activeTemplate={activeTemplate}
              onTemplateChange={setActiveTemplate}
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <button 
          className={`flex flex-col items-center text-xs ${activeSection === 'personal' ? 'text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveSection('personal')}
        >
          <i className="ri-user-line text-lg"></i>
          <span>Personal</span>
        </button>
        <button 
          className={`flex flex-col items-center text-xs ${activeSection === 'experience' ? 'text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveSection('experience')}
        >
          <i className="ri-briefcase-line text-lg"></i>
          <span>Experience</span>
        </button>
        <button 
          className={`flex flex-col items-center text-xs ${activeSection === 'education' ? 'text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveSection('education')}
        >
          <i className="ri-graduation-cap-line text-lg"></i>
          <span>Education</span>
        </button>
        <button 
          className={`flex flex-col items-center text-xs`}
          onClick={toggleMobilePreview}
        >
          <i className="ri-eye-line text-lg"></i>
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}
