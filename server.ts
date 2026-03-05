import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("campusflow.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT,
    university TEXT,
    entity TEXT,
    field TEXT
  )
`);

// Seed demo accounts if they don't exist
const seed = db.prepare("INSERT OR IGNORE INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)");
seed.run("1", "etudiant@demo.com", "demo123", "Koffi Sènan", "student");
seed.run("2", "professeur@demo.com", "demo123", "Charlemagne Babatoundé Igué", "professor");
seed.run("3", "admin@demo.com", "demo123", "Moussa Soglo", "admin");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, fullName, role, university, entity, field } = req.body;
    try {
      const id = Math.random().toString(36).substring(2, 15);
      const stmt = db.prepare("INSERT INTO users (id, email, password, name, role, university, entity, field) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      stmt.run(
        id, 
        email, 
        password, 
        fullName, 
        role, 
        university ? JSON.stringify(university) : null, 
        entity ? JSON.stringify(entity) : null, 
        field ? JSON.stringify(field) : null
      );
      
      const user = { id, email, name: fullName, role };
      res.cookie("user", JSON.stringify(user), { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      res.json(user);
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Cet email est déjà utilisé ou les données sont invalides." });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    
    if (user) {
      const userData = { id: user.id, email: user.email, name: user.name, role: user.role };
      res.cookie("user", JSON.stringify(userData), { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });
      res.json(userData);
    } else {
      res.status(401).json({ error: "Identifiants invalides" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("user", { secure: true, sameSite: 'none' });
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const userCookie = req.cookies.user;
    if (userCookie) {
      try {
        res.json(JSON.parse(userCookie));
      } catch (e) {
        res.status(401).json({ error: "Session invalide" });
      }
    } else {
      res.status(401).json({ error: "Non connecté" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
