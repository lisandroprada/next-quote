import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/Quote';

export async function GET() {
  try {
    await dbConnect();
    const quotes = await Quote.find({})
      .populate('client', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching quotes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const quote = await Quote.create(body);
    return NextResponse.json(quote, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Error creating quote' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error creating quote' },
      { status: 400 }
    );
  }
}
