import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Bot, Check } from "lucide-react";

interface LLMSuggestion {
  section: string;
  title: string;
  original: string;
  suggestion: string;
}

interface LLMAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: LLMSuggestion[];
  onApplySuggestion: (index: number) => void;
  onApplyAll: () => void;
}

export default function LLMAssistantModal({
  isOpen,
  onClose,
  suggestions,
  onApplySuggestion,
  onApplyAll
}: LLMAssistantModalProps) {
  // Helper function to highlight differences in the suggestion
  const highlightChanges = (original: string, suggestion: string) => {
    // This is a very simple comparison - a production app would use a more sophisticated diffing algorithm
    if (!original || !suggestion) return suggestion;
    
    // Split into words and compare
    const originalWords = original.split(' ');
    const suggestionWords = suggestion.split(' ');
    
    // Mark added words in the suggestion
    const result = suggestionWords.map(word => {
      if (!originalWords.includes(word)) {
        return `<span class="bg-green-100">${word}</span>`;
      }
      return word;
    }).join(' ');
    
    return result;
  };

  if (suggestions.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              AI Assistant Suggestions
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-gray-600">No suggestions available at this time.</p>
          </div>
          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            AI Assistant Suggestions
          </DialogTitle>
          <DialogDescription>
            Review and apply AI-powered improvements to your resume
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-1 py-2">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900 mb-1">{suggestion.title}</div>
                  <p className="text-sm text-gray-700">
                    Suggested improvement:
                  </p>
                  <div className="mt-2 p-3 bg-white border border-gray-200 rounded text-sm">
                    <p className="text-gray-700">
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightChanges(suggestion.original, suggestion.suggestion) 
                      }} />
                    </p>
                  </div>
                  <div className="mt-3 flex">
                    <Button 
                      size="sm" 
                      className="bg-primary text-white" 
                      onClick={() => onApplySuggestion(index)}
                    >
                      Apply Change
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="ml-2"
                    >
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button onClick={onApplyAll}>
              <Check className="h-4 w-4 mr-2" />
              Apply All Suggestions
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
