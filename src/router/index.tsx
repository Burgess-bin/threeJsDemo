import App from "@/App";
import JumpRoll from "@/pages/JumpRoll";
import SilentHouse from "@/pages/SilentHouse";
import Text3D from "@/pages/Text3D";
import { createBrowserRouter, Navigate } from "react-router-dom";

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
            }
        ]
    }
])