import { Bell, Clock, MapPin, User, TrendingUp, BookOpen, Users, Plus, Calendar, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "professor") {
    return <ProfessorDashboard user={user} />;
  }

  return <StudentDashboard user={user} />;
}

function NotificationDropdown({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const notifications = [
    { id: 1, title: "Nouveau cours ajouté", time: "Il y a 2h", read: false },
    { id: 2, title: "Note publiée: Mathématiques", time: "Il y a 5h", read: false },
    { id: 3, title: "Changement de salle: INF302", time: "Hier", read: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose}></div>
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 w-80 bg-surface border border-border rounded-3xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold">Notifications</h3>
              <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className={cn("p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors", !n.read && "bg-primary/5")}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold">{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                  </div>
                  <p className="text-xs text-text-secondary">{n.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 text-center border-t border-border">
              <button className="text-xs font-bold text-primary hover:underline">Voir tout</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StudentDashboard({ user }: { user: any }) {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between relative">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-text-secondary capitalize">{today}</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hidden lg:flex w-12 h-12 bg-surface border border-border rounded-2xl items-center justify-center relative hover:bg-muted transition-colors"
          >
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-surface"></span>
          </button>
          <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      </header>
      {/* ... rest of StudentDashboard remains the same ... */}

      {/* Current Course Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Cours Actuel</span>
          </div>
          <h2 className="text-3xl font-bold mb-8">Mathématiques Avancées</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs opacity-70">Horaire</p>
                <p className="font-bold">08:00 - 10:00</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs opacity-70">Salle</p>
                <p className="font-bold">A-203</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs opacity-70">Professeur</p>
                <p className="font-bold">Dr. Sènan Gnonlonfoun</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Next Courses */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold">Prochains Cours</h3>
          <div className="space-y-4">
            <NextCourseItem 
              time="10:30" 
              title="Programmation Web Avancée" 
              room="B-105" 
              professor="Prof. Félicien Avlessi" 
            />
            <NextCourseItem 
              time="14:00" 
              title="Base de Données" 
              room="C-201" 
              professor="Dr. Mohamed N. Baco" 
            />
            <NextCourseItem 
              time="16:00" 
              title="Intelligence Artificielle" 
              room="A-301" 
              professor="Dr. Eléonore Yayi Ladekan" 
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Statistiques</h3>
          <div className="grid gap-4">
            <StatCard 
              title="Moyenne Générale" 
              value="15.2/20" 
              progress={76} 
              color="bg-emerald-500" 
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            />
            <StatCard 
              title="Cours Cette Semaine" 
              value="18" 
              progress={60} 
              color="bg-primary" 
              icon={<BookOpen className="w-5 h-5 text-primary" />}
            />
            <StatCard 
              title="Cours Validés" 
              value="12" 
              subtitle="Semestre en cours"
              progress={85} 
              color="bg-accent" 
              icon={<BookOpen className="w-5 h-5 text-accent" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessorDashboard({ user }: { user: any }) {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between relative">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, Prof. {user.name.split(" ").pop()} 👋</h1>
          <p className="text-text-secondary capitalize">{today}</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hidden lg:flex w-12 h-12 bg-surface border border-border rounded-2xl items-center justify-center relative hover:bg-muted transition-colors"
          >
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-surface"></span>
          </button>
          <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard/activities")}
          className="p-8 bg-gradient-to-br from-primary to-primary/80 rounded-[32px] text-white text-left shadow-lg"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Nouveau Cours</h3>
          <p className="text-primary-100 text-sm">Gérez vos cours et supports pour vos étudiants.</p>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard/schedule")}
          className="p-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-[32px] text-white text-left shadow-lg"
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Mon Planning</h3>
          <p className="text-emerald-100 text-sm">Consultez votre emploi du temps hebdomadaire.</p>
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold">Prochains Cours</h3>
          <div className="space-y-4">
            <NextCourseItem 
              time="10:30" 
              title="Programmation Web Avancée" 
              room="B-105" 
              professor="120 étudiants" 
            />
            <NextCourseItem 
              time="14:00" 
              title="Base de Données" 
              room="C-201" 
              professor="85 étudiants" 
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Cours Récents</h3>
          <div className="space-y-4">
            <ActivityProgressCard title="Mathématiques Avancées" enrolled={120} capacity={150} />
            <ActivityProgressCard title="Programmation Web" enrolled={85} capacity={100} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NextCourseItem({ time, title, room, professor }: { time: string, title: string, room: string, professor: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-primary border-4 border-primary-50"></div>
        <div className="w-0.5 flex-1 bg-border group-last:bg-transparent mt-2"></div>
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-primary">{time}</span>
          <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-wider text-text-secondary">{room}</span>
        </div>
        <h4 className="font-bold text-lg mb-1">{title}</h4>
        <p className="text-sm text-text-secondary">{professor}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, progress, color, icon }: any) {
  return (
    <div className="p-6 bg-surface rounded-3xl border border-border shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {subtitle && <p className="text-[10px] text-text-secondary">{subtitle}</p>}
        </div>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

function ActivityProgressCard({ title, enrolled, capacity }: any) {
  const percent = (enrolled / capacity) * 100;
  return (
    <div className="p-5 bg-surface rounded-3xl border border-border">
      <h4 className="font-bold mb-3">{title}</h4>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-text-secondary">Inscrits</span>
        <span className="font-bold">{enrolled} / {capacity}</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
