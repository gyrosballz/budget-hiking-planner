import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models';

function requireRole(allowedRoles, userRole) {
  return allowedRoles.includes(userRole);
}

function validateProductInput(product) {
  const { name, price, stock, category } = product;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Product name is required and must be a string');
  }

  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }

  if (typeof stock !== 'number' || stock < 0) {
    throw new Error('Stock must be a non-negative number');
  }

  if (category && (typeof category !== 'string' || category.trim().length === 0)) {
    throw new Error('Category must be a non-empty string if provided');
  }

  return true;
}

// GET all products
export async function GET(req) {
  try {
    await connectDB();
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create product
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
    validateProductInput(body);

    const product = new Product({
      ...body,
      createdBy: body.createdBy || 'system',
    });

    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
