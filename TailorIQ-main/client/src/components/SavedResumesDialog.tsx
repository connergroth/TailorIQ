import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogHeader
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getUserResumesFromFirebase, getResumeFromFirebase } from "@/lib/firebaseStorage";
import { Resume, ResumeTemplate } from "@shared/schema";
import { FileText, Loader2, Calendar, Clock, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SavedResumesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (resume: Resume, template: ResumeTemplate, id: string) => void;
}

export default function SavedResumesDialog({ isOpen, onClose, onLoad }: SavedResumesDialogProps) {
  const [resumes, setResumes] = useState<Array<{
    id: string;
    title: string;
    template: ResumeTemplate;
    updatedAt: Date;
  }>>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch saved resumes when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchSavedResumes();
    }
  }, [isOpen]);

  // Load saved resumes from Firebase
  const fetchSavedResumes = async () => {
    setIsLoading(true);
    try {
      const savedResumes = await getUserResumesFromFirebase();
      setResumes(savedResumes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
    } catch (error) {
      console.error("Error fetching saved resumes:", error);
      toast({
        title: "Error",
        description: "Could not load your saved resumes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific resume
  const handleLoadResume = async (resumeId: string) => {
    setLoadingResumeId(resumeId);
    try {
      const resumeData = await getResumeFromFirebase(resumeId);
      if (resumeData) {
        onLoad(resumeData.content, resumeData.template, resumeData.id);
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Could not load the selected resume.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      toast({
        title: "Error",
        description: "Failed to load the selected resume.",
        variant: "destructive"
      });
    } finally {
      setLoadingResumeId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Your Saved Resumes</DialogTitle>
          <DialogDescription>
            Select a resume to continue editing or create a new one.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>You don't have any saved resumes yet.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {resumes.map((resume) => (
              <div 
                key={resume.id} 
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{resume.title}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Template: {resume.template}
                      </span>
                      <span className="flex items-center ml-4">
                        <Clock className="h-3 w-3 mr-1" />
                        Updated {formatDistanceToNow(resume.updatedAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLoadResume(resume.id)}
                  disabled={loadingResumeId === resume.id}
                >
                  {loadingResumeId === resume.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : "Open"}
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 