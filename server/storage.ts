import { users, files, type User, type InsertUser, type File, type InsertFile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getFilesByUserId(userId: string): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: string): Promise<void>;
  updateUserStorage(userId: string, storageUsed: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const storageQuota = insertUser.username === 'tiago' 
      ? 100 * 1024 * 1024 * 1024 
      : 15 * 1024 * 1024 * 1024;
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        storageQuota,
        storageUsed: 0,
      })
      .returning();
    return user;
  }

  async getFilesByUserId(userId: string): Promise<File[]> {
    return await db.select().from(files).where(eq(files.userId, userId));
  }

  async getFile(id: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db
      .insert(files)
      .values(insertFile)
      .returning();
    return file;
  }

  async deleteFile(id: string): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  async updateUserStorage(userId: string, storageUsed: number): Promise<void> {
    await db
      .update(users)
      .set({ storageUsed })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
