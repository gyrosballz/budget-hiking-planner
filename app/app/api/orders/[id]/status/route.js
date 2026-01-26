import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/lib/models';
import mongoose from 'mongoose';

function requireRole(allowedRoles, userRole) {
  return allowedRoles.includes(userRole);
}

const VALID_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_WORKFLOW = {
  Pending: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

// PUT update order status
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

    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const allowedTransitions = STATUS_WORKFLOW[order.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${order.status} to ${status}. Allowed: ${allowedTransitions.join(', ')}`,
        },
        { status: 400 }
      );
    }

    order.status = status;
    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
