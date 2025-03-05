import { NextResponse } from 'next/server';
import {dbConnect} from '@/lib/mongodb';
import Quote from '@/models/Quote';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const quote = await Quote.findById(params.id).populate('client', 'name email');
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json(quote);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching quote' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const quote = await Quote.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate('client', 'name email');
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json(quote);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Error updating quote' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error updating quote' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const quote = await Quote.findByIdAndDelete(params.id);
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error deleting quote' },
      { status: 500 }
    );
  }
}
