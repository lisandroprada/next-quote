'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl,  
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trabajo } from '@/models/trabajos';
import { Trash2, Plus } from 'lucide-react';

// Form field types
const FIELD_TYPES = [
  'number', 
  'text', 
  'select', 
  'checkbox', 
  'date'
] as const;

// Zod schema for form validation
const trabajoSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  status: z.enum(['active', 'archived', 'draft']).default('active'),
  formFields: z.array(z.object({
    name: z.string().min(1, "El nombre del campo es requerido"),
    label: z.string().min(1, "La etiqueta es requerida"),
    fieldType: z.enum(FIELD_TYPES),
    unit: z.string().optional(),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional()
  })).optional()
});

type TrabajoFormValues = z.infer<typeof trabajoSchema>;

interface TrabajoFormDialogProps {
  trabajo?: Trabajo | null;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSuccessAction: () => Promise<void>;
}

export function TrabajoFormDialog({ 
  trabajo, 
  open,
  onOpenChangeAction,
  onSuccessAction 
}: TrabajoFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default or existing trabajo values
  const form = useForm<TrabajoFormValues>({
    resolver: zodResolver(trabajoSchema),
    defaultValues: trabajo ? {
      name: trabajo.name,
      description: trabajo.description || '',
      formFields: trabajo.formFields || [],
      status: trabajo.status || 'active'
    } : {
      name: '',
      description: '',
      formFields: [],
      status: 'active'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'formFields'
  });

  // Reset form when trabajo or open state changes
  useEffect(() => {
    form.reset(trabajo ? {
      name: trabajo.name,
      description: trabajo.description,
      formFields: trabajo.formFields,
      status: trabajo.status
    } : {
      name: '',
      description: '',
      formFields: [],
      status: 'active'
    });
  }, [trabajo, open, form]);

  // Form submission handler
  const onSubmit = async (values: TrabajoFormValues) => {
    setIsSubmitting(true);
    try {
      const url = trabajo 
        ? `/api/trabajos/${trabajo._id}` 
        : '/api/trabajos';
      
      const method = trabajo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          order: trabajo ? trabajo.order : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar el trabajo');
      }

      const responseData = await response.json();

      // Success toast
      toast.success(trabajo 
        ? 'Trabajo actualizado correctamente' 
        : 'Trabajo creado correctamente', {
        description: `ID: ${responseData._id}`,
        duration: 3000
      });

      // Refresh data without closing dialog
      await onSuccessAction();

      // Update form with returned data if editing existing trabajo
      if (trabajo) {
        form.reset({
          ...values,
          ...responseData
        });
      } else {
        // Reset form for new trabajo
        form.reset();
      }
    } catch (error) {
      toast.error('No se pudo guardar el trabajo', {
        description: error instanceof Error ? error.message : 'Error desconocido',
        duration: 3000
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trabajo ? 'Editar Trabajo' : 'Crear Nuevo Trabajo'}
          </DialogTitle>
          <DialogDescription>
            Configure los detalles del trabajo y sus campos de formulario.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Basic Trabajo Details */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Trabajo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Tareas Preliminares" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripción opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Fields Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Campos del Formulario</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => append({
                    name: '',
                    label: '',
                    fieldType: 'text',
                    required: false
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" /> Agregar Campo
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                  <FormField
                    control={form.control}
                    name={`formFields.${index}.name`}
                    render={({ field: inputField }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Nombre del Campo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. superficieTerrenoLimpieza" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`formFields.${index}.label`}
                    render={({ field: inputField }) => (
                      <FormItem className="col-span-5">
                        <FormLabel>Etiqueta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Superficie a Limpiar (m²)" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`formFields.${index}.fieldType`}
                    render={({ field: selectField }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Tipo</FormLabel>
                        <Select 
                          onValueChange={selectField.onChange} 
                          defaultValue={selectField.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FIELD_TYPES.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-1 flex items-end justify-end">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon"
                      className="justify-self-end"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Optional: Add conditional fields based on field type */}
              {fields.map((field, index) => {
                const fieldType = form.watch(`formFields.${index}.fieldType`);
                return (
                  <div key={`${field.id}-options`} className="grid grid-cols-12 gap-3 items-end">
                    {fieldType === 'select' && (
                      <FormField
                        control={form.control}
                        name={`formFields.${index}.options`}
                        render={({ field: optionsField }) => (
                          <FormItem className="col-span-12">
                            <FormLabel>Opciones (separadas por coma)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ej. Desmalezado Manual, Desmalezado Mecánico, Mixto" 
                                value={optionsField.value?.join(', ') || ''}
                                onChange={(e) => {
                                  const options = e.target.value.split(',').map(opt => opt.trim()).filter(Boolean);
                                  optionsField.onChange(options);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChangeAction(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {trabajo ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
