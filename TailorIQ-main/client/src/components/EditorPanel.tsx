import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Copy,
  Pencil,
  Plus,
  RotateCcw,
  SaveAll,
  Trash2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Resume } from '@shared/schema';
import FormPanel from './FormPanel';
import { Sections } from '@/lib/constants';

interface EditorPanelProps {
  resumeData: Resume;
  setResumeData: (resume: Resume) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function EditorPanel({
  resumeData,
  setResumeData,
  onSave,
  isSaving,
}: EditorPanelProps) {
  const [activeSection, setActiveSection] = useState<Sections>(Sections.BASICS);

  const handleSectionChange = (section: Sections) => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Editor</h2>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => {
              // Reset resume functionality
              if (confirm("Are you sure you want to reset your resume? This cannot be undone.")) {
                // Reset logic here
              }
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button 
            size="sm" 
            variant="default" 
            className="bg-brand-purple hover:bg-brand-indigo"
            onClick={onSave} 
            disabled={isSaving}
          >
            <SaveAll className="h-4 w-4 mr-1" />
            {isSaving ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b bg-gray-50">
          <div className="flex overflow-x-auto px-4 py-2 gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-1",
                activeSection === Sections.BASICS && "bg-white text-brand-purple font-medium"
              )}
              onClick={() => handleSectionChange(Sections.BASICS)}
            >
              Personal Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-1",
                activeSection === Sections.EXPERIENCE && "bg-white text-brand-purple font-medium"
              )}
              onClick={() => handleSectionChange(Sections.EXPERIENCE)}
            >
              Experience
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-1",
                activeSection === Sections.EDUCATION && "bg-white text-brand-purple font-medium"
              )}
              onClick={() => handleSectionChange(Sections.EDUCATION)}
            >
              Education
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-1",
                activeSection === Sections.SKILLS && "bg-white text-brand-purple font-medium"
              )}
              onClick={() => handleSectionChange(Sections.SKILLS)}
            >
              Skills
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-1",
                activeSection === Sections.PROJECTS && "bg-white text-brand-purple font-medium"
              )}
              onClick={() => handleSectionChange(Sections.PROJECTS)}
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md px-3 py-1",
                activeSection === Sections.CERTIFICATIONS && "bg-white text-brand-purple font-medium"
              )}
              onClick={() => handleSectionChange(Sections.CERTIFICATIONS)}
            >
              Certifications
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FormPanel 
            activeSection={activeSection} 
            resumeData={resumeData} 
            setResumeData={setResumeData} 
          />
        </div>
      </div>
    </div>
  );
} 