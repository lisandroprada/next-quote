import React from 'react';
import Link from 'next/link';
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";

const ProyectosMenu: React.FC = () => {
    return (
        <div>
            <AppBreadcrumb 
                paths={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Proyectos', isCurrentPage: true }
                ]} 
            />
            <h1>Proyectos</h1>
            <ul>
                <li><Link href="/proyectos/nuevo/presupuesto">Presupuesto</Link></li>
                <li><Link href="/proyectos/nuevo/configuracion">Configuración</Link></li>
            </ul>
        </div>
    );
};

export default ProyectosMenu;
