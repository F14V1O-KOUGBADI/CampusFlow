import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, GraduationCap, Shield, Facebook, Twitter, Linkedin } from "lucide-react";
import { motion } from "motion/react";

export default function Landing() {
  const navigate = useNavigate();

  const universities = ["UAC", "UP", "UNSTIM", "UPMB", "UNA", "UADC", "EPAC", "IFRI"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              CF
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">CampusFlow</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
              Connexion
            </Link>
            <button 
              onClick={() => navigate("/register/step1")}
              className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
            >
              Lancer l'app
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground"
          >
            L'écosystème digital qui <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">révolutionne</span> la vie étudiante
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary mb-10 leading-relaxed"
          >
            Fini les files d'attente, les retards et le stress. Gérez toute votre vie académique en un seul endroit.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate("/register/step1")}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 mx-auto"
          >
            Lancer l'application <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-text-secondary mb-8">Ils nous ont fait confiance</p>
          <div className="flex flex-wrap justify-center gap-4">
            {universities.map((uni, i) => (
              <div key={i} className="px-6 py-3 bg-surface rounded-full border border-border shadow-sm text-primary font-bold text-sm">
                {uni}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Solutions intelligentes</h2>
          </div>
          
          <div className="space-y-8">
            <SolutionCard 
              icon={<Shield className="w-6 h-6 text-destructive" />}
              problemTitle="Files d'attente interminables"
              problemDesc="Des heures perdues sous le soleil pour consulter vos notes affichées."
              solutionDesc="Consultation instantanée depuis votre smartphone. Résultats en temps réel."
            />
            <SolutionCard 
              icon={<Calendar className="w-6 h-6 text-destructive" />}
              problemTitle="Changements de dernière minute"
              problemDesc="Salle changée, cours annulé ? Vous l'apprenez en arrivant."
              solutionDesc="Notifications push instantanées. Planning synchronisé en temps réel."
            />
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-6 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Impact Mesurable</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="text-6xl font-bold mb-2">100%</div>
              <div className="text-primary-100 text-lg">Digitalisé</div>
            </div>
            <div>
              <div className="text-6xl font-bold mb-2">24/7</div>
              <div className="text-primary-100 text-lg">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Comment ça marche</h2>
          <div className="space-y-16">
            <StepItem 
              number="1"
              title="Créez votre compte"
              description="Inscrivez-vous avec votre email universitaire"
            />
            <StepItem 
              number="2"
              title="Connectez-vous avec votre rôle"
              description="Étudiant, professeur ou administrateur"
            />
            <StepItem 
              number="3"
              title="Accédez à votre tableau de bord"
              description="Interface personnalisée selon votre profil"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-primary">CampusFlow</span>
            </div>
            <p className="text-text-secondary">L'assistant numérique pour étudiants</p>
            <p className="text-xs text-text-secondary">© 2026 CampusFlow. Hackathon Universitaire.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 mb-12">
            <div className="space-y-4">
              <h4 className="font-bold">Liens</h4>
              <ul className="space-y-3 text-text-secondary">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">À propos</button></li>
                <li><button onClick={() => alert("Contact: support@campusflow.bj")} className="hover:text-primary transition-colors">Contact</button></li>
                <li><button onClick={() => alert("Conditions d'utilisation en cours de rédaction.")} className="hover:text-primary transition-colors">Conditions d'utilisation</button></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Réseaux sociaux</h4>
              <div className="flex gap-4">
                <SocialIcon icon={<Facebook className="w-5 h-5" />} onClick={() => window.open('https://facebook.com', '_blank')} />
                <SocialIcon icon={<Twitter className="w-5 h-5" />} onClick={() => window.open('https://twitter.com', '_blank')} />
                <SocialIcon icon={<Linkedin className="w-5 h-5" />} onClick={() => window.open('https://linkedin.com', '_blank')} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ... SolutionCard and StepItem ...
function SolutionCard({ icon, problemTitle, problemDesc, solutionDesc }: any) {
  return (
    <div className="p-8 bg-surface rounded-[32px] border border-border shadow-soft">
      <div className="w-14 h-14 bg-destructive/5 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <div className="space-y-6">
        <div>
          <span className="inline-block px-3 py-1 bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">Problème</span>
          <h3 className="text-xl font-bold mb-2">{problemTitle}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{problemDesc}</p>
        </div>
        <div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">Solution</span>
          <p className="font-medium text-foreground text-sm leading-relaxed">{solutionDesc}</p>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
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

