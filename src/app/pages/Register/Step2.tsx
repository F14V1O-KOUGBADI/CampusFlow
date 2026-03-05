import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import RegistrationLayout from "../../components/RegistrationLayout";
import { universities } from "../../data/universities";
import { Search, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";

export default function RegisterStep2() {
  const navigate = useNavigate();
  const { data, updateUniversity } = useRegistration();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUniversities = universities.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.sigle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (data.university) {
      navigate("/register/step3");
    }
  };

  return (
    <RegistrationLayout
      step={2}
      title="Votre université"
      subtitle="Sélectionnez l'établissement où vous étudiez ou enseignez."
      onBack={() => navigate("/register/step1")}
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input 
            type="text"
            placeholder="Rechercher une université..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-muted rounded-2xl border-2 border-transparent focus:border-primary focus:bg-surface outline-none transition-all"
          />
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredUniversities.map((uni) => (
            <button
              key={uni.sigle}
              onClick={() => updateUniversity(uni)}
              className={cn(
                "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                data.university?.sigle === uni.sigle
                  ? "border-primary bg-primary-50"
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("font-bold", data.university?.sigle === uni.sigle ? "text-primary" : "text-foreground")}>{uni.sigle}</span>
                  <span className="text-xs text-text-secondary">•</span>
                  <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {uni.location}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">{uni.name}</p>
              </div>
              {data.university?.sigle === uni.sigle && <CheckCircle2 className="w-5 h-5 text-primary ml-4" />}
            </button>
          ))}
          {filteredUniversities.length === 0 && (
            <p className="text-center py-8 text-text-secondary text-sm italic">Aucune université trouvée.</p>
          )}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!data.university}
        className={cn(
          "w-full mt-8 py-5 rounded-2xl font-bold transition-all shadow-lg",
          data.university 
            ? "bg-primary text-white hover:scale-[1.02] active:scale-[0.98]" 
            : "bg-muted text-text-secondary cursor-not-allowed"
        )}
      >
        Continuer
      </button>
    </RegistrationLayout>
  );
}
