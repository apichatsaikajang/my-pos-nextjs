import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // คำนวณยอดขายรวม
    const totalSales = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    });

    // นับจำนวนออเดอร์
    const totalOrders = await prisma.order.count();

    return NextResponse.json({
      totalSales: totalSales._sum.totalAmount || 0,
      totalOrders: totalOrders || 0
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}