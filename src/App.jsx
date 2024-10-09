import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/layouts/MainLayout";
import TeacherOrAdminRoute from "./components/PrivateRoutes/TeacherOrAdminRoute";
import TeacherRoute from "./components/PrivateRoutes/Redirect";
import { AuthProvider } from "./context/AuthContext";
import AvisosPage from "./pages/AvisosPage";
import DisciplinasPage from "./pages/Admin/DisciplinasPage";
import EstudantePage from "./pages/EstudantePage";
import FaltasPage from "./pages/FaltasPage";
import HorariosPage from "./pages/HorariosPage";
import LoginPage from "./pages/LoginPage";
import ProfessoresPage from "./pages/Admin/ProfessoresPage";
import TurmasPage from "./pages/Admin/TurmasPageAdmin";
import TurmaPage from "./pages/Admin/TurmaPageAdmin";
import EstudantesPageTeacher from "./pages/Teacher/EstudantesPageTeacher";
import Redirect from "./components/PrivateRoutes/Redirect";
import EstudantesPageAdmin from "./pages/Admin/EstudantesPageAdmin";
import TurmaPageTeacher from "./pages/Teacher/TurmaPageTeacher";
import TurmaPageAdmin from "./pages/Admin/TurmaPageAdmin";
import TurmasPageTeacher from "./pages/Teacher/TurmasPageTeacher";
import TurmasPageAdmin from "./pages/Admin/TurmasPageAdmin";

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                <Route path="/" element={<TeacherOrAdminRoute />}>
                    <Route path="/" element={<MainLayout />}>
                        <Route path="/estudante/:id" element={<EstudantePage />}></Route>
                        <Route path="/estudantes" element={<Redirect teacher={<EstudantesPageTeacher />} admin={<EstudantesPageAdmin />} />}></Route>
                        <Route path="/turma/:id" element={<Redirect teacher={<TurmaPageTeacher />} admin={<TurmaPageAdmin />} />}></Route>
                        <Route path="/turmas" element={<Redirect teacher={<TurmasPageTeacher />} admin={<TurmasPageAdmin />} />}></Route>
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
