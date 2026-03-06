import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import { useAuth } from "../../context/AuthContext";
import RegistrationLayout from "../../components/RegistrationLayout";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function RegisterStep5() {
  const navigate = useNavigate();
  const { data, updateAccountInfo } = useRegistration();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!data.field) {
      navigate("/register/step4");
    }
  }, [data.field, navigate]);

  if (!data.field) return null;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { success, error: regError } = await register(data);
    setLoading(false);
    if (success) {
      navigate("/register/success");
    } else {
      setError(regError || "Une erreur est survenue lors de la création du compte.");
    }
  };

  return (
    <RegistrationLayout
      step={5}
      title="Créez votre compte"
      subtitle="Dernière étape ! Remplissez vos informations personnelles."
      onBack={() => navigate("/register/step4")}
    >
      <form onSubmit={handleCreateAccount} className="space-y-5">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Nom complet</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              required
              value={data.fullName}
              onChange={e => updateAccountInfo({ fullName: e.target.value })}
              placeholder="Koffi Sènan"
              className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="email" 
              required
              value={data.email}
              onChange={e => updateAccountInfo({ email: e.target.value })}
              placeholder="votre@email.com"
              className="w-full pl-12 pr-4 py-4 bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={data.password}
              onChange={e => updateAccountInfo({ password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-muted rounded-xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
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

        <div className="p-5 bg-muted/50 rounded-2xl border border-border space-y-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Récapitulatif</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-text-secondary">Rôle:</span>
            <span className="font-bold text-right capitalize">{data.role}</span>
            <span className="text-text-secondary">Université:</span>
            <span className="font-bold text-right">{data.university?.sigle}</span>
            <span className="text-text-secondary">Faculté:</span>
            <span className="font-bold text-right">{data.entity?.sigle}</span>
            <span className="text-text-secondary">Filière:</span>
            <span className="font-bold text-right">{data.field?.name}</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Création du compte..." : "Créer mon compte"}
        </button>
      </form>
    </RegistrationLayout>
  );
}
