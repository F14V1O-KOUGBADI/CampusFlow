import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../../lib/utils";

interface RegistrationLayoutProps {
  children: React.ReactNode;
  step: number;
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export default function RegistrationLayout({ children, step, title, subtitle, onBack }: RegistrationLayoutProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            CF
          </div>
          <span className="text-xl font-bold tracking-tight">CampusFlow</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-primary transition-colors"
            title="Changer de thème"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <Link to="/login" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">
            Déjà un compte ?
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Progress Bar */}
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-500",
                  s <= step ? "bg-primary text-white shadow-md scale-110" : "bg-muted text-text-secondary"
                )}
              >
                {s}
              </div>
            ))}
          </div>

          <div className="text-center space-y-2">
            {onBack && (
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
            )}
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-text-secondary">{subtitle}</p>
          </div>

          <div className="bg-surface rounded-[40px] border-2 border-border p-8 shadow-md">
            {children}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-text-secondary text-xs">
        <p>© 2026 CampusFlow. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
