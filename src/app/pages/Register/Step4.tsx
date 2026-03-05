import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import RegistrationLayout from "../../components/RegistrationLayout";
import { fieldsByEntity } from "../../data/universities";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function RegisterStep4() {
  const navigate = useNavigate();
  const { data, updateField } = useRegistration();

  useEffect(() => {
    if (!data.entity) {
      navigate("/register/step3");
    }
  }, [data.entity, navigate]);

  if (!data.entity) return null;

  // Fallback fields if none found for current entity
  const fields = fieldsByEntity[data.entity.sigle] || [
    { name: "Tronc Commun", icon: "📚" },
    { name: "Spécialité A", icon: "⚙️" },
    { name: "Spécialité B", icon: "🔬" },
  ];

  const handleContinue = () => {
    if (data.field) {
      navigate("/register/step5");
    }
  };

  return (
    <RegistrationLayout
      step={4}
      title="Votre filière"
      subtitle={`Sélectionnez votre domaine d'étude à l'${data.entity.sigle}.`}
      onBack={() => navigate("/register/step3")}
    >
      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {fields.map((field) => (
          <button
            key={field.name}
            onClick={() => updateField(field)}
            className={cn(
              "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
              data.field?.name === field.name
                ? "border-primary bg-primary-50"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-xl shadow-soft">
                {field.icon}
              </div>
              <span className={cn("font-bold", data.field?.name === field.name ? "text-primary" : "text-foreground")}>{field.name}</span>
            </div>
            {data.field?.name === field.name && <CheckCircle2 className="w-5 h-5 text-primary ml-4" />}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!data.field}
        className={cn(
          "w-full mt-8 py-5 rounded-2xl font-bold transition-all shadow-lg",
          data.field 
            ? "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]" 
            : "bg-muted text-text-secondary cursor-not-allowed"
        )}
      >
        Continuer
      </button>
    </RegistrationLayout>
  );
}
