import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import bcrypt from "bcrypt";
import { insertUserSchema, insertFileSchema } from "@shared/schema";
import { requireAuth } from "./auth";
import multer from "multer";
import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const user = req.user as any;
      const userDir = path.join(UPLOAD_DIR, user.id);
      await fs.mkdir(userDir, { recursive: true });
      cb(null, userDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao fazer login" });
        }
        return res.json({
          id: user.id,
          username: user.username,
          storageQuota: user.storageQuota,
          storageUsed: user.storageUsed,
        });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Erro no servidor" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Credenciais inválidas" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao fazer login" });
        }
        return res.json({
          id: user.id,
          username: user.username,
          storageQuota: user.storageQuota,
          storageUsed: user.storageUsed,
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      storageQuota: user.storageQuota,
      storageUsed: user.storageUsed,
    });
  });

  // File routes
  app.get("/api/files", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const userFiles = await storage.getFilesByUserId(user.id);
      // Remove sensitive path information from response
      const sanitizedFiles = userFiles.map(({ path, ...file }) => file);
      res.json(sanitizedFiles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/files/upload", requireAuth, upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const user = req.user as any;
      const fileSize = req.file.size;
      
      const currentUser = await storage.getUser(user.id);
      if (!currentUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      if (currentUser.storageUsed + fileSize > currentUser.storageQuota) {
        await fs.unlink(req.file.path);
        return res.status(400).json({ error: "Quota de armazenamento excedida" });
      }

      const file = await storage.createFile({
        userId: user.id,
        name: req.file.originalname,
        size: fileSize,
        mimeType: req.file.mimetype,
        path: req.file.path,
      });

      await storage.updateUserStorage(user.id, currentUser.storageUsed + fileSize);

      // Remove sensitive path information from response
      const { path, ...sanitizedFile } = file;
      res.json(sanitizedFile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/files/:id/download", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const file = await storage.getFile(req.params.id);

      if (!file) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      if (file.userId !== user.id) {
        return res.status(403).json({ error: "Não autorizado" });
      }

      res.download(file.path, file.name);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/files/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      const file = await storage.getFile(req.params.id);

      if (!file) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      if (file.userId !== user.id) {
        return res.status(403).json({ error: "Não autorizado" });
      }

      await fs.unlink(file.path);
      await storage.deleteFile(file.id);

      const currentUser = await storage.getUser(user.id);
      if (currentUser) {
        await storage.updateUserStorage(user.id, currentUser.storageUsed - file.size);
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
