import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import mongoose from 'mongoose';

function requireRole(allowedRoles, userRole) {
  return allowedRoles.includes(userRole);
}

// GET single order
export async function GET(req, { params }) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const role = req.headers.get('x-user-role') || 'user';
    const username = req.headers.get('x-user-name') || '';
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (role !== 'admin' && order.username !== username && order.createdBy !== username) {
      return NextResponse.json(
        { error: 'Forbidden: cannot access this order' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update order
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const role = req.headers.get('x-user-role') || 'user';

    if (!requireRole(['admin'], role)) {
      return NextResponse.json(
        { error: 'Forbidden: insufficient permissions' },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const body = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, body, { new: true });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE order
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const role = req.headers.get('x-user-role') || 'user';

    if (!requireRole(['admin'], role)) {
      return NextResponse.json(
        { error: 'Forbidden: insufficient permissions' },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await Order.findByIdAndDelete(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
