import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

const scheduleData: Record<string, any[]> = {
  "Lundi": [
    { code: "INF301", title: "Maths Avancées", time: "08:00-10:00", room: "A-203", type: "course" },
    { code: "INF302", title: "Physique", time: "10:30-12:30", room: "B-105", type: "course" },
    { code: "ACT101", title: "Club Robotique", time: "14:00-16:00", room: "Labo 1", type: "activity" },
  ],
  "Mardi": [
    { code: "INF303", title: "Programmation", time: "09:00-11:00", room: "C-301", type: "course" },
    { code: "ACT102", title: "Entrepreneuriat", time: "13:00-15:00", room: "Amphi B", type: "activity" },
  ],
  "Mercredi": [
    { code: "INF304", title: "Base de Données", time: "08:00-10:00", room: "C-201", type: "course" },
    { code: "INF305", title: "Algorithmes", time: "14:00-16:00", room: "B-102", type: "course" },
  ],
  "Jeudi": [
    { code: "INF306", title: "IA", time: "09:00-12:00", room: "A-301", type: "course" },
    { code: "ACT103", title: "Leadership", time: "14:00-16:00", room: "Salle 5", type: "activity" },
  ],
  "Vendredi": [
    { code: "INF307", title: "Réseaux", time: "08:00-10:00", room: "C-104", type: "course" },
    { code: "INF308", title: "Gestion Projet", time: "10:30-12:30", room: "B-205", type: "course" },
  ],
};

export default function Schedule() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 2)); // 2 Mars 2026
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));
    const sunday = new Date(start.setDate(diff + 6));
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return `${monday.toLocaleDateString('fr-FR', options)} - ${sunday.toLocaleDateString('fr-FR', { ...options, year: 'numeric' })}`;
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const currentDayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
  const capitalizedDayName = currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mon Planning</h1>
          <p className="text-text-secondary">Gérez votre emploi du temps hebdomadaire</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted p-1 rounded-2xl w-fit">
          {(["day", "week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                view === v ? "bg-surface text-primary shadow-sm" : "text-text-secondary hover:text-foreground"
              )}
            >
              {v === "day" ? "Jour" : v === "week" ? "Semaine" : "Mois"}
            </button>
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between bg-surface p-4 rounded-3xl border border-border shadow-soft">
        <button 
          onClick={() => navigateDate(-1)}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold">
          {view === "week" ? getWeekRange(currentDate) : currentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <button 
          onClick={() => navigateDate(1)}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {view === "week" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {days.map((day) => (
            <div key={day} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary text-center py-2 bg-muted rounded-xl">
                {day}
              </h3>
              <div className="space-y-3">
                {scheduleData[day]?.map((item, i) => (
                  <div key={i}>
                    <ScheduleCard item={item} />
                  </div>
                ))}
                {(!scheduleData[day] || scheduleData[day].length === 0) && (
                  <div className="h-24 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-xs text-text-secondary italic">
                    Aucun cours
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : view === "day" ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-center py-4 bg-primary/5 text-primary rounded-2xl border border-primary/10">
            {capitalizedDayName}
          </h3>
          <div className="space-y-4">
            {scheduleData[capitalizedDayName]?.map((item, i) => (
              <div key={i}>
                <ScheduleCard item={item} />
              </div>
            )) || (
              <div className="py-20 bg-muted/30 rounded-[32px] border-2 border-dashed border-border text-center text-text-secondary">
                Aucun cours prévu pour ce jour.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-surface p-12 rounded-[32px] border-2 border-dashed border-border text-center text-text-secondary">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>La vue mensuelle est en cours de développement.</p>
        </div>
      )}
    </div>
  );
}

function ScheduleCard({ item }: { item: any }) {
  const isActivity = item.type === "activity";
  
  return (
    <div className={cn(
      "p-4 rounded-2xl border-2 transition-all hover:scale-[1.02]",
      isActivity 
        ? "bg-accent/5 border-accent/20 text-accent" 
        : "bg-primary/5 border-primary/20 text-primary"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{item.code}</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
          isActivity ? "bg-accent/10" : "bg-primary/10"
        )}>
          {isActivity ? "Activité" : "Cours"}
        </span>
      </div>
      <h4 className="font-bold text-sm mb-3 leading-tight text-foreground">{item.title}</h4>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] font-medium text-text-secondary">
          <Clock className="w-3.5 h-3.5" />
          {item.time}
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-text-secondary">
          <MapPin className="w-3.5 h-3.5" />
          {item.room}
        </div>
      </div>
    </div>
  );
}
