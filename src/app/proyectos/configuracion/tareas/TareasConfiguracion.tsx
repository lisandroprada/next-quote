'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates, 
  rectSortingStrategy, 
  SortableContext 
} from '@dnd-kit/sortable';
import { 
  restrictToVerticalAxis, 
  restrictToParentElement 
} from '@dnd-kit/modifiers';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

import { TrabajoFormDialog } from './TrabajoFormDialog';
import { SortableRow } from './SortableRow';
import { Trabajo } from '@/models/trabajos';

export default function TareasConfiguracion() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState<Trabajo | null>(null);

  // Fetch trabajos
  const fetchTrabajos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/trabajos');
      if (!response.ok) {
        throw new Error('Failed to fetch trabajos');
      }
      const data = await response.json();
      setTrabajos(data.trabajos.sort((a: Trabajo, b: Trabajo) => a.order - b.order));
    } catch (error) {
      toast.error('No se pudieron cargar los trabajos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag and drop
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      // Find the indices of the dragged and target items
      const oldIndex = trabajos.findIndex(trabajo => trabajo._id.toString() === active.id);
      const newIndex = trabajos.findIndex(trabajo => trabajo._id.toString() === over?.id);

      // Create a new array with the item moved to its new position
      const reorderedTrabajos = [...trabajos];
      const [removedItem] = reorderedTrabajos.splice(oldIndex, 1);
      reorderedTrabajos.splice(newIndex, 0, removedItem);

      // Recalculate orders based on new array position
      const updatedTrabajos = reorderedTrabajos.map((trabajo, index): Trabajo => {
        // Convert Mongoose document to plain object
        const plainTrabajo = trabajo.toObject ? trabajo.toObject() : trabajo;
        return {
          ...plainTrabajo,
          order: index + 1
        };
      });

      // Optimistic UI update
      setTrabajos(updatedTrabajos);

      try {
        // Send reorder request to backend
        const response = await fetch('/api/trabajos/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTrabajos.map((trabajo) => ({
            id: trabajo._id.toString(),
            order: trabajo.order
          })))
        });

        if (!response.ok) {
          throw new Error('Failed to update order');
        }

        toast.success('Orden de trabajos actualizado');
      } catch (_error) {
        console.error(_error);
        toast.error('No se pudo actualizar el orden');
        // Revert optimistic update
        fetchTrabajos();
      }
    }
  };

  // Delete trabajo
  const handleDeleteTrabajo = async (id: string) => {
    try {
      const response = await fetch(`/api/trabajos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete trabajo');
      }

      toast.success('Trabajo eliminado');
      fetchTrabajos();
    } catch (error) {
      toast.error('No se pudo eliminar el trabajo');
      console.error(error);
    }
  };

  // Duplicate trabajo
  const handleDuplicateTrabajo = async (trabajo: Trabajo) => {
    try {
      // Explicitly remove and ignore _id, spread remaining properties
      const { _id, ...baseTrabajoData } = trabajo;
      void _id; // Explicitly mark _id as used to suppress warning

      // Prepare duplicated trabajo with incremented order and modified name
      const duplicatedTrabajo = {
        ...baseTrabajoData,
        name: `${baseTrabajoData.name} (Copia)`,
        order: trabajos.length + 1
      };

      const response = await fetch('/api/trabajos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatedTrabajo)
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to duplicate trabajo: ${errorBody}`);
      }

      toast.success('Trabajo duplicado exitosamente');
      fetchTrabajos();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al duplicar el trabajo';
      
      toast.error(errorMessage);
      console.error('Duplicate trabajo error:', error);
    }
  };

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTrabajos();
  }, []);

  // Calculate dashboard metrics
  const trabajosMetrics = useMemo(() => ({
    total: trabajos.length,
    activeTrabajos: trabajos.filter(t => t.status === 'active').length,
    archivedTrabajos: trabajos.filter(t => t.status === 'archived').length,
    draftTrabajos: trabajos.filter(t => t.status === 'draft').length,
    averageItemsPerTrabajo: trabajos.reduce((sum, trabajo) => 
      sum + (trabajo.itemCount ?? 0), 0) / trabajos.length || 0
  }), [trabajos]);

  // Handler for dialog open change
  const handleDialogOpenChange: (open: boolean) => void = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTrabajo(null);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Cargando trabajos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Metrics Card */}
        <Card className="col-span-1 bg-white shadow-lg rounded-xl border-none p-6 space-y-4 transform transition-all hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">Métricas de Trabajos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Trabajos</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 font-medium">
                {trabajosMetrics.total}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Activos</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 font-medium">
                {trabajosMetrics.activeTrabajos}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Archivados</span>
              <Badge variant="outline" className="bg-gray-50 text-gray-600 font-medium">
                {trabajosMetrics.archivedTrabajos}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Borradores</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 font-medium">
                {trabajosMetrics.draftTrabajos}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Trabajos Table Card */}
        <Card className="col-span-3 bg-white shadow-lg rounded-xl border-none p-6 space-y-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">Configuración de Trabajos</CardTitle>
            <Button 
              onClick={() => {
                setSelectedTrabajo(null);
                setIsDialogOpen(true);
              }} 
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Trabajo
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext 
                items={trabajos.map(trabajo => trabajo._id.toString())} 
                strategy={rectSortingStrategy}
              >
                <Table className="w-full">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="w-[100px] text-gray-700">Orden</TableHead>
                      <TableHead className="text-gray-700">Nombre</TableHead>
                      <TableHead className="text-gray-700">Descripción</TableHead>
                      <TableHead className="text-center text-gray-700">Campos</TableHead>
                      <TableHead className="text-right text-gray-700">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trabajos.map((trabajo) => (
                      <SortableRow 
                        key={trabajo._id.toString()} 
                        trabajo={trabajo} 
                        onEditAction={() => {
                          setSelectedTrabajo(trabajo);
                          setIsDialogOpen(true);
                        }}
                        onDeleteAction={() => handleDeleteTrabajo(trabajo._id.toString())}
                        onDuplicateAction={() => handleDuplicateTrabajo(trabajo)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      </div>

      <TrabajoFormDialog 
        open={isDialogOpen}
        onOpenChangeAction={handleDialogOpenChange}
        trabajo={selectedTrabajo}
        onSuccessAction={fetchTrabajos}
      />
    </div>
  );
}
