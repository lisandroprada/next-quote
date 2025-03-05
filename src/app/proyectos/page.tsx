import React from 'react';
import Link from 'next/link';

const ProyectosMenu: React.FC = () => {
    return (
        <div>
            <h1>Proyectos</h1>
            <ul>
                <li><Link href="/proyectos/nuevo/presupuesto">Presupuesto</Link></li>
                <li><Link href="/proyectos/nuevo/configuracion">Configuración</Link></li>
            </ul>
        </div>
    );
};

export default ProyectosMenu;
