import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';

// GET all orders
export async function GET(req) {
  try {
    await connectDB();

    const role = req.headers.get('x-user-role') || 'user';
    const username = req.headers.get('x-user-name') || '';

    let query = {};

    if (role === 'admin') {
      // Admins see all orders
    } else if (role === 'seller') {
      query.createdBy = username;
    } else {
      query.username = username;
    }

    const orders = await Order.find(query);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create order
export async function POST(req) {
  try {
    await connectDB();

    const username = req.headers.get('x-user-name') || 'guest';
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    const order = new Order({
      username,
      items,
      totalPrice: items.reduce((sum, item) => sum + (item.price || 0), 0),
      status: 'Pending',
    });

    await order.save();
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
