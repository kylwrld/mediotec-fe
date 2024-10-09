import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/layouts/MainLayout";
import Redirect from "./components/PrivateRoutes/Redirect";
import TeacherOrAdminRoute from "./components/PrivateRoutes/TeacherOrAdminRoute";
import { AuthProvider } from "./context/AuthContext";
import DisciplinasPage from "./pages/Admin/DisciplinasPage";
import EstudantesPageAdmin from "./pages/Admin/EstudantesPageAdmin";
import ProfessoresPage from "./pages/Admin/ProfessoresPage";
import TurmaPageAdmin from "./pages/Admin/TurmaPageAdmin";
import TurmasPageAdmin from "./pages/Admin/TurmasPageAdmin";
import AvisosPage from "./pages/AvisosPage";
import EstudantePage from "./pages/EstudantePage";
import FaltasPage from "./pages/FaltasPage";
import HorariosPage from "./pages/HorariosPage";
import LoginPage from "./pages/LoginPage";
import EstudantesPageTeacher from "./pages/Teacher/EstudantesPageTeacher";
import TurmaPageTeacher from "./pages/Teacher/TurmaPageTeacher";
import TurmasPageTeacher from "./pages/Teacher/TurmasPageTeacher";
import OnlyAdminRoute from "./components/PrivateRoutes/OnlyAdminRoute";

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<TeacherOrAdminRoute />}>
                        <Route path="/estudante/:id" element={<EstudantePage />}></Route>
                        <Route path="/estudantes" element={<Redirect teacher={<EstudantesPageTeacher />} admin={<EstudantesPageAdmin />} />}></Route>
                        <Route path="/turma/:id" element={<Redirect teacher={<TurmaPageTeacher />} admin={<TurmaPageAdmin />} />}></Route>
                        <Route path="/turmas" element={<Redirect teacher={<TurmasPageTeacher />} admin={<TurmasPageAdmin />} />}></Route>
                        <Route path="/avisos" element={<AvisosPage />}></Route>
                        
                        <Route path="/faltas" element={<FaltasPage />}></Route>
                        <Route path="/horarios" element={<HorariosPage />}></Route>
                    </Route>
                    <Route path="/" element={<OnlyAdminRoute />}>
                        <Route path="/professores" element={<ProfessoresPage />}></Route>
                        <Route path="/disciplinas" element={<DisciplinasPage />}></Route>
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
