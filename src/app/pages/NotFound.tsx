import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center text-destructive mb-8">
        <AlertCircle className="w-12 h-12" />
      </div>
      
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page non trouvée</h2>
      <p className="text-text-secondary mb-12 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>

      <Link 
        to="/" 
        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
      >
        <ArrowLeft className="w-5 h-5" /> Retour à l'accueil
      </Link>
    </div>
  );
}
