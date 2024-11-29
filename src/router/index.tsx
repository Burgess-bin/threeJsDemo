import App from "@/App";
import Earth3D from "@/pages/3DEarth";
import Car from "@/pages/Car";
import JumpRoll from "@/pages/JumpRoll";
import Mirror from "@/pages/Mirror";
import Pipe from "@/pages/Pipe";
import SilentHouse from "@/pages/SilentHouse";
import Text3D from "@/pages/Text3D";
import TheWindow from "@/pages/TheWindow";
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
                path: '/car',
                element: <Car />,
                id: 'Car'
            },
            {
                path: '/window',
                element: <TheWindow />,
                id: 'Window'
            },
            {
                path: '/mirror',
                element: <Mirror />,
                id: 'mirror'
            },
            {
                path: '/pipe',
                element: <Pipe />,
                id: 'pipe'
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