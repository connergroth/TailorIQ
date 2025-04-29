import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Issue {
  id: string;
  type: 'warning' | 'error';
  message: string;
  section: string;
}

interface IssuesPanelProps {
  issues: Issue[];
  onResolveIssue: (id: string) => void;
  onIgnoreIssue: (id: string) => void;
}

export default function IssuesPanel({ issues, onResolveIssue, onIgnoreIssue }: IssuesPanelProps) {
  const warningCount = issues.filter(issue => issue.type === 'warning').length;
  const errorCount = issues.filter(issue => issue.type === 'error').length;
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Resume Issues</h3>
        <div className="flex mt-2 text-sm">
          <div className="flex items-center mr-4">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-600">{errorCount} Errors</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-gray-600">{warningCount} Warnings</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4">
          {issues.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Your resume looks great! No issues found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map(issue => (
                <Card key={issue.id} className="p-3 border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <AlertTriangle className={`h-5 w-5 ${issue.type === 'error' ? 'text-red-500' : 'text-amber-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">{issue.message}</p>
                        <span className="text-xs text-gray-500 ml-2">{issue.section}</span>
                      </div>
                      <div className="flex mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 mr-2"
                          onClick={() => onResolveIssue(issue.id)}
                        >
                          Fix Now
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 text-gray-500 hover:text-gray-700 hover:bg-gray-50 p-0"
                          onClick={() => onIgnoreIssue(issue.id)}
                        >
                          <Trash className="h-3.5 w-3.5 mr-1" />
                          Ignore
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 