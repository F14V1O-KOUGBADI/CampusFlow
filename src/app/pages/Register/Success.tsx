import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useRegistration } from "../../context/RegistrationContext";

export default function RegisterSuccess() {
  const navigate = useNavigate();
  const { data, resetRegistration } = useRegistration();

  const handleFinish = () => {
    resetRegistration();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface rounded-[40px] border-2 border-border p-10 shadow-xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Compte créé !</h1>
        <p className="text-text-secondary mb-10 leading-relaxed">
          Félicitations <strong>{data.fullName}</strong>, votre compte CampusFlow est prêt. Vous pouvez maintenant vous connecter.
        </p>

        <div className="bg-muted/50 rounded-3xl p-6 text-left space-y-3 mb-10">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Email</span>
            <span className="font-bold">{data.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Université</span>
            <span className="font-bold">{data.university?.sigle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Rôle</span>
            <span className="font-bold capitalize">{data.role}</span>
          </div>
        </div>

        <button 
          onClick={handleFinish}
          className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          Accéder à l'application <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
