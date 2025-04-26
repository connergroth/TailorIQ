import { resumes, type ResumeDB, insertResumeSchema, type Resume } from "@shared/schema";
import { users, type User, type InsertUser } from "@shared/schema";
import { z } from "zod";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume methods
  getResume(id: number): Promise<ResumeDB | undefined>;
  getResumesByUser(userId: string): Promise<ResumeDB[]>;
  createResume(resume: z.infer<typeof insertResumeSchema>): Promise<ResumeDB>;
  updateResume(id: number, resume: Partial<z.infer<typeof insertResumeSchema>>): Promise<ResumeDB | undefined>;
  deleteResume(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumesMap: Map<number, ResumeDB>;
  private userIdToResumes: Map<string, number[]>;
  private userCurrentId: number;
  private resumeCurrentId: number;

  constructor() {
    this.users = new Map();
    this.resumesMap = new Map();
    this.userIdToResumes = new Map();
    this.userCurrentId = 1;
    this.resumeCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume methods
  async getResume(id: number): Promise<ResumeDB | undefined> {
    return this.resumesMap.get(id);
  }

  async getResumesByUser(userId: string): Promise<ResumeDB[]> {
    const resumeIds = this.userIdToResumes.get(userId) || [];
    return resumeIds
      .map(id => this.resumesMap.get(id))
      .filter((resume): resume is ResumeDB => resume !== undefined);
  }

  async createResume(insertResume: z.infer<typeof insertResumeSchema>): Promise<ResumeDB> {
    // Validate the resume data
    const validatedResume = insertResumeSchema.parse(insertResume);
    
    const id = this.resumeCurrentId++;
    const resume: ResumeDB = { ...validatedResume, id };
    
    this.resumesMap.set(id, resume);
    
    // Update user-to-resumes mapping
    const userResumes = this.userIdToResumes.get(resume.userId) || [];
    userResumes.push(id);
    this.userIdToResumes.set(resume.userId, userResumes);
    
    return resume;
  }

  async updateResume(id: number, resumeUpdates: Partial<z.infer<typeof insertResumeSchema>>): Promise<ResumeDB | undefined> {
    const existingResume = this.resumesMap.get(id);
    
    if (!existingResume) {
      return undefined;
    }
    
    const updatedResume: ResumeDB = {
      ...existingResume,
      ...resumeUpdates,
      updatedAt: new Date().toISOString()
    };
    
    this.resumesMap.set(id, updatedResume);
    
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    const resume = this.resumesMap.get(id);
    
    if (!resume) {
      return false;
    }
    
    this.resumesMap.delete(id);
    
    // Update user-to-resumes mapping
    const userResumes = this.userIdToResumes.get(resume.userId) || [];
    const updatedUserResumes = userResumes.filter(resumeId => resumeId !== id);
    this.userIdToResumes.set(resume.userId, updatedUserResumes);
    
    return true;
  }
}

export const storage = new MemStorage();
