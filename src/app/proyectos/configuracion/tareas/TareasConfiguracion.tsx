'use client';

import React, { useState, useEffect } from 'react';
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
  arrayMove, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy, 
  SortableContext 
} from '@dnd-kit/sortable';
import { 
  restrictToVerticalAxis, 
  restrictToParentElement 
} from '@dnd-kit/modifiers';
import { toast } from 'sonner';

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
      const oldIndex = trabajos.findIndex(trabajo => trabajo._id === active.id);
      const newIndex = trabajos.findIndex(trabajo => trabajo._id === over?.id);

      // Create a new array with the item moved to its new position
      const reorderedTrabajos = [...trabajos];
      const [removedItem] = reorderedTrabajos.splice(oldIndex, 1);
      reorderedTrabajos.splice(newIndex, 0, removedItem);

      // Recalculate orders based on new array position
      const updatedTrabajos = reorderedTrabajos.map((trabajo, index) => ({
        ...trabajo,
        order: index + 1
      }));

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
            id: trabajo._id,
            order: trabajo.order
          })))
        });

        if (!response.ok) {
          throw new Error('Failed to update order');
        }

        toast.success('Orden de trabajos actualizado');
      } catch (error) {
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
      // Create a new trabajo with the same details, excluding _id and order
      const { _id, order, ...trabajoToDuplicate } = trabajo;
      
      const response = await fetch('/api/trabajos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trabajoToDuplicate,
          name: `${trabajoToDuplicate.name} (Copia)`,
          order: trabajos.length + 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate trabajo');
      }

      toast.success('Trabajo duplicado');
      fetchTrabajos();
    } catch (error) {
      toast.error('No se pudo duplicar el trabajo');
      console.error(error);
    }
  };

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initial fetch
  useEffect(() => {
    fetchTrabajos();
  }, []);

  // Open dialog for editing
  const handleEditTrabajo = (trabajo: Trabajo) => {
    setSelectedTrabajo(trabajo);
    setIsDialogOpen(true);
  };

  // Open dialog for creating new trabajo
  const handleCreateTrabajo = () => {
    setSelectedTrabajo(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreateTrabajo}>
          Crear Nuevo Trabajo
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext 
          items={trabajos.map(trabajo => trabajo._id)} 
          strategy={rectSortingStrategy}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trabajos.map((trabajo) => (
                <SortableRow 
                  key={trabajo._id} 
                  trabajo={trabajo}
                  onEdit={() => handleEditTrabajo(trabajo)}
                  onDelete={() => handleDeleteTrabajo(trabajo._id)}
                  onDuplicate={() => handleDuplicateTrabajo(trabajo)}
                  isDuplicateActionEnabled={true}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>

      <TrabajoFormDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        trabajo={selectedTrabajo}
        onSuccess={fetchTrabajos}
      />
    </div>
  );
}
