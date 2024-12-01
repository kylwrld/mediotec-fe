import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/layouts/MainLayout";
import OnlyAdminRoute from "./components/PrivateRoutes/OnlyAdminRoute";
import Redirect from "./components/PrivateRoutes/Redirect";
import TeacherOrAdminRoute from "./components/PrivateRoutes/TeacherOrAdminRoute";
import { AuthProvider } from "./context/AuthContext";
import DisciplinaPageAdmin from "./pages/Admin/DisciplinaPageAdmin";
import DisciplinasPageAdmin from "./pages/Admin/DisciplinasPageAdmin";
import EstudantesPageAdmin from "./pages/Admin/EstudantesPageAdmin";
import HorariosPageAdmin from "./pages/Admin/HorariosPageAdmin";
import ProfessoresPageAdmin from "./pages/Admin/ProfessoresPageAdmin";
import TurmaPageAdmin from "./pages/Admin/TurmaPageAdmin";
import TurmasPageAdmin from "./pages/Admin/TurmasPageAdmin";
import AvisosPage from "./pages/AvisosPage";
import EstudantePage from "./pages/EstudantePage";
import FaltasPage from "./pages/FaltasPage";
import LoginPage from "./pages/LoginPage";
import EstudantesPageTeacher from "./pages/Teacher/EstudantesPageTeacher";
import TurmaPageTeacher from "./pages/Teacher/TurmaPageTeacher";
import TurmasPageTeacher from "./pages/Teacher/TurmasPageTeacher";
import ProfessorPageTeacher from "./pages/Teacher/ProfessorPageTeacher";
import AdminsPageAdmin from "./pages/Admin/AdminsPageAdmin";
import ProfessorPageAdmin from "./pages/Admin/ProfessorPageAdmin";
import AvisoPage from "./pages/AvisoPage";

export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<TeacherOrAdminRoute />}>
                        <Route path="/estudante/:id" element={<EstudantePage />}></Route>
                        <Route
                            path="/estudantes"
                            element={
                                <Redirect teacher={<EstudantesPageTeacher />} admin={<EstudantesPageAdmin />} />
                            }></Route>
                        <Route
                            path="/turma/:id"
                            element={<Redirect teacher={<TurmaPageTeacher />} admin={<TurmaPageAdmin />} />}></Route>
                        <Route
                            path="/turmas"
                            element={<Redirect teacher={<TurmasPageTeacher />} admin={<TurmasPageAdmin />} />}></Route>
                        <Route
                            path="/professor/:id"
                            element={<Redirect teacher={<ProfessorPageTeacher />} admin={<ProfessorPageAdmin />}/>}></Route>
                        <Route path="/avisos" element={<AvisosPage />}></Route>
                        <Route path="/aviso/:id" element={<AvisoPage />}></Route>

                        <Route path="/faltas" element={<FaltasPage />}></Route>
                    </Route>
                    <Route path="/" element={<OnlyAdminRoute />}>
                        <Route path="/horarios" element={<HorariosPageAdmin />}></Route>
                        <Route path="/professores" element={<ProfessoresPageAdmin />}></Route>
                        <Route path="/disciplinas" element={<DisciplinasPageAdmin />}></Route>
                        <Route path="/disciplina/:id" element={<DisciplinaPageAdmin />}></Route>
                        <Route path="/admins" element={<AdminsPageAdmin />}></Route>
                    </Route>
                </Route>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route index element={<Navigate to="/estudantes" />}></Route>
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
