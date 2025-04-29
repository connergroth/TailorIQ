import { useEffect, useRef } from "react";
import { AppState } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer } from "lucide-react";
import useMobileBreakpoint from "@/hooks/useMobileBreakpoint";

interface PreviewPanelProps {
  appState: AppState;
  isSaving: boolean;
}

export default function PreviewPanel({ appState, isSaving }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useMobileBreakpoint();

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  useEffect(() => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;

    // Your iframe code rendering logic here
  }, [appState]);

  return (
    <div className="h-full bg-white text-gray-900">
      <Tabs defaultValue="preview" className="h-full flex flex-col">
        <div className="border-b">
          <div className="flex items-center justify-between px-4">
            <TabsList className="bg-gray-100">
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-white data-[state=active]:text-brand-purple data-[state=active]:shadow-none"
              >
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="code" 
                className="data-[state=active]:bg-white data-[state=active]:text-brand-purple data-[state=active]:shadow-none"
              >
                Resume JSON
              </TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-gray-700 border-gray-200 bg-white hover:bg-gray-50"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-1" />
                {!isMobile && "Print"}
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                className="bg-brand-purple hover:bg-brand-indigo"
                disabled={isSaving}
              >
                <Download className="h-4 w-4 mr-1" />
                {!isMobile && "Download PDF"}
              </Button>
            </div>
          </div>
        </div>
        
        <TabsContent value="preview" className="flex-1 p-0 m-0">
          <div className="h-full w-full bg-gray-100 p-4 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded w-full max-w-[816px] h-[1056px] overflow-hidden">
              <iframe 
                ref={iframeRef}
                title="Resume Preview" 
                className="w-full h-full"
                id="resume-preview"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 bg-gray-50">
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center mb-2 text-gray-900">
                  <FileText className="h-5 w-5 mr-2 text-brand-purple" />
                  <h3 className="font-medium">Resume JSON Data</h3>
                </div>
                <pre className="text-xs overflow-auto p-2 bg-gray-50 rounded text-gray-700 border border-gray-100">
                  {JSON.stringify(appState.resume, null, 2)}
                </pre>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
} 