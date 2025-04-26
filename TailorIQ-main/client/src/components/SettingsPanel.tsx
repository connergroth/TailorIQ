import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeTemplate } from "@shared/schema";
import ResumeTemplates from "./ResumeTemplates";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";

interface SettingsPanelProps {
  activeTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
  settings: {
    fontSize: number;
    fontFamily: string;
    lineSpacing: number;
    autoAdjust: boolean;
    atsMode: boolean;
    paperSize: string;
    fileFormat: string;
  };
  onSettingsChange: (settings: any) => void;
}

export default function SettingsPanel({ 
  activeTemplate, 
  onTemplateChange,
  settings,
  onSettingsChange
}: SettingsPanelProps) {
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <Tabs defaultValue="templates">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
          <TabsTrigger value="format" className="flex-1">Formatting</TabsTrigger>
          <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
        </TabsList>
        
        {/* Templates Tab */}
        <TabsContent value="templates">
          <ResumeTemplates 
            activeTemplate={activeTemplate}
            onTemplateChange={onTemplateChange}
          />
        </TabsContent>
        
        {/* Format Tab */}
        <TabsContent value="format">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Text Formatting</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="font-family">Font Family</Label>
                <Select 
                  value={settings.fontFamily} 
                  onValueChange={(value) => onSettingsChange({...settings, fontFamily: value})}
                >
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Professional Fonts</SelectLabel>
                      <SelectItem value="times">Times New Roman</SelectItem>
                      <SelectItem value="calibri">Calibri</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="garamond">Garamond</SelectItem>
                      <SelectItem value="helvetica">Helvetica</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="font-size">Font Size: {settings.fontSize}pt</Label>
                  <span className="text-sm text-gray-500">10-14pt</span>
                </div>
                <Slider 
                  id="font-size"
                  min={10} 
                  max={14} 
                  step={0.5} 
                  value={[settings.fontSize]} 
                  onValueChange={(value) => onSettingsChange({...settings, fontSize: value[0]})}
                  className="w-full" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="line-spacing">Line Spacing: {settings.lineSpacing.toFixed(2)}</Label>
                  <span className="text-sm text-gray-500">1.0-1.5</span>
                </div>
                <Slider 
                  id="line-spacing"
                  min={1.0} 
                  max={1.5} 
                  step={0.05} 
                  value={[settings.lineSpacing]} 
                  onValueChange={(value) => onSettingsChange({...settings, lineSpacing: value[0]})}
                  className="w-full" 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-adjust" className="font-medium">Auto-adjust Content</Label>
                  <p className="text-sm text-gray-500">Automatically scale content to fit on one page</p>
                </div>
                <Switch 
                  id="auto-adjust" 
                  checked={settings.autoAdjust} 
                  onCheckedChange={(value) => onSettingsChange({...settings, autoAdjust: value})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ats-mode" className="font-medium">ATS-Friendly Mode</Label>
                  <p className="text-sm text-gray-500">Optimize for Applicant Tracking Systems</p>
                </div>
                <Switch 
                  id="ats-mode" 
                  checked={settings.atsMode} 
                  onCheckedChange={(value) => onSettingsChange({...settings, atsMode: value})}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  // Save functionality could be added in the future
                  // For now, settings are saved automatically via onChange
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                Apply Formatting Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Export Tab */}
        <TabsContent value="export">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Export Options</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Paper Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-6 ${settings.paperSize === 'letter' ? 'border-primary' : ''}`}
                    onClick={() => onSettingsChange({...settings, paperSize: 'letter'})}
                  >
                    Letter (8.5" × 11")
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-6 ${settings.paperSize === 'a4' ? 'border-primary' : ''}`}
                    onClick={() => onSettingsChange({...settings, paperSize: 'a4'})}
                  >
                    A4 (210mm × 297mm)
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>File Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-4 ${settings.fileFormat === 'pdf' ? 'border-primary' : ''}`}
                    onClick={() => onSettingsChange({...settings, fileFormat: 'pdf'})}
                  >
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-4 ${settings.fileFormat === 'docx' ? 'border-primary' : ''}`}
                    onClick={() => onSettingsChange({...settings, fileFormat: 'docx'})}
                  >
                    DOCX
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-4 ${settings.fileFormat === 'txt' ? 'border-primary' : ''}`}
                    onClick={() => onSettingsChange({...settings, fileFormat: 'txt'})}
                  >
                    TXT
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-links" className="font-medium">Include Hyperlinks</Label>
                  <p className="text-sm text-gray-500">Keep clickable links in PDF</p>
                </div>
                <Switch id="include-links" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-res" className="font-medium">High Resolution</Label>
                  <p className="text-sm text-gray-500">Export in 300 DPI quality</p>
                </div>
                <Switch id="high-res" defaultChecked />
              </div>
              
              <Button 
                className="w-full"
                onClick={() => onSettingsChange({
                  fontSize: 11,
                  fontFamily: "times",
                  lineSpacing: 1.15,
                  autoAdjust: true,
                  atsMode: true,
                  paperSize: "letter",
                  fileFormat: "pdf"
                })}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restore Default Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}