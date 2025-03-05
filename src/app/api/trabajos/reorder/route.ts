import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Trabajo from '@/models/trabajos';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const orderData = await req.json();

    // Validate input
    if (!Array.isArray(orderData)) {
      return NextResponse.json({ 
        message: 'Invalid order data' 
      }, { status: 400 });
    }

    // Bulk update orders
    const bulkOperations = orderData.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));

    await Trabajo.bulkWrite(bulkOperations);

    return NextResponse.json({ 
      message: 'Order updated successfully' 
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error reordering trabajos:', error);

    if (error instanceof Error) {
      return NextResponse.json({ 
        message: 'Failed to reorder trabajos', 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'An unexpected error occurred', 
      error: String(error)
    }, { status: 500 });
  }
}
