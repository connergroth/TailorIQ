import { Resume } from "@shared/schema";

// Define interfaces for the chat functionality
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  suggestedActions?: {
    actionType: 'update_resume' | 'general_advice';
    targetSection?: string;
    originalContent?: string;
    suggestedContent?: string;
    explanation?: string;
  }[];
}

/**
 * Sends a request to the server to get resume review suggestions
 */
export async function getResumeReview(resumeData: Resume) {
  try {
    const response = await fetch('/api/resume/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching resume review:", error);
    // Return a fallback suggestion if the API fails
    return [
      {
        section: "summary",
        title: "Enhance Your Professional Summary",
        original: resumeData.summary,
        suggestion: "Error connecting to the AI service. Please try again later."
      }
    ];
  }
}

/**
 * Sends a request to the server to get text improvement suggestions
 */
export async function getTextImprovement(section: string, text: string, context?: string) {
  try {
    const response = await fetch('/api/text/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, text, context })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error improving text:", error);
    return {
      original: text,
      improved: text,
      explanation: "Unable to generate improvements at this time."
    };
  }
}

/**
 * Sends a chat message to the AI assistant and gets a response
 */
export async function sendChatMessage(
  resumeData: Resume,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  instruction?: string
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, messages, instruction })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing chat message:", error);
    return {
      message: "I'm having trouble connecting to the AI service right now. Please try again later."
    };
  }
}