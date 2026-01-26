import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Plan } from '@/lib/models';

function requireRole(allowedRoles, userRole) {
  return allowedRoles.includes(userRole);
}

function validatePlanInput(plan) {
  const { name, distance, duration, difficulty, budget } = plan;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Plan name is required and must be a string');
  }

  if (typeof distance !== 'number' || distance <= 0) {
    throw new Error('Distance must be a positive number');
  }

  if (typeof duration !== 'number' || duration <= 0) {
    throw new Error('Duration must be a positive number');
  }

  if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    throw new Error('Difficulty must be Easy, Medium, or Hard');
  }

  if (typeof budget !== 'number' || budget < 0) {
    throw new Error('Budget must be a non-negative number');
  }

  return true;
}

// GET all plans
export async function GET(req) {
  try {
    await connectDB();
    const plans = await Plan.find();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create plan (seller/admin only)
export async function POST(req) {
  try {
    await connectDB();

    const role = req.headers.get('x-user-role') || 'user';

    if (!requireRole(['seller', 'admin'], role)) {
      return NextResponse.json(
        { error: 'Forbidden: insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    validatePlanInput(body);

    const plan = new Plan({
      ...body,
      createdBy: body.createdBy || 'system',
    });

    await plan.save();
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
