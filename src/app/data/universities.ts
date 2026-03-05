export const universities = [
  { sigle: "UAC", name: "Université d'Abomey-Calavi", location: "Abomey-Calavi", domain: "@uac.bj" },
  { sigle: "UP", name: "Université de Parakou", location: "Parakou", domain: "@univ-parakou.bj" },
  { sigle: "UNSTIM", name: "Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques", location: "Abomey", domain: "@unstim.bj" },
  { sigle: "UPMB", name: "Université Polytechnique de Man Bè", location: "Man Bè", domain: "@upmb.bj" },
  { sigle: "UCAO-UUB", name: "Université Catholique de l'Afrique de l'Ouest - Unité Universitaire du Bénin", location: "Cotonou", domain: "@ucao-uub.bj" },
];

export const entitiesByUniversity: Record<string, { sigle: string; name: string }[]> = {
  UAC: [
    { sigle: "FAST", name: "Faculté des Sciences et Techniques" },
    { sigle: "FASHS", name: "Faculté des Sciences Humaines et Sociales" },
    { sigle: "FSS", name: "Faculté des Sciences de la Santé" },
    { sigle: "FLASH", name: "Faculté des Lettres, Arts et Sciences Humaines" },
    { sigle: "EPAC", name: "École Polytechnique d'Abomey-Calavi" },
    { sigle: "ENEAM", name: "École Nationale d'Économie Appliquée et de Management" },
    { sigle: "IFRI", name: "Institut de Formation et de Recherche en Informatique" },
    { sigle: "FSE", name: "Faculté des Sciences de l'Éducation" },
  ],
  UP: [
    { sigle: "FDS", name: "Faculté des Sciences" },
    { sigle: "FDSP", name: "Faculté de Droit et Sciences Politiques" },
    { sigle: "FM", name: "Faculté de Médecine" },
    { sigle: "LETTRE", name: "Faculté des Lettres, Langues et Sciences Humaines" },
  ],
};

export const fieldsByEntity: Record<string, { name: string; icon: string }[]> = {
  IFRI: [
    { name: "Génie Logiciel", icon: "💻" },
    { name: "Sécurité Informatique", icon: "🛡️" },
    { name: "Internet des Objets", icon: "🌐" },
    { name: "Data Science", icon: "📊" },
  ],
  FAST: [
    { name: "Mathématiques", icon: "📐" },
    { name: "Physique", icon: "⚛️" },
    { name: "Chimie", icon: "🧪" },
    { name: "Informatique", icon: "🖥️" },
  ],
};
