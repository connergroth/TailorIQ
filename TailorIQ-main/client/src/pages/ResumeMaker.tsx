// client/src/pages/ResumeMaker.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FormPanel from "@/components/FormPanel";
import ResumeCanvas from "@/components/ResumeCanvas";
import LLMAssistantModal from "@/components/LLMAssistantModal";
import AIAssistantChat from "@/components/AIAssistantChat";
import SettingsPanel from "@/components/SettingsPanel";
import SavedResumesDialog from "@/components/SavedResumesDialog";
import useResumeData from "@/hooks/useResumeData";
import { Resume, ResumeTemplate } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MessageCircle, Save, FolderOpen } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { saveResumeToFirebase } from "@/lib/firebaseStorage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type SectionType = 
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "targetJob";

export default function ResumeMaker() {
  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [isMobilePreviewVisible, setIsMobilePreviewVisible] = useState(false);
  const [isLLMModalOpen, setIsLLMModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSavedResumesOpen, setIsSavedResumesOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [llmSuggestions, setLlmSuggestions] = useState<{
    section: string;
    title: string;
    original: string;
    suggestion: string;
  }[]>([]);
  
  // Initialize settings with default values
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

  // Load saved settings from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('resumeSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('resumeSettings', JSON.stringify(settings));
  }, [settings]);

  // PDF generation mutation with improved error handling
  const generatePdfMutation = useMutation({
    mutationFn: async () => {
      try {
        // Enhanced logging for debugging
        console.log("Starting PDF generation with data:", {
          template: activeTemplate,
          settings: settings
        });
        
        const response = await apiRequest("POST", "/api/resume/generate-pdf", { 
          resumeData, 
          template: activeTemplate,
          settings
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`PDF generation failed: ${response.status} ${errorText}`);
        }
        
        return response.blob();
      } catch (error) {
        console.error("Error during PDF generation request:", error);
        throw error;
      }
    },
    onSuccess: (blob) => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData.personalInfo.firstName}-${resumeData.personalInfo.lastName}-Resume-${activeTemplate}.pdf`;
      
      // Append the link to the body
      document.body.appendChild(a);
      
      // Click the link
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Generated Successfully",
        description: `Your resume has been downloaded using the ${activeTemplate} template.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Generating PDF",
        description: "An error occurred while generating your PDF. Please try again.",
        variant: "destructive",
      });
      console.error("PDF generation error:", error);
    }
  });

  const llmReviewMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await apiRequest("POST", "/api/resume/llm-review", { resumeData });
        return response.json();
      } catch (error) {
        console.error("Error during LLM review request:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.suggestions && data.suggestions.length > 0) {
        setLlmSuggestions(data.suggestions);
        setIsLLMModalOpen(true);
      } else {
        toast({
          title: "No Suggestions",
          description: "Our AI didn't find any improvements to suggest. Your resume looks great!",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "AI Review Failed",
        description: "Unable to generate AI suggestions at this time. Please try again later.",
        variant: "destructive",
      });
      console.error("LLM review error:", error);
    }
  });

  const handleDownloadPDF = () => {
    // Validate resume data before generating PDF
    if (!resumeData.personalInfo.firstName || !resumeData.personalInfo.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name before generating your resume.",
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Downloading PDF with template: ${activeTemplate}`);
    
    // Start PDF generation
    generatePdfMutation.mutate();
  };

  const handleAIAssistant = () => {
    // Use the new interactive chat assistant instead of the modal
    setIsAIChatOpen(true);
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
    } else if (suggestion.section.startsWith("education")) {
      const matches = suggestion.section.match(/education\[(\d+)\]\.(.+)/);
      if (matches && matches.length >= 3) {
        const eduIndex = parseInt(matches[1]);
        const field = matches[2];
        
        if (updatedResumeData.education[eduIndex]) {
          updatedResumeData.education[eduIndex][field] = suggestion.suggestion;
        }
      }
    } else if (suggestion.section === "skills") {
      updatedResumeData.skills = suggestion.suggestion.split(',').map((s: string) => s.trim());
    }

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
      } else if (suggestion.section.startsWith("education")) {
        const matches = suggestion.section.match(/education\[(\d+)\]\.(.+)/);
        if (matches && matches.length >= 3) {
          const eduIndex = parseInt(matches[1]);
          const field = matches[2];
          
          if (updatedResumeData.education[eduIndex]) {
            updatedResumeData.education[eduIndex][field] = suggestion.suggestion;
          }
        }
      } else if (suggestion.section === "skills") {
        updatedResumeData.skills = suggestion.suggestion.split(',').map((s: string) => s.trim());
      }
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

  // Save resume to Firebase
  const saveResumeMutation = useMutation({
    mutationFn: async (options: { title: string, saveAs: boolean }) => {
      setIsSaving(true);
      try {
        // If saveAs is true, we want to create a new resume, otherwise update existing
        const resumeId = options.saveAs ? undefined : (currentResumeId || undefined);
        
        // Save to Firebase with fallback to localStorage
        const id = await saveResumeToFirebase(
          resumeData, 
          activeTemplate, 
          options.title,
          resumeId
        );
        
        // Update current resume ID
        if (id) {
          setCurrentResumeId(id);
          return id;
        }
        
        throw new Error("Failed to save resume");
      } catch (error) {
        console.error("Error saving resume:", error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    onSuccess: (resumeId) => {
      toast({
        title: "Resume Saved",
        description: `Your resume has been saved successfully.`,
      });
      setIsSaveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error Saving Resume",
        description: "An error occurred while saving your resume. Please try again.",
        variant: "destructive",
      });
      console.error("Save error:", error);
    }
  });

  // Handle save button click
  const handleSaveResume = () => {
    // If we have a current resume ID, save directly, otherwise open dialog
    if (currentResumeId) {
      saveResumeMutation.mutate({ title: resumeTitle, saveAs: false });
    } else {
      setIsSaveDialogOpen(true);
    }
  };

  // Handle save from dialog
  const handleSaveFromDialog = (saveAs: boolean = false) => {
    saveResumeMutation.mutate({ title: resumeTitle, saveAs });
  };

  // Open saved resumes dialog
  const handleOpenSavedResumes = () => {
    setIsSavedResumesOpen(true);
  };

  // Handle loading a saved resume
  const handleLoadResume = (resumeContent: Resume, template: ResumeTemplate, id: string) => {
    setResumeData(resumeContent);
    setActiveTemplate(template);
    setCurrentResumeId(id);
    
    // Update the resume title based on the loaded resume
    setResumeTitle(resumeContent.personalInfo?.firstName && resumeContent.personalInfo?.lastName
      ? `${resumeContent.personalInfo.firstName} ${resumeContent.personalInfo.lastName}'s Resume`
      : "My Resume");
    
    toast({
      title: "Resume Loaded",
      description: "Your saved resume has been loaded successfully."
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onDownloadPDF={handleDownloadPDF} 
        onAIAssistant={handleAIAssistant}
        onOpenSettings={handleOpenSettings}
        onSaveResume={handleSaveResume}
        isPdfLoading={generatePdfMutation.isPending}
        isLlmLoading={llmReviewMutation.isPending}
        isSaving={saveResumeMutation.isPending}
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
          {/* Title and Open button temporarily commented out
          <div className="px-6 py-3 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">
              {resumeTitle}
              {currentResumeId && <span className="text-xs text-gray-500 ml-2">(Saved)</span>}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSavedResumes}
              className="text-gray-600 hover:text-gray-900"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
          */}
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
        className="fixed bottom-6 right-6 z-40 rounded-full w-12 h-12 shadow-md bg-primary hover:bg-primary/90 text-white"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
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

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Save Resume</DialogTitle>
          <DialogDescription>
            Enter a title for your resume.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                placeholder="My Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
              disabled={saveResumeMutation.isPending}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              {currentResumeId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSaveFromDialog(true)}
                  disabled={saveResumeMutation.isPending}
                >
                  Save As New
                </Button>
              )}
              <Button
                type="button"
                onClick={() => handleSaveFromDialog(false)}
                disabled={saveResumeMutation.isPending}
              >
                {saveResumeMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Resumes Dialog - temporarily commented out
      <SavedResumesDialog
        isOpen={isSavedResumesOpen}
        onClose={() => setIsSavedResumesOpen(false)}
        onLoad={handleLoadResume}
      />
      */}

      {/* Mobile bottom navigation bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-10">
        <button 
          className={`flex flex-col items-center text-xs ${activeSection === 'targetJob' ? 'text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveSection('targetJob')}
        >
          <i className="ri-target-line text-lg"></i>
          <span>Target Job</span>
        </button>
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
          className={`flex flex-col items-center text-xs text-gray-500`}
          onClick={toggleMobilePreview}
        >
          <i className="ri-eye-line text-lg"></i>
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}