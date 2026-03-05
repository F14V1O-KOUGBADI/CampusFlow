import React, { useState } from "react";
import { Plus, X, Calendar, Clock, MapPin, Users, Trash2, AlertCircle, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { BENINESE_STUDENTS } from "../../../constants";

interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  timeEnd: string;
  room: string;
  capacity: number;
  enrolled: number;
  description: string;
  enrolledStudents: string[];
}

export default function ProfessorActivities() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Mathématiques Avancées",
      date: "2026-03-02",
      time: "08:00",
      timeEnd: "10:00",
      room: "Amphi A",
      capacity: 150,
      enrolled: 120,
      description: "Cours magistral sur l'analyse complexe.",
      enrolledStudents: BENINESE_STUDENTS.slice(0, 120)
    },
    {
      id: "2",
      title: "Programmation Web",
      date: "2026-03-05",
      time: "10:30",
      timeEnd: "12:30",
      room: "Labo 1",
      capacity: 100,
      enrolled: 85,
      description: "Travaux pratiques sur React et TypeScript.",
      enrolledStudents: BENINESE_STUDENTS.slice(0, 85)
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [viewingStudents, setViewingStudents] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    timeEnd: "",
    room: "",
    capacity: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      date: formData.date,
      time: formData.time,
      timeEnd: formData.timeEnd,
      room: formData.room,
      capacity: parseInt(formData.capacity),
      enrolled: 0,
      description: formData.description,
      enrolledStudents: []
    };

    setActivities([newActivity, ...activities]);
    
    setFormData({
      title: "",
      date: "",
      time: "",
      timeEnd: "",
      room: "",
      capacity: "",
      description: ""
    });
    setShowModal(false);
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Cours</h1>
          <p className="text-text-secondary">Gérez vos cours et supports pédagogiques</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-6 h-6" />
          Nouveau Cours
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <motion.div 
            layout
            key={activity.id}
            className="bg-surface rounded-[32px] border border-border p-8 shadow-soft group relative"
          >
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => setViewingStudents(activity)}
                className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                title="Voir les inscrits"
              >
                <UserCheck className="w-5 h-5" />
              </button>
              <button 
                onClick={() => deleteActivity(activity.id)}
                className="p-2 text-text-secondary hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                title="Supprimer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold mb-6 pr-20">{activity.title}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Calendar className="w-5 h-5 text-primary" />
                {new Date(activity.date).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Clock className="w-5 h-5 text-primary" />
                {activity.time} - {activity.timeEnd}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin className="w-5 h-5 text-primary" />
                {activity.room}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Users className="w-5 h-5 text-primary" />
                {activity.enrolled} / {activity.capacity} inscrits
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-text-secondary">Remplissage</span>
                  <span className="text-primary">{Math.round((activity.enrolled / activity.capacity) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${(activity.enrolled / activity.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={() => setViewingStudents(activity)}
                className="w-full py-3 bg-muted hover:bg-border rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" /> Voir la liste des inscrits
              </button>
            </div>
          </motion.div>
        ))}

        {activities.length === 0 && (
          <div className="md:col-span-2 py-20 bg-muted/30 rounded-[32px] border-2 border-dashed border-border text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-20" />
            <p className="text-text-secondary">Aucun cours créé pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal Students List */}
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
              className="fixed inset-x-6 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[500px] bg-surface rounded-[40px] shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
                <div>
                  <h2 className="text-2xl font-bold">Liste des Inscrits</h2>
                  <p className="text-sm text-text-secondary">{viewingStudents.title}</p>
                </div>
                <button onClick={() => setViewingStudents(null)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Étudiant</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Statut</span>
                </div>
                <div className="space-y-4">
                  {viewingStudents.enrolledStudents.length > 0 ? (
                    viewingStudents.enrolledStudents.map((student, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">
                            {student.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="font-bold text-sm">{student}</span>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Inscrit</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Users className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-20" />
                      <p className="text-text-secondary">Aucun étudiant inscrit pour le moment.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-border bg-muted/30 text-center">
                <p className="text-xs text-text-secondary font-medium">Total: {viewingStudents.enrolledStudents.length} étudiants</p>
              </div>
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
                <h2 className="text-2xl font-bold">Nouveau Cours</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Titre du cours</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Algorithmique avancée"
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
                      placeholder="Ex: A-203"
                      className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Capacité</label>
                    <input 
                      type="number" 
                      required
                      value={formData.capacity}
                      onChange={e => setFormData({...formData, capacity: e.target.value})}
                      placeholder="50"
                      className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Détails du cours..."
                    className="w-full px-5 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Créer le cours
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
