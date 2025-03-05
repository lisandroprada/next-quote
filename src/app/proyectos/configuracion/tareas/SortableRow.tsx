'use client';

import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Copy 
} from 'lucide-react';
import { Trabajo } from '@/models/trabajos';

interface SortableRowProps {
  trabajo: Trabajo;
  onEditAction: () => void;
  onDeleteAction: () => void;
  onDuplicateAction?: () => void;
  isDuplicateActionEnabled?: boolean;
}

export function SortableRow({ 
  trabajo, 
  onEditAction, 
  onDeleteAction, 
  onDuplicateAction, 
  isDuplicateActionEnabled = false 
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: trabajo._id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-move"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{trabajo.order}</TableCell>
      <TableCell>{trabajo.name}</TableCell>
      <TableCell>{trabajo.description}</TableCell>
      <TableCell className="text-center">{trabajo.formFields?.length || 0}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onEditAction}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {onDuplicateAction && isDuplicateActionEnabled && (
              <DropdownMenuItem onSelect={onDuplicateAction}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={onDeleteAction} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
