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

db.exec(`
  CREATE TABLE IF NOT EXISTS compositions (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    date TEXT,
    professor_id TEXT,
    FOREIGN KEY(professor_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS composition_registrations (
    composition_id TEXT,
    student_id TEXT,
    grade REAL,
    PRIMARY KEY (composition_id, student_id),
    FOREIGN KEY(composition_id) REFERENCES compositions(id),
    FOREIGN KEY(student_id) REFERENCES users(id)
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

  // Helper to get user from cookie
  const getAuthUser = (req: any) => {
    const userCookie = req.cookies.user;
    if (userCookie) {
      try {
        return JSON.parse(userCookie);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, fullName, role, university, entity, field } = req.body;
    try {
      // Check if user already exists
      const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
      if (existingUser) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }

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
    const user = getAuthUser(req);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Non connecté" });
    }
  });

  // Composition Routes
  app.post("/api/compositions", (req, res) => {
    const user = getAuthUser(req);
    if (!user || user.role !== "professor") {
      return res.status(403).json({ error: "Seuls les professeurs peuvent créer des compositions" });
    }

    const { title, description, date } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    try {
      const stmt = db.prepare("INSERT INTO compositions (id, title, description, date, professor_id) VALUES (?, ?, ?, ?, ?)");
      stmt.run(id, title, description, date, user.id);
      res.json({ id, title, description, date, professor_id: user.id });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de la composition" });
    }
  });

  app.get("/api/compositions", (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: "Non connecté" });

    try {
      const compositions = db.prepare(`
        SELECT c.*, u.name as professor_name, 
        (SELECT COUNT(*) FROM composition_registrations WHERE composition_id = c.id) as student_count,
        (SELECT grade FROM composition_registrations WHERE composition_id = c.id AND student_id = ?) as my_grade,
        (SELECT 1 FROM composition_registrations WHERE composition_id = c.id AND student_id = ?) as is_registered
        FROM compositions c
        JOIN users u ON c.professor_id = u.id
      `).all(user.id, user.id);
      res.json(compositions);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des compositions" });
    }
  });

  app.post("/api/compositions/:id/register", (req, res) => {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return res.status(403).json({ error: "Seuls les étudiants peuvent s'inscrire" });
    }

    const compositionId = req.params.id;
    try {
      const stmt = db.prepare("INSERT OR IGNORE INTO composition_registrations (composition_id, student_id) VALUES (?, ?)");
      stmt.run(compositionId, user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  });

  app.get("/api/compositions/:id/students", (req, res) => {
    const user = getAuthUser(req);
    if (!user || user.role !== "professor") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const compositionId = req.params.id;
    try {
      const students = db.prepare(`
        SELECT u.id, u.name, u.email, cr.grade
        FROM users u
        JOIN composition_registrations cr ON u.id = cr.student_id
        WHERE cr.composition_id = ?
      `).all(compositionId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des étudiants" });
    }
  });

  app.post("/api/compositions/:id/grade", (req, res) => {
    const user = getAuthUser(req);
    if (!user || user.role !== "professor") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    const compositionId = req.params.id;
    const { studentId, grade } = req.body;
    try {
      const stmt = db.prepare("UPDATE composition_registrations SET grade = ? WHERE composition_id = ? AND student_id = ?");
      stmt.run(grade, compositionId, studentId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la notation" });
    }
  });

  app.get("/api/my-grades", (req, res) => {
    const user = getAuthUser(req);
    if (!user || user.role !== "student") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    try {
      const grades = db.prepare(`
        SELECT c.title, c.date, cr.grade, u.name as professor_name
        FROM compositions c
        JOIN composition_registrations cr ON c.id = cr.composition_id
        JOIN users u ON c.professor_id = u.id
        WHERE cr.student_id = ? AND cr.grade IS NOT NULL
      `).all(user.id);
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des notes" });
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
