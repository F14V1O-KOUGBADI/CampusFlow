import React, { useState, useEffect } from "react";
import { Plus, Calendar, Users, CheckCircle, X, Loader2, ClipboardList, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { UNIVERSITY_ROOMS } from "../../../constants/rooms";

interface Composition {
  id: string;
  title: string;
  description: string;
  date: string;
  room?: string;
  professor_name: string;
  student_count: number;
  my_grade: number | null;
  is_registered: boolean;
}

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number | null;
}

export default function Compositions() {
  const { user } = useAuth();
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedComp, setSelectedComp] = useState<Composition | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const fetchCompositions = async () => {
    try {
      const res = await fetch("/api/compositions");
      if (res.ok) {
        const data = await res.json();
        setCompositions(data);
      }
    } catch (error) {
      console.error("Failed to fetch compositions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompositions();
  }, []);

  const handleRegister = async (id: string) => {
    try {
      const res = await fetch(`/api/compositions/${id}/register`, { method: "POST" });
      if (res.ok) {
        fetchCompositions();
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const fetchStudents = async (id: string) => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/compositions/${id}/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleGrade = async (compId: string, studentId: string, grade: number) => {
    try {
      const res = await fetch(`/api/compositions/${compId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, grade }),
      });
      if (res.ok) {
        fetchStudents(compId);
      }
    } catch (error) {
      console.error("Grading failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <ClipboardList className="w-7 h-7 text-primary" />
          Compositions
        </h3>
        {user?.role === "professor" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> Nouvelle Composition
          </button>
        )}
      </div>

      {compositions.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {compositions.map((comp) => (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-[32px] p-8 shadow-soft hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                {user?.role === "student" && comp.my_grade !== null && (
                  <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">
                    Note: {comp.my_grade}/20
                  </div>
                )}
              </div>
              <h4 className="font-bold text-lg mb-2">{comp.title}</h4>
              <p className="text-sm text-text-secondary mb-6 line-clamp-2 leading-relaxed">{comp.description}</p>
              
              <div className="flex items-center gap-5 text-xs text-text-secondary mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary/60" />
                  {new Date(comp.date).toLocaleDateString("fr-FR")}
                </div>
                {comp.room && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    {comp.room}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary/60" />
                  {comp.student_count} inscrits
                </div>
              </div>

              {user?.role === "student" ? (
                <button
                  disabled={comp.is_registered}
                  onClick={() => handleRegister(comp.id)}
                  className={cn(
                    "w-full py-3.5 rounded-2xl text-sm font-bold transition-all",
                    comp.is_registered 
                      ? "bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20" 
                      : "bg-muted hover:bg-primary hover:text-white shadow-sm"
                  )}
                >
                  {comp.is_registered ? "Inscrit" : "S'inscrire à la composition"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedComp(comp);
                    fetchStudents(comp.id);
                  }}
                  className="w-full py-3.5 bg-muted rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  Gérer les notes
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 text-center bg-surface border border-border rounded-[32px] shadow-soft flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-text-secondary" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-2">Aucune composition prévue</h4>
            <p className="text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
              {user?.role === "professor" 
                ? "Commencez par créer votre première composition pour évaluer vos étudiants."
                : "Il n'y a pas encore de compositions programmées pour vos cours."}
            </p>
          </div>
          {user?.role === "professor" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" /> Créer ma première composition
            </button>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <CreateModal onClose={() => setShowCreateModal(false)} onCreated={fetchCompositions} />
        )}
        {selectedComp && (
          <ManageModal 
            comp={selectedComp} 
            students={students} 
            loading={loadingStudents}
            onClose={() => setSelectedComp(null)} 
            onGrade={handleGrade}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateModal({ onClose, onCreated }: { onClose: () => void, onCreated: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: "", description: "", date: "", room: "" });
  const [loading, setLoading] = useState(false);
  const [roomSearch, setRoomSearch] = useState("");
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  const universityRooms = UNIVERSITY_ROOMS.find(u => u.university === user?.university)?.rooms || [];
  const filteredRooms = universityRooms.filter(room => 
    room.toLowerCase().includes(roomSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/compositions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onCreated();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create composition", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-surface rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Nouvelle Composition</h3>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Titre</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Ex: Examen Final Mathématiques"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all h-32 resize-none"
                placeholder="Détails de l'examen..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-bold mb-2">Salle</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.room}
                  onFocus={() => setShowRoomDropdown(true)}
                  onChange={(e) => {
                    setFormData({ ...formData, room: e.target.value });
                    setRoomSearch(e.target.value);
                    setShowRoomDropdown(true);
                  }}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                  placeholder="Rechercher une salle..."
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              </div>

              <AnimatePresence>
                {showRoomDropdown && (universityRooms.length > 0) && (
                  <>
                    <div 
                      className="fixed inset-0 z-[60]" 
                      onClick={() => setShowRoomDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-surface border border-border rounded-2xl shadow-xl z-[70] max-h-48 overflow-y-auto"
                    >
                      {filteredRooms.length > 0 ? (
                        filteredRooms.map((room, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, room});
                              setRoomSearch(room);
                              setShowRoomDropdown(false);
                            }}
                            className="w-full px-5 py-3 text-left text-sm hover:bg-muted transition-colors border-b border-border last:border-0"
                          >
                            {room}
                          </button>
                        ))
                      ) : (
                        <div className="px-5 py-3 text-sm text-text-secondary italic">
                          Aucune salle trouvée.
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Créer la composition"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function ManageModal({ comp, students, loading, onClose, onGrade }: { 
  comp: Composition, 
  students: Student[], 
  loading: boolean,
  onClose: () => void, 
  onGrade: (compId: string, studentId: string, grade: number) => void 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-surface rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold">{comp.title}</h3>
              <p className="text-text-secondary text-sm">Gestion des notes des étudiants</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center p-12 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                <p className="text-text-secondary">Aucun étudiant inscrit à cette composition.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="p-4 bg-muted/50 border border-border rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">{student.name}</p>
                      <p className="text-xs text-text-secondary">{student.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        defaultValue={student.grade || ""}
                        onBlur={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) onGrade(comp.id, student.id, val);
                        }}
                        className="w-20 px-3 py-2 bg-surface border border-border rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Note"
                      />
                      <span className="text-sm font-bold text-text-secondary">/20</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
