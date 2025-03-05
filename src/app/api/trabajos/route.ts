import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Trabajo from '@/models/trabajos';
import { z } from 'zod';

// Zod schema for validation
const trabajoSchema = z.object({
  name: z.string().min(1, "Name is required"),
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

// GET all trabajos
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse query parameters for pagination and sorting
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'order';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const skip = (page - 1) * limit;

    const trabajos = await Trabajo.find()
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const total = await Trabajo.countDocuments();

    return NextResponse.json({
      trabajos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching trabajos:', error);

    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Failed to fetch trabajos', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'An unexpected error occurred', 
      error: String(error)
    }, { status: 500 });
  }
}

// POST new trabajo
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Parse and validate request body
    const body = await req.json();
    const validatedData = trabajoSchema.parse(body);

    // Create new trabajo
    const nuevoTrabajo = new Trabajo({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await nuevoTrabajo.save();

    return NextResponse.json(nuevoTrabajo, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating trabajo:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: error.errors 
      }, { status: 400 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Failed to create trabajo', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'An unexpected error occurred', 
      error: String(error)
    }, { status: 500 });
  }
}

// PUT (update) trabajo
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Parse query to get trabajo ID
    const { searchParams } = new URL(req.url);
    const trabajoId = searchParams.get('id');

    if (!trabajoId) {
      return NextResponse.json({ message: 'Trabajo ID is required' }, { status: 400 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = trabajoSchema.partial().parse(body);

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

    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        message: 'Validation failed', 
        errors: error.errors 
      }, { status: 400 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Failed to update trabajo', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'An unexpected error occurred', 
      error: String(error)
    }, { status: 500 });
  }
}

// DELETE trabajo
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    // Parse query to get trabajo ID
    const { searchParams } = new URL(req.url);
    const trabajoId = searchParams.get('id');

    if (!trabajoId) {
      return NextResponse.json({ message: 'Trabajo ID is required' }, { status: 400 });
    }

    // Find and delete trabajo
    const trabajoEliminado = await Trabajo.findByIdAndDelete(trabajoId);

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
