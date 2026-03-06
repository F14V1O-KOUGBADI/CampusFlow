export interface UniversityRooms {
  university: string;
  campus?: string;
  rooms: string[];
}

export const UNIVERSITY_ROOMS: UniversityRooms[] = [
  {
    university: "Université d'Abomey-Calavi (UAC)",
    campus: "Abomey-Calavi",
    rooms: [
      "Amphi Ouattara 1",
      "Amphi Ouattara 2",
      "Amphi Ouattara 3",
      "Amphi UEMOA",
      "Amphi Idriss Deby Itno",
      "Amphi Fakambi",
      "Amphi A750",
      "Amphi B750",
      "Amphi B1000",
      "Salle Agro 1",
      "Salle Agro 2",
      "Salle Agro 3",
      "Salle Agro 4",
      "Salle Agro 5",
      "Salle Agro 8",
      "Salle G1",
      "Salle G2",
      "Salle G3",
      "Salle Wekenon",
      "Salle LEA rdc",
      "Salle LEA R1",
      "Salle multimédia Pro-RUWA/UAC",
      "Salle audiovisuelle EPAC",
      "Salle de cours R+1"
    ]
  },
  {
    university: "Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques (UNSTIM)",
    campus: "Lokossa",
    rooms: [
      "Amphi 1 (Lokossa)",
      "Salle B3 (Lokossa)",
      "Atelier Génie Civil",
      "Atelier Électrotechnique",
      "Atelier Informatique Industrielle",
      "Atelier Énergies Renouvelables",
      "Atelier Chimie",
      "Atelier Froid et Climatisation",
      "Atelier Maintenance Électronique",
      "Bibliothèque INSTI",
      "Salle Informatique (80 postes)"
    ]
  },
  {
    university: "Université de Parakou (UP)",
    campus: "Parakou",
    rooms: [
      "Amphi RDC",
      "Amphi 1000",
      "Salle 12",
      "Salle 13",
      "Salle 14",
      "Salle 19",
      "Amphi 1",
      "Amphi 2",
      "Amphi 3",
      "Amphi 4",
      "Amphi 5",
      "Salle Numérique IUT",
      "Salle Numérique CPSA"
    ]
  }
];
