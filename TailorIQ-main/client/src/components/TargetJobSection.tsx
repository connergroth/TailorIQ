import React from 'react';
import { Resume } from '@shared/schema';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TargetJobSectionProps {
  resumeData: Resume;
  setResumeData: (data: Resume) => void;
}

export default function TargetJobSection({ resumeData, setResumeData }: TargetJobSectionProps) {
  const handleChange = (field: keyof typeof resumeData.targetJob, value: string) => {
    setResumeData({
      ...resumeData,
      targetJob: {
        ...resumeData.targetJob,
        [field]: value
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Target Job</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="targetJobTitle">Job Title</Label>
          <Input
            id="targetJobTitle"
            value={resumeData.targetJob?.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetJobCompany">Company (Optional)</Label>
          <Input
            id="targetJobCompany"
            value={resumeData.targetJob?.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="e.g., Tech Company"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetJobDescription">Job Description</Label>
          <Textarea
            id="targetJobDescription"
            value={resumeData.targetJob?.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Paste the job description here..."
            className="min-h-[200px]"
          />
        </div>
      </CardContent>
    </Card>
  );
} 