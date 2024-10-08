import { useEffect } from 'react';
import { World } from './World';
const Earth3D = () => {
    //ref

    useEffect(() => {
        const world = new World(document.getElementById('earth-3d') as HTMLDivElement);

        return () => {
            world.dispose();
        }
    }, [])


    return (
        <div id='earth-3d' style={{ width: '100%', height: '100%' }} />
    )
};

export default Earth3D;