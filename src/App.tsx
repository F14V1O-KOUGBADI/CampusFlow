import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./app/context/AuthContext";
import { RegistrationProvider } from "./app/context/RegistrationContext";
import { ThemeProvider } from "./app/context/ThemeContext";
import { router } from "./app/routes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RegistrationProvider>
          <RouterProvider router={router} />
        </RegistrationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
