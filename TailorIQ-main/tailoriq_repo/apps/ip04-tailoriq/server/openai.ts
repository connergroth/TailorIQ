import { Resume } from "@shared/schema";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// Define interfaces for the chat functionality
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
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
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Function to generate resume review suggestions
export async function generateResumeReview(resumeData: Resume) {
  try {
    const prompt = `
      You are an expert resume writer. Please review the following resume and provide specific improvement suggestions.
      Return exactly 2-4 suggestions that would significantly improve the impact and effectiveness of this resume.
      
      For each suggestion:
      1. Identify a specific section that can be improved
      2. Provide a clear rationale for why it should be improved
      3. Provide a concrete, rewritten version that shows the improvement
      
      Your response should be in JSON format with an array of suggestions, each containing:
      - section: The path to the section (e.g., "summary", "experience[0].achievements[1]")
      - title: A brief title for the suggestion
      - original: The original content
      - suggestion: Your improved version
      
      Resume data:
      ${JSON.stringify(resumeData, null, 2)}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume reviewer providing actionable suggestions to improve resume content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the JSON response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const suggestions = JSON.parse(content).suggestions || [];
    return suggestions;
  } catch (error) {
    console.error("Error generating resume review:", error);
    // Return a fallback suggestion if the API fails
    return [
      {
        section: "summary",
        title: "Enhance Your Professional Summary",
        original: resumeData.summary,
        suggestion: "Results-driven Software Engineer with 8+ years of experience designing and developing user-centered applications that deliver exceptional user experiences. Proven track record of reducing system complexity, improving performance, and implementing scalable solutions in fast-paced environments. Expert in full-stack development, database design, and cloud architecture."
      }
    ];
  }
}

// Function to generate improvement suggestions for specific text
export async function generateTextImprovement(section: string, text: string, context?: string) {
  try {
    const prompt = `
      As an expert resume writer, please improve the following ${section} text to make it more impactful and professional.
      
      Original text: "${text}"
      
      ${context ? `Context: ${context}` : ''}
      
      Provide a more compelling and achievement-focused version that will stand out to recruiters and hiring managers.
      Focus on quantifiable achievements, action verbs, and specific skills when relevant.
      
      Return your response in JSON format with:
      - original: the original text
      - improved: your improved version 
      - explanation: brief explanation of the improvements made
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer focused on making resume content more impactful and professional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating text improvement:", error);
    return {
      original: text,
      improved: text,
      explanation: "Unable to generate improvements at this time."
    };
  }
}

// Function to process chat messages from the AI assistant
export async function processAIChatMessage(
  resumeData: Resume,
  clientMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
  instruction?: string
): Promise<ChatResponse> {
  try {
    // Convert client messages to the format expected by OpenAI
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are ResumeAI, an expert resume assistant helping users improve their resume.
        
        Your goals:
        1. Provide helpful, specific advice to improve the user's resume
        2. When the user asks for improvements to specific sections, provide concrete suggestions
        3. Be friendly, professional, and encouraging
        
        Important instructions:
        - Keep your responses concise and focused (max 3-4 sentences unless a specific improvement is requested)
        - When suggesting improvements, be specific and explain why the change helps
        - Format any resume content suggestions to match the style of the existing resume
        
        ${instruction || ''}
        
        Current resume data: ${JSON.stringify(resumeData, null, 2)}
        
        RESPONSE FORMAT:
        You must return a JSON object with the following structure:
        {
          "message": "Your natural language response to the user",
          "suggestedActions": [
            {
              "actionType": "update_resume" or "general_advice",
              "targetSection": "path to the section (e.g. summary, experience[0].description)",
              "originalContent": "the original content",
              "suggestedContent": "your suggested improved content",
              "explanation": "brief explanation of why this change helps"
            }
          ]
        }
        
        Only include suggestedActions when you have specific content changes to recommend.`
      },
      ...clientMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(content) as ChatResponse;
  } catch (error) {
    console.error("Error processing chat message:", error);
    return {
      message: "I'm having trouble processing your request. Please try again with a more specific question about your resume."
    };
  }
}
