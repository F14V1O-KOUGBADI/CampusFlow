import { Download, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useState } from "react";

const gradesData = [
  { code: "INF301", title: "Mathématiques Avancées", grade: 16, type: "Examen Final", credits: 4 },
  { code: "INF302", title: "Physique Quantique", grade: 18, type: "Projet", credits: 3 },
  { code: "INF303", title: "Programmation Avancée", grade: 14, type: "TP", credits: 5 },
  { code: "INF305", title: "Algorithmes et Structures", grade: 17, type: "Examen", credits: 4 },
  { code: "INF306", title: "Intelligence Artificielle", grade: 15, type: "Projet", credits: 5 },
  { code: "INF304", title: "Base de Données", grade: 13, type: "TP", credits: 3 },
  { code: "INF307", title: "Réseaux et Sécurité", grade: 16, type: "Examen", credits: 4 },
  { code: "INF308", title: "Gestion de Projet", grade: 9, type: "TP", credits: 3 },
];

export default function Grades() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  // BUG CRITIQUE #1 FIX: Calcul moyenne pondérée réel
  const totalCredits = gradesData.reduce((acc, g) => acc + g.credits, 0);
  const weightedSum = gradesData.reduce((acc, g) => acc + g.grade * g.credits, 0);
  const weightedAverage = weightedSum / totalCredits;

  return (
    <div className="space-y-8 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Mes Notes</h1>
          <p className="text-text-secondary">Suivi de vos performances académiques</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-4 bg-surface border border-border rounded-3xl shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 font-bold text-xl">
              {weightedAverage.toFixed(2)}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Moyenne Générale</p>
              <p className="text-sm font-bold">Mention Bien</p>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-4 bg-primary text-white rounded-2xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
          >
            {isDownloading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4">
          <p className="font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Relevé de notes téléchargé avec succès !
          </p>
        </div>
      )}

      <div className="bg-surface rounded-[32px] border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-text-secondary">Code</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-text-secondary">Matière</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-text-secondary text-center">Note</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-text-secondary">Crédits</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-text-secondary">Type</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-text-secondary text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {gradesData.map((grade, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-8 py-6 font-bold text-primary text-sm">{grade.code}</td>
                  <td className="px-8 py-6 font-bold text-sm">{grade.title}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <span className={cn(
                        "text-lg font-black",
                        grade.grade >= 15 ? "text-emerald-500" : grade.grade >= 10 ? "text-orange-500" : "text-destructive"
                      )}>
                        {grade.grade}/20
                      </span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            grade.grade >= 15 ? "bg-emerald-500" : grade.grade >= 10 ? "bg-orange-500" : "bg-destructive"
                          )} 
                          style={{ width: `${(grade.grade / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-text-secondary">{grade.credits} ECTS</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-muted rounded-full text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                      {grade.type}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {grade.grade >= 10 ? (
                      <div className="inline-flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        Validé <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-destructive font-bold text-sm">
                        Échec <XCircle className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
