import React from 'react';
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PresupuestoPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <AppBreadcrumb 
                paths={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Proyectos', href: '/proyectos' },
                    { label: 'Presupuesto', isCurrentPage: true }
                ]} 
            />
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestión de Presupuestos</h1>
                    <Button>Nuevo Presupuesto</Button>
                </div>
                <div className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Resumen</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-muted p-4 rounded">
                                <p className="text-muted-foreground">Total Presupuestado</p>
                                <p className="text-lg font-bold">$0.00</p>
                            </div>
                            <div className="bg-muted p-4 rounded">
                                <p className="text-muted-foreground">Proyectos Activos</p>
                                <p className="text-lg font-bold">0</p>
                            </div>
                            <div className="bg-muted p-4 rounded">
                                <p className="text-muted-foreground">Presupuestos Pendientes</p>
                                <p className="text-lg font-bold">0</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Acciones Rápidas</h2>
                        <div className="flex space-x-4">
                            <Button variant="outline">Importar Presupuesto</Button>
                            <Button variant="outline">Exportar Informes</Button>
                        </div>
                    </section>
                </div>
            </Card>
        </div>
    );
};

export default PresupuestoPage;