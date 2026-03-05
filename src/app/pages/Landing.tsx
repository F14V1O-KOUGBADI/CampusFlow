import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  GraduationCap, 
  Bell, 
  Users, 
  CheckCircle2, 
  Play,
  LayoutDashboard,
  Clock,
  MapPin,
  TrendingUp,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 selection:text-primary">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              CF
            </div>
            <span className="text-xl font-bold tracking-tight">CampusFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a>
            <a href="#product" className="hover:text-primary transition-colors">Produit</a>
            <a href="#roles" className="hover:text-primary transition-colors">Rôles</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity">
              Connexion
            </Link>
            <button 
              onClick={() => navigate("/register/step1")}
              className="px-6 py-3 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Lancer l'app
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Hackathon Ready 2026
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Toute votre vie académique <span className="text-primary">en temps réel.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-text-secondary max-w-lg leading-relaxed"
            >
              Planning dynamique, résultats instantanés et notifications officielles. L'écosystème digital qui révolutionne l'université.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => navigate("/register/step1")}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
              >
                Découvrir l'application <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-surface border border-border rounded-2xl font-bold text-lg hover:bg-muted transition-colors flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" /> Voir la démo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-text-secondary font-medium">
                <span className="text-foreground font-bold">+2,500</span> étudiants déjà inscrits
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 20 }}
            className="relative"
          >
            <div className="relative z-10 bg-surface rounded-[40px] border border-border shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              <div className="h-12 border-b border-border bg-muted/30 flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/20" />
                  <div className="w-3 h-3 rounded-full bg-accent/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-block px-3 py-1 bg-muted rounded-lg text-[10px] font-bold text-text-secondary">campusflow.bj/dashboard</div>
                </div>
              </div>
              <div className="flex-1 p-6 bg-background overflow-hidden">
                <DashboardMockup />
              </div>
            </div>
            {/* Decorative Blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Les 4 piliers de CampusFlow</h2>
            <p className="text-lg text-text-secondary">Une solution complète pour digitaliser l'écosystème universitaire et éliminer les frictions académiques.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Calendar className="w-8 h-8" />}
              title="Planning dynamique"
              description="Emploi du temps synchronisé en temps réel avec notifications de changements de salle."
              color="bg-primary"
            />
            <FeatureCard 
              icon={<GraduationCap className="w-8 h-8" />}
              title="Suivi des notes"
              description="Consultez vos résultats dès leur publication. Moyenne pondérée calculée automatiquement."
              color="bg-emerald-500"
            />
            <FeatureCard 
              icon={<Bell className="w-8 h-8" />}
              title="Notifications"
              description="Alertes officielles instantanées pour ne plus jamais rater une information critique."
              color="bg-accent"
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Interface Enseignants"
              description="Outils dédiés pour la gestion des cours, des notes et des activités parascolaires."
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Product Section - Bento Grid */}
      <section id="product" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Une interface pensée pour la performance</h2>
              <p className="text-lg text-text-secondary max-w-xl">Fini les informations dispersées. Tout ce dont vous avez besoin est à portée de clic.</p>
            </div>
            <button className="px-6 py-3 bg-muted rounded-2xl font-bold hover:bg-border transition-colors">Voir toutes les vues</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Planning Bento */}
            <div className="md:col-span-8 bg-surface rounded-[32px] border border-border p-8 shadow-soft overflow-hidden group">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Planning de la semaine</h3>
                  <p className="text-text-secondary text-sm">Visualisation claire de votre charge académique.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold">L</div>
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">M</div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold">M</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">08:00 - 10:00</p>
                  <p className="font-bold text-sm">Mathématiques Avancées</p>
                  <p className="text-xs text-text-secondary">Amphi A</p>
                </div>
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">10:30 - 12:30</p>
                  <p className="font-bold text-sm">Programmation Web</p>
                  <p className="text-xs text-text-secondary">Labo 1</p>
                </div>
              </div>
            </div>

            {/* Grades Bento */}
            <div className="md:col-span-4 bg-primary rounded-[32px] p-8 text-white shadow-xl shadow-primary/20 flex flex-col justify-between">
              <div className="space-y-4">
                <TrendingUp className="w-10 h-10" />
                <h3 className="text-2xl font-bold">Résultats Instantanés</h3>
                <p className="text-primary-100 text-sm">Plus besoin de se déplacer. Vos notes sont disponibles dès validation.</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">15.4</span>
                  <span className="text-primary-100 text-sm mb-1">Moyenne Générale</span>
                </div>
              </div>
            </div>

            {/* Notifications Bento */}
            <div className="md:col-span-4 bg-surface rounded-[32px] border border-border p-8 shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Alertes Officielles</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-2xl border border-border/50">
                  <p className="text-xs font-bold mb-1">Note publiée</p>
                  <p className="text-xs text-text-secondary">Mathématiques Avancées</p>
                </div>
                <div className="p-4 bg-muted rounded-2xl border border-border/50 opacity-50">
                  <p className="text-xs font-bold mb-1">Changement de salle</p>
                  <p className="text-xs text-text-secondary">INF302 → Amphi B</p>
                </div>
              </div>
            </div>

            {/* Professor Bento */}
            <div className="md:col-span-8 bg-surface rounded-[32px] border border-border p-8 shadow-soft flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold">Interface Enseignants</h3>
                <p className="text-text-secondary">Gérez vos cours, publiez les notes et communiquez avec vos étudiants en quelques clics.</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-widest">Gestion Notes</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-widest">Planning Prof</span>
                  <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-widest">Activités</span>
                </div>
              </div>
              <div className="w-48 h-48 bg-muted rounded-[32px] flex items-center justify-center border border-border overflow-hidden">
                <img src="https://picsum.photos/seed/prof/300/300" alt="Professor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-32 px-6 bg-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Une plateforme, deux expériences</h2>
            <p className="text-lg text-primary-100">CampusFlow s'adapte à votre rôle pour vous offrir les outils dont vous avez réellement besoin.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <RoleCard 
              title="Espace Étudiant"
              description="Suivez votre planning, consultez vos notes et recevez des alertes pour ne rien rater de votre parcours."
              features={["Planning personnalisé", "Relevé de notes digital", "Notifications push", "Inscription activités"]}
              icon={<GraduationCap className="w-12 h-12" />}
            />
            <RoleCard 
              title="Espace Professeur"
              description="Gérez vos cours, publiez les résultats et organisez des événements parascolaires en toute simplicité."
              features={["Gestion des notes", "Planning enseignant", "Création d'activités", "Suivi des effectifs"]}
              icon={<Users className="w-12 h-12" />}
            />
          </div>
        </div>
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4 -z-0" />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                  CF
                </div>
                <span className="text-xl font-bold tracking-tight">CampusFlow</span>
              </div>
              <p className="text-text-secondary max-w-sm">
                L'écosystème digital universitaire qui centralise les informations académiques pour une expérience étudiante sans stress.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={<Facebook className="w-5 h-5" />} onClick={() => window.open('https://facebook.com', '_blank')} />
                <SocialIcon icon={<Twitter className="w-5 h-5" />} onClick={() => window.open('https://twitter.com', '_blank')} />
                <SocialIcon icon={<Linkedin className="w-5 h-5" />} onClick={() => window.open('https://linkedin.com', '_blank')} />
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-widest text-text-secondary">Produit</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#features" className="hover:text-primary transition-colors">Fonctionnalités</a></li>
                <li><a href="#product" className="hover:text-primary transition-colors">Dashboard</a></li>
                <li><a href="#roles" className="hover:text-primary transition-colors">Rôles</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold uppercase text-xs tracking-widest text-text-secondary">Support</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button onClick={() => alert("Contact: support@campusflow.bj")} className="hover:text-primary transition-colors">Contact</button></li>
                <li><button onClick={() => alert("Conditions d'utilisation en cours de rédaction.")} className="hover:text-primary transition-colors">Conditions</button></li>
                <li><button onClick={() => alert("Politique de confidentialité.")} className="hover:text-primary transition-colors">Confidentialité</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary font-medium">
            <p>© 2026 CampusFlow. Tous droits réservés.</p>
            <p>Conçu pour le Hackathon Universitaire du Bénin.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="p-8 bg-surface rounded-[32px] border border-border shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", color)}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function RoleCard({ title, description, features, icon }: any) {
  return (
    <div className="p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-[40px] space-y-8 relative z-10">
      <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-4">
        <h3 className="text-3xl font-bold">{title}</h3>
        <p className="text-primary-100 leading-relaxed">{description}</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, onClick }: { icon: React.ReactNode, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all"
    >
      {icon}
    </button>
  );
}

function DashboardMockup() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">KS</div>
          <div className="h-2 w-24 bg-muted rounded-full" />
        </div>
        <div className="w-8 h-8 bg-muted rounded-lg" />
      </div>
      
      <div className="flex-1 grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-surface rounded-2xl border border-border p-4 space-y-4">
          <div className="h-3 w-32 bg-muted rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-primary/5 border border-primary/10 rounded-xl" />
            <div className="h-20 bg-accent/5 border border-accent/10 rounded-xl" />
          </div>
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <div className="flex-1 bg-primary rounded-2xl p-4 flex flex-col justify-between">
            <TrendingUp className="w-6 h-6 text-white/50" />
            <div className="h-4 w-12 bg-white/20 rounded-full" />
          </div>
          <div className="flex-1 bg-surface rounded-2xl border border-border p-4 space-y-2">
            <div className="h-2 w-full bg-muted rounded-full" />
            <div className="h-2 w-2/3 bg-muted rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
