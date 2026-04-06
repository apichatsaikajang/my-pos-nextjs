import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: ดึงรายการสินค้าทั้งหมด
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// POST: เพิ่มสินค้าใหม่
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.name) return NextResponse.json({ error: "กรุณาระบุชื่อสินค้า" }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        image: data.image || 'https://placehold.co/400x400?text=No+Image',
        category: data.category,
        priceHot: Number(data.priceHot) || 0,
        priceIce: Number(data.priceIce) || 0,
        priceSpin: Number(data.priceSpin) || 0,
        stock: Number(data.stock) || 0,
      },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: "เพิ่มไม่สำเร็จ", details: error.message }, { status: 500 });
  }
}

// PATCH: แก้ไขข้อมูลสินค้า
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, name, image, category, priceHot, priceIce, priceSpin, stock } = data; // แยก id ออกมา

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        image,
        category,
        priceHot: Number(priceHot) || 0,
        priceIce: Number(priceIce) || 0,
        priceSpin: Number(priceSpin) || 0,
        stock: Number(stock) || 0,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "แก้ไขล้มเหลว" }, { status: 500 });
  }
}

// DELETE: ลบสินค้า
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ไม่พบ ID" }, { status: 400 });

    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: "ลบไม่สำเร็จ" }, { status: 500 });
  }
}