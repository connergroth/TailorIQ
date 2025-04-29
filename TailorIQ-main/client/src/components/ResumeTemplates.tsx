import { useState } from "react";
import { ResumeTemplate } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Button } from "@/components/ui/button";
import { Check, FileText } from "lucide-react";

interface ResumeTemplatesProps {
  activeTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

export default function ResumeTemplates({ activeTemplate, onTemplateChange }: ResumeTemplatesProps) {
  const templates: Array<{ id: ResumeTemplate; name: string; description: string }> = [
    {
      id: "modern",
      name: "Jake's Modern",
      description: "Professional and clean design with optimal spacing and typography. Great for all industries."
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional format with a centered header. Timeless and widely accepted."
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and streamlined design that maximizes content space."
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold with a colored sidebar. Ideal for design and creative roles."
    }
  ];

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="p-4 bg-white text-gray-900">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Resume Templates</h2>
        <p className="text-sm text-gray-500 mb-6">
          Choose a template that best fits your industry and personal style.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeTemplate === template.id ? 'border-brand-purple ring-1 ring-brand-purple' : 'border-gray-200'
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              <CardContent className="p-4">
                <div className="h-32 bg-gray-100 flex items-center justify-center mb-3 rounded-md relative">
                  <FileText className={`h-10 w-10 ${activeTemplate === template.id ? 'text-brand-purple' : 'text-gray-400'}`} />
                  {activeTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-brand-purple text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${activeTemplate === template.id ? 'text-brand-purple' : 'text-gray-900'}`}>
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  </div>
                  {activeTemplate === template.id ? (
                    <Button size="sm" variant="default" className="text-xs h-8 bg-brand-purple hover:bg-brand-indigo" disabled>
                      Selected
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-xs h-8 text-gray-700 border-gray-200 bg-white hover:bg-gray-50" onClick={() => onTemplateChange(template.id)}>
                      Use
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
