import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // บันทึกลงตาราง order (id, totalAmount, createdAt, updatedAt)
    const newOrder = await prisma.order.create({
      data: {
        totalAmount: body.totalAmount,
      },
    });
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'บันทึกลงฐานข้อมูลไม่ได้' }, { status: 500 });
  }
}