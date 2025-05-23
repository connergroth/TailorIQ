import React from 'react';
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
  
  const handleFontSizeChange = (value: number[]) => {
    onSettingsChange({...settings, fontSize: value[0]});
  };
  
  const handleFontFamilyChange = (value: string) => {
    onSettingsChange({...settings, fontFamily: value});
  };
  
  const handleLineSpacingChange = (value: number[]) => {
    onSettingsChange({...settings, lineSpacing: value[0]});
  };
  
  const handleAutoAdjustChange = (value: boolean) => {
    onSettingsChange({...settings, autoAdjust: value});
  };
  
  const handleATSModeChange = (value: boolean) => {
    onSettingsChange({...settings, atsMode: value});
  };
  
  const handlePaperSizeChange = (size: string) => {
    onSettingsChange({...settings, paperSize: size});
  };
  
  const handleFileFormatChange = (format: string) => {
    onSettingsChange({...settings, fileFormat: format});
  };
  
  const handleResetDefaults = () => {
    onSettingsChange({
      fontSize: 11,
      fontFamily: "times",
      lineSpacing: 1.15,
      autoAdjust: true,
      atsMode: true,
      paperSize: "letter",
      fileFormat: "pdf"
    });
  };
  
  return (
    <div className="p-4 h-full overflow-y-auto bg-white text-gray-900">
      <Tabs defaultValue="templates" className="h-full">
        <TabsList className="mb-4 w-full bg-gray-100">
          <TabsTrigger value="templates" className="flex-1 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Templates</TabsTrigger>
          <TabsTrigger value="format" className="flex-1 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Formatting</TabsTrigger>
          <TabsTrigger value="export" className="flex-1 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Export</TabsTrigger>
        </TabsList>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="h-[calc(100%-60px)] overflow-auto">
          <ResumeTemplates 
            activeTemplate={activeTemplate}
            onTemplateChange={onTemplateChange}
          />
        </TabsContent>
        
        {/* Format Tab */}
        <TabsContent value="format">
          <Card className="p-6 bg-white text-gray-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Text Formatting</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="font-family" className="text-gray-900">Font Family</Label>
                <Select 
                  value={settings.fontFamily} 
                  onValueChange={handleFontFamilyChange}
                >
                  <SelectTrigger id="font-family" className="bg-white border-gray-200">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectLabel className="text-gray-700">Professional Fonts</SelectLabel>
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
                  <Label htmlFor="font-size" className="text-gray-900">Font Size: {settings.fontSize}pt</Label>
                  <span className="text-sm text-gray-500">10-14pt</span>
                </div>
                <Slider 
                  id="font-size"
                  min={10} 
                  max={14} 
                  step={0.5} 
                  value={[settings.fontSize]} 
                  onValueChange={handleFontSizeChange}
                  className="w-full" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="line-spacing" className="text-gray-900">Line Spacing: {settings.lineSpacing.toFixed(2)}</Label>
                  <span className="text-sm text-gray-500">1.0-1.5</span>
                </div>
                <Slider 
                  id="line-spacing"
                  min={1.0} 
                  max={1.5} 
                  step={0.05} 
                  value={[settings.lineSpacing]} 
                  onValueChange={handleLineSpacingChange}
                  className="w-full" 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-adjust" className="font-medium text-gray-900">Auto-adjust Content</Label>
                  <p className="text-sm text-gray-500">Automatically scale content to fit on one page</p>
                </div>
                <Switch 
                  id="auto-adjust" 
                  checked={settings.autoAdjust} 
                  onCheckedChange={handleAutoAdjustChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ats-mode" className="font-medium text-gray-900">ATS-Friendly Mode</Label>
                  <p className="text-sm text-gray-500">Optimize for Applicant Tracking Systems</p>
                </div>
                <Switch 
                  id="ats-mode" 
                  checked={settings.atsMode} 
                  onCheckedChange={handleATSModeChange}
                />
              </div>
              
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-indigo"
                onClick={() => {
                  onSettingsChange({...settings});
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
          <Card className="p-6 bg-white text-gray-900">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Export Options</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-900">Paper Size</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-6 bg-white ${settings.paperSize === 'letter' ? 'border-brand-purple text-brand-purple' : 'border-gray-200 text-gray-700'}`}
                    onClick={() => handlePaperSizeChange('letter')}
                    type="button"
                  >
                    Letter (8.5" × 11")
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-6 bg-white ${settings.paperSize === 'a4' ? 'border-brand-purple text-brand-purple' : 'border-gray-200 text-gray-700'}`}
                    onClick={() => handlePaperSizeChange('a4')}
                    type="button"
                  >
                    A4 (210mm × 297mm)
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-900">File Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-4 bg-white ${settings.fileFormat === 'pdf' ? 'border-brand-purple text-brand-purple' : 'border-gray-200 text-gray-700'}`}
                    onClick={() => handleFileFormatChange('pdf')}
                    type="button"
                  >
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-4 bg-white ${settings.fileFormat === 'docx' ? 'border-brand-purple text-brand-purple' : 'border-gray-200 text-gray-700'}`}
                    onClick={() => handleFileFormatChange('docx')}
                    type="button"
                    disabled={true}
                  >
                    DOCX
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center justify-center py-4 bg-white ${settings.fileFormat === 'txt' ? 'border-brand-purple text-brand-purple' : 'border-gray-200 text-gray-700'}`}
                    onClick={() => handleFileFormatChange('txt')}
                    type="button"
                    disabled={true}
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
                className="w-full bg-brand-purple hover:bg-brand-indigo"
                onClick={handleResetDefaults}
                type="button"
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