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
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}

export function SortableRow({ trabajo, onEdit, onDelete, onDuplicate }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: trabajo._id });

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
          className="cursor-move flex items-center"
        >
          <GripVertical className="mr-2 text-muted-foreground" />
          {trabajo.order}
        </div>
      </TableCell>
      <TableCell>{trabajo.name}</TableCell>
      <TableCell>{trabajo.description}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                onEdit();
              }}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {onDuplicate && (
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  onDuplicate();
                }}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
