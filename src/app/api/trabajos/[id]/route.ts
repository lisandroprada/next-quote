import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Trabajo from '@/models/trabajos';
import { z } from 'zod';

// Zod schema for validation (reuse from the main route)
const trabajoSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  formFields: z.array(z.object({
    name: z.string().min(1, "Field name is required"),
    label: z.string().min(1, "Field label is required"),
    fieldType: z.enum(['number', 'text', 'select', 'checkbox', 'date']),
    unit: z.string().optional(),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional()
  })).optional(),
  order: z.number().optional()
});

// GET a specific trabajo by ID
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const trabajo = await Trabajo.findById(params.id);

    if (!trabajo) {
      return NextResponse.json({ message: 'Trabajo not found' }, { status: 404 });
    }

    return NextResponse.json(trabajo, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching trabajo:', error);

    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Failed to fetch trabajo', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'An unexpected error occurred', 
      error: String(error)
    }, { status: 500 });
  }
}

// PUT (update) a specific trabajo
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Parse and validate request body
    const body = await req.json();
    const validatedData = trabajoSchema.partial().parse(body);

    // Await params.id
    const trabajoId = await params.id;

    // Find and update trabajo
    const trabajoActualizado = await Trabajo.findByIdAndUpdate(
      trabajoId, 
      { 
        ...validatedData, 
        updatedAt: new Date() 
      }, 
      { new: true, runValidators: true }
    );

    if (!trabajoActualizado) {
      return NextResponse.json({ message: 'Trabajo not found' }, { status: 404 });
    }

    return NextResponse.json(trabajoActualizado, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating trabajo:', error);
    
    // More detailed error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Validation Error', 
        errors: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}

// DELETE a specific trabajo
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    // Find and delete trabajo
    const trabajoEliminado = await Trabajo.findByIdAndDelete(params.id);

    if (!trabajoEliminado) {
      return NextResponse.json({ message: 'Trabajo not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Trabajo deleted successfully',
      deletedTrabajo: trabajoEliminado 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting trabajo:', error);

    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Failed to delete trabajo', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'An unexpected error occurred', 
      error: String(error)
    }, { status: 500 });
  }
}
