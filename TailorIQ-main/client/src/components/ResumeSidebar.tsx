import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormattingTab from './FormattingTab';

interface ResumeSidebarProps {
  settings: {
    fontFamily: string;
    fontSize: number;
    lineSpacing: number;
    autoAdjust: boolean;
    atsMode: boolean;
  };
  onSettingsChange: (settings: any) => void;
}

export default function ResumeSidebar({ settings, onSettingsChange }: ResumeSidebarProps) {
  return (
    <div className="h-full bg-white">
      <Tabs defaultValue="formatting" className="h-full">
        <TabsList className="w-full grid grid-cols-3 bg-gray-100">
          <TabsTrigger value="templates" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">
            Templates
          </TabsTrigger>
          <TabsTrigger value="formatting" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">
            Formatting
          </TabsTrigger>
          <TabsTrigger value="export" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">
            Export
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="h-[calc(100%-48px)] overflow-y-auto p-4">
          <div className="text-gray-500">Template selection content goes here</div>
        </TabsContent>
        
        <TabsContent value="formatting" className="h-[calc(100%-48px)] overflow-y-auto p-4">
          <FormattingTab 
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </TabsContent>
        
        <TabsContent value="export" className="h-[calc(100%-48px)] overflow-y-auto p-4">
          <div className="text-gray-500">Export options content goes here</div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 