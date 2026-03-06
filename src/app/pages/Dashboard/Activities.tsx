import React, { useState, useEffect } from "react";
import { Plus, X, Calendar, Clock, MapPin, Users, Trash2, AlertCircle, UserCheck, GraduationCap, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../context/AuthContext";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  room: string;
  date: string;
  time: string;
  timeEnd: string;
  professorName: string;
}

interface Composition {
  id: string;
  title: string;
  date: string;
  time: string;
  timeEnd: string;
  room: string;
  capacity: number;
  enrolled: number;
  description: string;
  professorName: string;
  isRegistered?: boolean;
  studentGrade?: number | null;
}

export default function Activities() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"courses" | "compositions">("courses");
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingStudents, setViewingStudents] = useState<Composition | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [gradingStudent, setGradingStudent] = useState<{ studentId: string, compositionId: string, name: string, currentGrade: number | null } | null>(null);
  const [newGrade, setNewGrade] = useState("");
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const isProfessor = user?.role === "professor";
  const isStudent = user?.role === "student";

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    timeEnd: "",
    room: "",
    capacity: "",
    description: ""
  });

  const fetchCompositions = async () => {
    try {
      const res = await fetch("/api/compositions");
      if (res.ok) {
        const data = await res.json();
        setCompositions(data);
      }
    } catch (error) {
      console.error("Error fetching compositions:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchCompositions(), fetchCourses()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (compositionId: string) => {
    setRegisteringId(compositionId);
    try {
      const res = await fetch(`/api/compositions/${compositionId}/register`, {
        method: "POST",
      });
      if (res.ok) {
        fetchCompositions();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setRegisteringId(null);
    }
  };

  const fetchStudents = async (compositionId: string) => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/compositions/${compositionId}/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (viewingStudents && isProfessor) {
      fetchStudents(viewingStudents.id);
    }
  }, [viewingStudents, isProfessor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = activeTab === "courses" ? "/api/courses" : "/api/compositions";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          capacity: activeTab === "compositions" ? parseInt(formData.capacity) : undefined
        })
      });

      if (res.ok) {
        if (activeTab === "courses") fetchCourses();
        else fetchCompositions();
        
        setShowModal(false);
        setFormData({
          title: "",
          date: "",
          time: "",
          timeEnd: "",
          room: "",
          capacity: "",
          description: ""
        });
      }
    } catch (error) {
      console.error(`Error creating ${activeTab}:`, error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingStudent) return;
    
    setSubmittingGrade(true);
    try {
      const res = await fetch(`/api/compositions/${gradingStudent.compositionId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: gradingStudent.studentId,
          grade: parseFloat(newGrade)
        })
      });

      if (res.ok) {
        fetchStudents(gradingStudent.compositionId);
        setGradingStudent(null);
        setNewGrade("");
      }
    } catch (error) {
      console.error("Error submitting grade:", error);
    } finally {
      setSubmittingGrade(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activités Académiques</h1>
          <p className="text-text-secondary">
            {isProfessor ? "Gérez vos cours, examens et notes" : "Consultez vos cours et inscrivez-vous aux examens"}
          </p>
        </div>
        
        {isProfessor && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <Plus className="w-6 h-6" />
            {activeTab === "courses" ? "Nouveau Cours" : "Nouvelle Composition"}
          </button>
        )}
      </header>

      {/* Tabs */}
      <div className="flex gap-4 p-1 bg-muted rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("courses")}
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm transition-all",
            activeTab === "courses" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-foreground"
          )}
        >
          Cours
        </button>
        <button 
          onClick={() => setActiveTab("compositions")}
          className={cn(
            "px-8 py-3 rounded-xl font-bold text-sm transition-all",
            activeTab === "compositions" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-foreground"
          )}
        >
          Compositions
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {activeTab === "courses" ? (
          courses.map((course) => (
            <motion.div 
              layout
              key={course.id}
              className="bg-surface rounded-[32px] border border-border p-8 shadow-soft group relative"
            >
              {isProfessor && (
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              <h3 className="text-xl font-bold mb-6 pr-12">{course.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Calendar className="w-5 h-5 text-primary" />
                  {new Date(course.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Clock className="w-5 h-5 text-primary" />
                  {course.time} - {course.timeEnd}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <MapPin className="w-5 h-5 text-primary" />
                  {course.room}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Users className="w-5 h-5 text-primary" />
                  {course.professorName}
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2">{course.description}</p>
            </motion.div>
          ))
        ) : (
          compositions.map((composition) => (
            <motion.div 
              layout
              key={composition.id}
              className="bg-surface rounded-[32px] border border-border p-8 shadow-soft group relative"
            >
              {isProfessor && (
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => setViewingStudents(composition)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                    title="Voir les inscrits"
                  >
                    <UserCheck className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold pr-4">{composition.title}</h3>
                {isStudent && composition.isRegistered && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Inscrit
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Calendar className="w-5 h-5 text-primary" />
                  {new Date(composition.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Clock className="w-5 h-5 text-primary" />
                  {composition.time} - {composition.timeEnd}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <MapPin className="w-5 h-5 text-primary" />
                  {composition.room}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Users className="w-5 h-5 text-primary" />
                  {composition.enrolled} / {composition.capacity} inscrits
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-text-secondary">Taux d'inscription</span>
                    <span className="text-primary">{Math.round((composition.enrolled / composition.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${(composition.enrolled / composition.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {isProfessor ? (
                  <button 
                    onClick={() => setViewingStudents(composition)}
                    className="w-full py-3 bg-muted hover:bg-border rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4" /> Gérer les notes
                  </button>
                ) : (
                  <div className="flex gap-3">
                    {composition.isRegistered ? (
                      <div className="flex-1 flex items-center justify-center gap-4 bg-muted rounded-xl p-3">
                        <div className="text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Ma Note</p>
                          <p className={cn(
                            "text-lg font-black",
                            composition.studentGrade !== null 
                              ? (composition.studentGrade >= 10 ? "text-emerald-500" : "text-destructive")
                              : "text-text-secondary opacity-50"
                          )}>
                            {composition.studentGrade !== null ? `${composition.studentGrade}/20` : "--/20"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleRegister(composition.id)}
                        disabled={registeringId === composition.id || composition.enrolled >= composition.capacity}
                        className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                      >
                        {registeringId === composition.id ? "Inscription..." : "S'inscrire à la composition"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}

        {((activeTab === "courses" && courses.length === 0) || (activeTab === "compositions" && compositions.length === 0)) && (
          <div className="md:col-span-2 py-20 bg-muted/30 rounded-[32px] border-2 border-dashed border-border text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-20" />
            <p className="text-text-secondary">Aucun élément disponible pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal Students List & Grading */}
      <AnimatePresence>
        {viewingStudents && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingStudents(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-6 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-surface rounded-[40px] shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                <div>
                  <h2 className="text-2xl font-bold">Gestion des Notes</h2>
                  <p className="text-sm text-text-secondary">{viewingStudents.title}</p>
                </div>
                <button onClick={() => setViewingStudents(null)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {loadingStudents ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{student.name}</p>
                              <p className="text-[10px] text-text-secondary">{student.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {student.grade !== null ? (
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  "font-black text-lg",
                                  student.grade >= 10 ? "text-emerald-500" : "text-destructive"
                                )}>
                                  {student.grade}/20
                                </span>
                                <button 
                                  onClick={() => {
                                    setGradingStudent({ studentId: student.id, compositionId: viewingStudents.id, name: student.name, currentGrade: student.grade });
                                    setNewGrade(student.grade?.toString() || "");
                                  }}
                                  className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setGradingStudent({ studentId: student.id, compositionId: viewingStudents.id, name: student.name, currentGrade: null });
                                  setNewGrade("");
                                }}
                                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:scale-105 transition-transform"
                              >
                                Noter
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        <Users className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-20" />
                        <p className="text-text-secondary">Aucun étudiant inscrit pour le moment.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Grading Form */}
      <AnimatePresence>
        {gradingStudent && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGradingStudent(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-6 top-[25%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[400px] bg-surface rounded-[40px] shadow-2xl z-[90] p-8"
            >
              <h3 className="text-xl font-bold mb-2">Attribuer une note</h3>
              <p className="text-sm text-text-secondary mb-6">{gradingStudent.name}</p>
              
              <form onSubmit={handleGradeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Note (/20)</label>
                  <input 
                    type="number" 
                    step="0.25"
                    min="0"
                    max="20"
                    required
                    autoFocus
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    placeholder="15.5"
                    className="w-full px-6 py-5 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all text-2xl font-black text-center"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setGradingStudent(null)}
                    className="flex-1 py-4 bg-muted rounded-2xl font-bold hover:bg-border transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={submittingGrade}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {submittingGrade ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Creation */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-6 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-surface rounded-[40px] shadow-2xl z-[70] overflow-hidden"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <h2 className="text-2xl font-bold">{activeTab === "courses" ? "Nouveau Cours" : "Nouvelle Composition"}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">
                    {activeTab === "courses" ? "Nom du cours" : "Titre de la composition"}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder={activeTab === "courses" ? "Ex: Programmation Web" : "Ex: Examen Final - Mathématiques"}
                    className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Salle</label>
                    <input 
                      type="text" 
                      required
                      value={formData.room}
                      onChange={e => setFormData({...formData, room: e.target.value})}
                      placeholder="Ex: Amphi A"
                      className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                    />
                  </div>
                </div>

                <div className={cn("grid gap-4", activeTab === "compositions" ? "grid-cols-3" : "grid-cols-2")}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Début</label>
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Fin</label>
                    <input 
                      type="time" 
                      required
                      value={formData.timeEnd}
                      onChange={e => setFormData({...formData, timeEnd: e.target.value})}
                      className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                    />
                  </div>
                  {activeTab === "compositions" && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Capacité</label>
                      <input 
                        type="number" 
                        required
                        value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})}
                        placeholder="150"
                        className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder={activeTab === "courses" ? "Objectifs du cours..." : "Instructions pour les étudiants..."}
                    className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {activeTab === "courses" ? "Créer le cours" : "Créer la composition"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
