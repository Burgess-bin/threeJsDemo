import App from "@/App";
import Earth3D from "@/pages/3DEarth";
import JumpRoll from "@/pages/JumpRoll";
import SilentHouse from "@/pages/SilentHouse";
import Text3D from "@/pages/Text3D";
import { createBrowserRouter, Navigate } from "react-router-dom";

//
export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Navigate to="/text3d" />,
            },
            {
                path: '/text3d',
                element: <Text3D />,
                id: 'Text3d'
            },
            {
                path: '/jumpRoll',
                element: <JumpRoll />,
                id: 'JumpRoll'
            },
            {
                path: '/silentHouse',
                element: <SilentHouse />,
                id: 'SilentHouse'
            },
            {
                path: '/earth3d',
                element: <Earth3D />,
                id: '3D地球'
            }
        ]
    }
])