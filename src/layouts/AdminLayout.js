import React, { useEffect, useState } from 'react'
import Header from './admin/Header'
import MobileScreen from '../pages/MobileScreen';
import { widthResolutionAllowed } from '../constants/constants';

const AdminLayout = ({ children }) => {
    const [resolution, setResolution] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setResolution({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return resolution.width < widthResolutionAllowed ? <MobileScreen /> :
        <>
            <Header />
            {children}
        </>
}

export default AdminLayout
