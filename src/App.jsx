import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from "react-router-dom";

import React from "react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/layouts/MainLayout";
import EstudantesPage from "./pages/EstudantesPage";
import TurmasPage from "./pages/TurmasPage";
import ProfessoresPage from "./pages/ProfessoresPage";
import HorariosPage from "./pages/HorariosPage";
import AvisosPage from "./pages/AvisosPage";
import FaltasPage from "./pages/FaltasPage";


export default function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout></MainLayout>}>
                <Route path="/estudantes" element={<EstudantesPage/>}></Route>
                <Route path="/turmas" element={<TurmasPage/>}></Route>
                <Route path="/professores" element={<ProfessoresPage/>}></Route>
                <Route path="/horarios" element={<HorariosPage/>}></Route>
                <Route path="/avisos" element={<AvisosPage/>}></Route>
                <Route path="/faltas" element={<FaltasPage/>}></Route>
            </Route>
        )
    );
    return <RouterProvider router={router}/>
}
