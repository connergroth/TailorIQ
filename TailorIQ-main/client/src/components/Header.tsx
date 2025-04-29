import { Button } from "@/components/ui/button";
import { Download, Settings, FileText, Bot, Save } from "lucide-react";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

interface HeaderProps {
  onDownloadPDF: () => void;
  onAIAssistant: () => void;
  onOpenSettings: () => void;
  onSaveResume: () => void;
  isPdfLoading: boolean;
  isLlmLoading: boolean;
  isSaving?: boolean;
}

export default function Header({ 
  onDownloadPDF, 
  onAIAssistant, 
  onOpenSettings, 
  onSaveResume,
  isPdfLoading, 
  isLlmLoading,
  isSaving = false
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="text-primary font-bold text-xl">TailorIQ</div>
        <div className="hidden md:block ml-10">
          <Button variant="outline" size="sm" className="mr-2" onClick={onOpenSettings}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        {/* DarkModeToggle temporarily disabled */}
        {/* <DarkModeToggle /> */}
        <div className="ml-3">
          <Button 
            variant="ghost" 
            className="bg-primary/10 text-primary font-medium hover:bg-primary/20 mr-4"
            onClick={onAIAssistant}
            disabled={isLlmLoading}
          >
            <Bot className="h-4 w-4 mr-2" />
            {isLlmLoading ? "Processing..." : "AI Assistant"}
          </Button>
          {/* Save button commented out temporarily
          <Button 
            variant="outline" 
            className="text-green-600 font-medium border-green-200 hover:bg-green-50 mr-4"
            onClick={onSaveResume}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          */}
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
            onClick={onDownloadPDF}
            disabled={isPdfLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isPdfLoading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </header>
  );
}