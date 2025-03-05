import React from 'react';
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import { Card } from "@/components/ui/card";

const ConfiguracionPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <AppBreadcrumb 
                paths={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Proyectos', href: '/proyectos' },
                    { label: 'Configuración', isCurrentPage: true }
                ]} 
            />
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-4">Configuración de Proyectos</h1>
                <div className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Configuraciones Generales</h2>
                        <p className="text-muted-foreground">
                            Gestiona las configuraciones básicas de tus proyectos.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Opciones Disponibles</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Parámetros de Proyecto</li>
                            <li>Configuración de Equipo</li>
                            <li>Preferencias de Presupuesto</li>
                        </ul>
                    </section>
                </div>
            </Card>
        </div>
    );
};

export default ConfiguracionPage;
