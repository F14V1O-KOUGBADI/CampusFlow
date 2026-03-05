import React, { createContext, useContext, useState } from "react";

export interface University {
  sigle: string;
  name: string;
  location: string;
  domain: string;
}

export interface Entity {
  sigle: string;
  name: string;
}

export interface Field {
  name: string;
  icon: string;
}

interface RegistrationData {
  role: "student" | "professor" | null;
  university: University | null;
  entity: Entity | null;
  field: Field | null;
  fullName: string;
  email: string;
  password: string;
}

interface RegistrationContextType {
  data: RegistrationData;
  updateRole: (role: "student" | "professor") => void;
  updateUniversity: (uni: University) => void;
  updateEntity: (ent: Entity) => void;
  updateField: (field: Field) => void;
  updateAccountInfo: (info: Partial<RegistrationData>) => void;
  resetRegistration: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialData: RegistrationData = {
  role: null,
  university: null,
  entity: null,
  field: null,
  fullName: "",
  email: "",
  password: "",
};

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RegistrationData>(initialData);

  const updateRole = (role: "student" | "professor") => {
    setData((prev) => ({ ...prev, role }));
  };

  const updateUniversity = (university: University) => {
    setData((prev) => ({ ...prev, university, entity: null, field: null }));
  };

  const updateEntity = (entity: Entity) => {
    setData((prev) => ({ ...prev, entity, field: null }));
  };

  const updateField = (field: Field) => {
    setData((prev) => ({ ...prev, field }));
  };

  const updateAccountInfo = (info: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...info }));
  };

  const resetRegistration = () => {
    setData(initialData);
  };

  return (
    <RegistrationContext.Provider
      value={{
        data,
        updateRole,
        updateUniversity,
        updateEntity,
        updateField,
        updateAccountInfo,
        resetRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return context;
}
