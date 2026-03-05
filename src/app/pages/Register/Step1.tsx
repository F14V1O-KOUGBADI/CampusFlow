import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import RegistrationLayout from "../../components/RegistrationLayout";
import { cn } from "../../../lib/utils";
import { CheckCircle2 } from "lucide-react";

export default function RegisterStep1() {
  const navigate = useNavigate();
  const { data, updateRole } = useRegistration();

  const handleContinue = () => {
    if (data.role) {
      navigate("/register/step2");
    }
  };

  return (
    <RegistrationLayout
      step={1}
      title="Choisissez votre rôle"
      subtitle="Dites-nous qui vous êtes pour personnaliser votre expérience."
    >
      <div className="grid grid-cols-1 gap-4">
        <RoleCard 
          selected={data.role === "student"}
          onClick={() => updateRole("student")}
          icon="🎓"
          title="Étudiant"
          description="Je suis inscrit dans une université et je veux suivre mes cours."
        />
        <RoleCard 
          selected={data.role === "professor"}
          onClick={() => updateRole("professor")}
          icon="📚"
          title="Professeur"
          description="J'interviens dans une université et je veux gérer mes cours."
        />
      </div>

      <button
        onClick={handleContinue}
        disabled={!data.role}
        className={cn(
          "w-full mt-8 py-5 rounded-2xl font-bold transition-all shadow-lg",
          data.role 
            ? "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]" 
            : "bg-muted text-text-secondary cursor-not-allowed"
        )}
      >
        Continuer
      </button>
    </RegistrationLayout>
  );
}

function RoleCard({ selected, onClick, icon, title, description }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-6 rounded-3xl border-2 text-left transition-all relative group",
        selected 
          ? "border-primary bg-primary-50" 
          : "border-border hover:border-primary/30 hover:bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-2xl shadow-soft">
          {icon}
        </div>
        {selected && <CheckCircle2 className="w-6 h-6 text-primary" />}
      </div>
      <h3 className={cn("text-lg font-bold mb-1", selected ? "text-primary" : "text-foreground")}>{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </button>
  );
}
