import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FormattingTabProps {
  settings: {
    fontFamily: string;
    fontSize: number;
    lineSpacing: number;
    autoAdjust: boolean;
    atsMode: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export default function FormattingTab({ settings, onSettingsChange }: FormattingTabProps) {
  const handleFontFamilyChange = (value: string) => {
    onSettingsChange({...settings, fontFamily: value});
  };
  
  const handleFontSizeChange = (value: number[]) => {
    onSettingsChange({...settings, fontSize: value[0]});
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
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Text Formatting</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="font-family">Font Family</Label>
          <Select 
            value={settings.fontFamily} 
            onValueChange={handleFontFamilyChange}
          >
            <SelectTrigger id="font-family" className="bg-white border-gray-200">
              <SelectValue placeholder="Times New Roman" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
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
            onValueChange={handleFontSizeChange}
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
            onValueChange={handleLineSpacingChange}
            className="w-full" 
          />
        </div>
        
        <hr className="my-4" />
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-adjust" className="font-medium">Auto-adjust Content</Label>
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
            <Label htmlFor="ats-mode" className="font-medium">ATS-Friendly Mode</Label>
            <p className="text-sm text-gray-500">Optimize for Applicant Tracking Systems</p>
          </div>
          <Switch 
            id="ats-mode" 
            checked={settings.atsMode} 
            onCheckedChange={handleATSModeChange}
          />
        </div>
        
        <Button 
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
          onClick={() => onSettingsChange({...settings})}
        >
          Apply Formatting Settings
        </Button>
      </div>
    </div>
  );
} 