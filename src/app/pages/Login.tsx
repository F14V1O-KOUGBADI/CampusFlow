import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Identifiants invalides. Veuillez réessayer.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetSent(false);
      setResetEmail("");
    }, 3000);
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    const success = await login(demoEmail, "demo123");
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
          CF
        </div>
        <h1 className="text-2xl font-bold">CampusFlow</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface rounded-[32px] border-2 border-border p-8 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Bon retour !</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-text-secondary group-hover:text-foreground transition-colors">Se souvenir de moi</span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-primary font-semibold hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-text-secondary text-sm mb-6">Pas encore de compte ? <Link to="/register/step1" className="text-primary font-bold hover:underline">S'inscrire</Link></p>
          
          <div className="bg-gradient-to-br from-muted to-muted/50 rounded-3xl border-2 border-border/50 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 text-center">Accès Rapide Démo</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDemoLogin("etudiant@demo.com")}
                className="p-3 bg-surface rounded-xl border border-border text-xs font-bold hover:border-primary hover:text-primary transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">🎓</span> Étudiant
              </button>
              <button 
                onClick={() => handleDemoLogin("professeur@demo.com")}
                className="p-3 bg-surface rounded-xl border border-border text-xs font-bold hover:border-primary hover:text-primary transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">📚</span> Professeur
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-surface rounded-[32px] border-2 border-border p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Réinitialiser</h3>
                <button onClick={() => setShowForgotModal(false)} className="p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-text-secondary mb-6">
                Entrez votre adresse email universitaire pour recevoir un lien de réinitialisation.
              </p>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-600 text-sm font-medium flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  Lien envoyé ! Vérifiez votre boîte mail.
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Email universitaire</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                      <input 
                        type="email" 
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
                        placeholder="nom@uac.bj"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md hover:scale-[1.02] transition-transform"
                  >
                    Envoyer le lien
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
