import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  Plus, 
  LogOut, 
  Bell, 
  Menu, 
  X, 
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const notifications = [
    { id: 1, title: "Nouveau cours ajouté", time: "Il y a 2h", read: false },
    { id: 2, title: "Note publiée: Mathématiques", time: "Il y a 5h", read: false },
    { id: 3, title: "Changement de salle: INF302", time: "Hier", read: true },
  ];

  const navItems = user.role === "professor" 
    ? [
        { label: "Accueil", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Planning", icon: Calendar, path: "/dashboard/schedule" },
        { label: "Activités", icon: Plus, path: "/dashboard/activities" },
      ]
    : [
        { label: "Accueil", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Planning", icon: Calendar, path: "/dashboard/schedule" },
        { label: "Notes", icon: GraduationCap, path: "/dashboard/grades" },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* ... Sidebar Desktop ... */}
      <aside className="hidden lg:flex w-[280px] bg-sidebar border-r border-border flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            CF
          </div>
          <span className="text-xl font-bold tracking-tight">CampusFlow</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                isActive(item.path) 
                  ? "bg-primary-50 text-primary" 
                  : "text-text-secondary hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-text-secondary hover:bg-muted hover:text-foreground transition-all mb-2"
          >
            <UserIcon className="w-5 h-5" />
            Paramètres
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] pb-24 lg:pb-0">
        {/* Header Mobile */}
        <header className="lg:hidden h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CF
            </div>
            <span className="font-bold">CampusFlow</span>
          </div>
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
              <Bell className="w-6 h-6 text-foreground" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border-2 border-surface"></span>
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-10 right-0 w-72 bg-surface border border-border rounded-3xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border font-bold text-sm">Notifications</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={cn("p-4 border-b border-border last:border-0 text-xs", !n.read && "bg-primary/5")}>
                          <p className="font-bold mb-1">{n.title}</p>
                          <p className="text-text-secondary">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ... Mobile Bottom Nav ... */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border h-20 flex items-center justify-around px-4 z-40">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive(item.path) ? "text-primary" : "text-text-secondary"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
        <button 
          onClick={() => setProfileOpen(true)}
          className="flex flex-col items-center gap-1 text-text-secondary"
        >
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profil</span>
        </button>
      </nav>

      {/* Profile Drawer */}
      <AnimatePresence>
        {profileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-surface rounded-t-[32px] z-50 lg:hidden p-8"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8" />
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl mb-4">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-text-secondary capitalize">{user.role}</p>
                <p className="text-sm text-text-secondary mt-1">{user.email}</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    setShowSettings(true);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-2xl font-semibold"
                >
                  <span>Paramètres du compte</span>
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
                </button>
                <button 
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-destructive text-white rounded-2xl font-bold shadow-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface rounded-[32px] border border-border p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Paramètres</h3>
                <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Apparence</h4>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
                    <span className="text-sm font-medium">Mode Sombre</span>
                    <div className="w-12 h-6 bg-border rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Notifications</h4>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-2xl">
                    <span className="text-sm font-medium">Push Notifications</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
