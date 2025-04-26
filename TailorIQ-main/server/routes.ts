import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { generateResumeReview, generateTextImprovement, processAIChatMessage } from "./openai";
import { generatePDF } from "./pdf";
import { Resume } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.post("/api/resume/llm-review", async (req, res) => {
    try {
      const { resumeData } = req.body;
      
      if (!resumeData) {
        return res.status(400).json({ message: "Resume data is required" });
      }
      
      const suggestions = await generateResumeReview(resumeData);
      
      res.json({ suggestions });
    } catch (error) {
      console.error("Error generating LLM review:", error);
      res.status(500).json({ message: "Error generating resume review" });
    }
  });

  app.post("/api/resume/improve-text", async (req, res) => {
    try {
      const { section, text, context } = req.body;
      
      if (!section || !text) {
        return res.status(400).json({ message: "Section and text are required" });
      }
      
      const improvement = await generateTextImprovement(section, text, context);
      
      res.json({ improvement });
    } catch (error) {
      console.error("Error improving text:", error);
      res.status(500).json({ message: "Error improving text" });
    }
  });

  app.post("/api/resume/generate-pdf", async (req, res) => {
    try {
      const { resumeData, template, settings } = req.body;
      
      if (!resumeData || !template) {
        return res.status(400).json({ message: "Resume data and template are required" });
      }
      
      const pdfBuffer = await generatePDF(resumeData, template, settings);
      
      // Set the appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
      
      // Send the PDF buffer as the response
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Error generating PDF" });
    }
  });

  app.post("/api/resume/save", async (req, res) => {
    try {
      const { title, template, content } = req.body;
      
      // In a real authentication system, you would get the user ID from the session
      const userId = "anonymous";
      
      // Create resume with only the fields required by the schema
      const resume = await storage.createResume({
        userId,
        title,
        template,
        content
      });
      
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error saving resume:", error);
      res.status(500).json({ message: "Error saving resume" });
    }
  });

  app.get("/api/resume/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resume = await storage.getResume(parseInt(id));
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ message: "Error fetching resume" });
    }
  });

  app.get("/api/resume/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const resumes = await storage.getResumesByUser(userId);
      
      res.json(resumes);
    } catch (error) {
      console.error("Error fetching user resumes:", error);
      res.status(500).json({ message: "Error fetching user resumes" });
    }
  });

  // AI Chat Assistant endpoint
  app.post("/api/resume/chat-assistant", async (req, res) => {
    try {
      const { resumeData, messages, instruction } = req.body;
      
      if (!resumeData || !messages || !messages.length) {
        return res.status(400).json({ 
          message: "Resume data and chat messages are required" 
        });
      }
      
      const response = await processAIChatMessage(resumeData, messages, instruction);
      
      res.json({ response });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ 
        message: "Error processing chat message",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
