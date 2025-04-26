import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume database schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  title: text("title").notNull(),
  template: text("template").notNull(),
  content: jsonb("content").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Resume template types
export type ResumeTemplate = "modern" | "classic" | "minimal" | "creative";

// Resume data interface
export interface Resume {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    period: string;
    gpa: string;
    additionalInfo: string;
  }>;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

// Zod schemas for validation
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  title: z.string().min(1, "Professional title is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  period: z.string().min(1, "Employment period is required"),
  description: z.string().optional(),
  achievements: z.array(z.string()),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  period: z.string().min(1, "Education period is required"),
  gpa: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuing organization is required"),
  date: z.string().min(1, "Date is required"),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  certifications: z.array(certificationSchema),
});

export const insertResumeSchema = createInsertSchema(resumes).pick({
  userId: true,
  title: true,
  template: true,
  content: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type ResumeDB = typeof resumes.$inferSelect;

// Define users schema from the existing schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
