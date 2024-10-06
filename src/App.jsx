import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/layouts/MainLayout";
import TeacherOrAdminRoute from "./components/PrivateRoutes/TeacherOrAdminRoute";
import TeacherRoute from "./components/PrivateRoutes/TeacherRoute";
import { AuthProvider } from "./context/AuthContext";
import AvisosPage from "./pages/AvisosPage";
import DisciplinasPage from "./pages/DisciplinasPage";
import EstudantePage from "./pages/EstudantePage";
import EstudantesPage from "./pages/EstudantesPage";
import FaltasPage from "./pages/FaltasPage";
import HorariosPage from "./pages/HorariosPage";
import LoginPage from "./pages/LoginPage";
import ProfessoresPage from "./pages/ProfessoresPage";
import TurmasPage from "./pages/TurmasPage";
import TurmaPage from "./pages/TurmaPage";

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                <Route path="/" element={<TeacherOrAdminRoute />}>
                    <Route path="/" element={<MainLayout />}>
                        <Route path="/estudante/:id" element={<EstudantePage />}></Route>
                        <Route path="/estudantes" element={<EstudantesPage />}></Route>
                        <Route path="/turma/:id" element={<TurmaPage />}></Route>
                        <Route path="/turmas" element={<TurmasPage />}></Route>
                        <Route path="/professores" element={<ProfessoresPage />}></Route>
                        <Route path="/horarios" element={<HorariosPage />}></Route>
                        <Route path="/avisos" element={<AvisosPage />}></Route>
                        <Route path="/disciplinas" element={<DisciplinasPage />}></Route>

                        <Route element={<TeacherRoute />}>
                            <Route path="/faltas" element={<FaltasPage />}></Route>
                        </Route>
                    </Route>
                </Route>
                <Route path="/login" element={<LoginPage />}></Route>
            </Route>
        )
    );
    return (
        <>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <Toaster />
        </>
    );
}
