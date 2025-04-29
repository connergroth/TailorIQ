import { Resume } from "@shared/schema";
import OpenAI from "openai";

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

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

// Initialize OpenAI client with proper error handling and fallback
let openai: OpenAI;
try {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    console.warn("WARNING: OPENAI_API_KEY is not set. Using mock API responses.");
    openai = createMockOpenAI();
  } else {
    openai = new OpenAI({
      apiKey: apiKey,
    });
    console.log("OpenAI API initialized successfully");
  }
} catch (error) {
  console.error("Error initializing OpenAI client:", error);
  openai = createMockOpenAI();
}

// Helper to create a mock OpenAI instance
function createMockOpenAI() {
  const mockOpenAI = {
    chat: {
      completions: {
        create: async () => {
          return {
            id: 'mock-completion',
            object: 'chat.completion',
            created: Date.now(),
            model: 'gpt-3.5-turbo',
            choices: [
              {
                message: {
                  role: 'assistant',
                  content: JSON.stringify({
                    message: "I'm reviewing your resume. While I can't access the OpenAI API right now, I can still provide some general advice. Try quantifying your achievements with numbers, using action verbs, and tailoring your resume to the specific job you're applying for.",
                    suggestedActions: [
                      {
                        actionType: 'update_resume',
                        targetSection: 'summary',
                        originalContent: '',
                        suggestedContent: 'Results-driven professional with proven experience in delivering high-quality solutions. Skilled in problem-solving and collaboration with cross-functional teams to exceed objectives.',
                        explanation: 'A more impactful summary focuses on your strengths and value proposition.'
                      }
                    ]
                  })
                },
                index: 0,
                finish_reason: 'stop'
              }
            ],
            usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0
            }
          };
        }
      }
    }
  };
  
  return mockOpenAI as unknown as OpenAI;
}

// Function to generate resume review suggestions
export async function generateResumeReview(resumeData: Resume) {
  try {
    const system_prompt = `
      You are an expert resume writer and career advisor. Your task is to review the resume provided and give specific, actionable suggestions for improvement.
      
      Focus on:
      1. Making the content more impactful and achievement-oriented
      2. Fixing any formatting or structural issues
      3. Adjusting language to be more professional and engaging
      4. Ensuring the resume highlights the person's strengths effectively
      
      For each suggestion, identify:
      - The specific section to improve (e.g., "summary", "experience[0].achievements[1]")
      - A clear explanation of what should be improved and why
      - A concrete rewritten version showing the improvement
    `;
    
    const user_prompt = `
      Please review this resume and provide 2-4 high-impact improvement suggestions:
      
      ${JSON.stringify(resumeData, null, 2)}
      
      Return your suggestions in JSON format with an array of suggestions, each containing:
      - section: The path to the section (e.g., "summary", "experience[0].achievements[1]")
      - title: A brief title for the suggestion
      - original: The original content
      - suggestion: Your improved version
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt }
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
    
    // Return fallback suggestions
    return [
      {
        section: "summary",
        title: "Enhance Your Professional Summary",
        original: resumeData.summary,
        suggestion: "Results-driven professional with demonstrated expertise in developing innovative solutions and delivering exceptional outcomes. Skilled in collaborating with cross-functional teams to identify opportunities, overcome challenges, and exceed objectives in fast-paced environments."
      },
      {
        section: "experience[0].achievements[0]",
        title: "Quantify Your Achievements",
        original: resumeData.experience[0]?.achievements[0] || "",
        suggestion: resumeData.experience[0]?.achievements[0] ? 
          `Increased team productivity by 35% through implementation of streamlined processes and effective resource allocation, resulting in early project delivery and cost savings.` : 
          "Increased team productivity by 35% through implementation of streamlined processes and effective resource allocation, resulting in early project delivery and cost savings."
      }
    ];
  }
}

// Function to improve specific text sections
export async function generateTextImprovement(section: string, text: string, context?: string) {
  try {
    const system_prompt = `
      You are an expert resume writer specializing in crafting impactful, achievement-oriented content.
      Your job is to improve resume sections to make them more compelling and effective.
      Focus on:
      - Using strong action verbs
      - Quantifying achievements with metrics where possible
      - Highlighting skills and competencies relevant to the section
      - Maintaining professional language and concise wording
      - Ensuring the content is ATS-friendly
    `;
    
    const user_prompt = `
      Please improve this ${section} text to make it more impactful and professional:
      
      "${text}"
      
      ${context ? `Context: ${context}` : ''}
      
      I need a more compelling version that will stand out to recruiters and hiring managers.
      
      Return your response in JSON format with these fields:
      - original: the original text
      - improved: your improved version 
      - explanation: brief explanation of the improvements made
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: user_prompt }
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
    
    // Provide a fallback improvement
    return {
      original: text,
      improved: text.includes("led") ? 
        text.replace("led", "spearheaded") : 
        `Spearheaded ${text.toLowerCase()}`,
      explanation: "Enhanced the impact by using stronger action verbs and more concise phrasing."
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
    // System prompt with detailed instructions for the AI
    const system_prompt = `
      You are Tali, an expert AI resume assistant with a friendly, professional personality.
      
      Your primary goals:
      1. Provide specific, actionable advice to improve the user's resume
      2. Suggest concrete improvements to resume sections when asked
      3. Answer questions about resume best practices and job search strategies
      4. Be encouraging and supportive while maintaining honesty about improvements needed
      
      Important guidelines:
      - Keep responses concise (3-4 sentences) unless providing specific content improvements
      - Be specific and explain WHY each suggestion helps (e.g., "Adding metrics makes achievements more credible")
      - When suggesting improvements, maintain the user's voice and professional tone
      - Prioritize content suggestions that are achievement-oriented and quantifiable
      - For technical roles, emphasize skills and measurable impact
      
      ${instruction || ''}
      
      Current resume data: ${JSON.stringify(resumeData, null, 2)}
      
      RESPONSE FORMAT:
      You MUST return a valid JSON object with EXACTLY this structure:
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
      
      IMPORTANT:
      - The "message" field is REQUIRED and must be a string
      - The "suggestedActions" field is OPTIONAL
      - If "suggestedActions" is present, each action MUST have an "actionType" field
      - Do not include any fields not specified in this structure
      - Do not include any explanatory text outside the JSON structure
    `;

    // Convert client messages to the format expected by OpenAI
    const messages: ChatMessage[] = [
      { role: 'system', content: system_prompt },
      ...clientMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      console.error("Empty response content from OpenAI");
      throw new Error("Empty response from OpenAI");
    }

    console.log("Raw AI response:", content);

    try {
      const parsedResponse = JSON.parse(content) as { response: ChatResponse } | ChatResponse;
      
      // Handle both wrapped and unwrapped responses
      const finalResponse = 'response' in parsedResponse ? parsedResponse.response : parsedResponse;
      
      // Validate the response structure
      if (!finalResponse.message) {
        console.error("Invalid response format - missing message field:", finalResponse);
        throw new Error("Invalid response format: missing message field");
      }

      // Validate suggestedActions if present
      if (finalResponse.suggestedActions) {
        for (const action of finalResponse.suggestedActions) {
          if (!action.actionType) {
            console.error("Invalid suggestedAction - missing actionType:", action);
            throw new Error("Invalid suggestedAction: missing actionType");
          }
        }
      }
      
      console.log("Successfully parsed and validated response:", finalResponse);
      return finalResponse;
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw content that failed to parse:", content);
      throw new Error("Invalid response from AI chat service");
    }
  } catch (error) {
    console.error("Error processing chat message:", error);
    
    // Create a helpful fallback response
    return {
      message: "I noticed that your resume could benefit from more achievement-oriented language. Try to quantify your accomplishments with specific metrics and use strong action verbs to highlight your contributions.",
      suggestedActions: [
        {
          actionType: "general_advice",
          explanation: "Achievement-oriented language helps recruiters understand your specific contributions and value."
        }
      ]
    };
  }
}