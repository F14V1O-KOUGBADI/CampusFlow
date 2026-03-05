import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import RegistrationLayout from "../../components/RegistrationLayout";
import { entitiesByUniversity } from "../../data/universities";
import { Search, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function RegisterStep3() {
  const navigate = useNavigate();
  const { data, updateEntity } = useRegistration();
  const [searchTerm, setSearchTerm] = useState("");

  // BUG MINEUR #8 FIX: useEffect pour redirection
  useEffect(() => {
    if (!data.university) {
      navigate("/register/step2");
    }
  }, [data.university, navigate]);

  if (!data.university) return null;

  const entities = entitiesByUniversity[data.university.sigle] || [];
  const filteredEntities = entities.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.sigle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (data.entity) {
      navigate("/register/step4");
    }
  };

  return (
    <RegistrationLayout
      step={3}
      title="Faculté ou École"
      subtitle={`Choisissez votre entité au sein de l'${data.university.sigle}.`}
      onBack={() => navigate("/register/step2")}
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input 
            type="text"
            placeholder="Rechercher une faculté..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
          />
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredEntities.map((ent) => (
            <button
              key={ent.sigle}
              onClick={() => updateEntity(ent)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                data.entity?.sigle === ent.sigle
                  ? "border-primary bg-primary-50"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div className="flex-1 min-w-0">
                <span className={cn("font-bold block mb-1", data.entity?.sigle === ent.sigle ? "text-primary" : "text-foreground")}>{ent.sigle}</span>
                <p className="text-sm text-text-secondary truncate">{ent.name}</p>
              </div>
              {data.entity?.sigle === ent.sigle && <CheckCircle2 className="w-5 h-5 text-primary ml-4" />}
            </button>
          ))}
          {filteredEntities.length === 0 && (
            <p className="text-center py-8 text-text-secondary text-sm italic">Aucune entité trouvée.</p>
          )}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!data.entity}
        className={cn(
          "w-full mt-8 py-5 rounded-2xl font-bold transition-all shadow-lg",
          data.entity 
            ? "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]" 
            : "bg-muted text-text-secondary cursor-not-allowed"
        )}
      >
        Continuer
      </button>
    </RegistrationLayout>
  );
}
