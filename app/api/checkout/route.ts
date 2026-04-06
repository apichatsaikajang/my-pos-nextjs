import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'ไม่มีสินค้าในตะกร้า' }, { status: 400 });
    }

    // กรองเอาเฉพาะสินค้าที่เป็นหมวด BAKERY เท่านั้นมาตัดสต็อก
    const bakeryItems = items.filter((item: any) => item.category.toUpperCase() === 'BAKERY');

    if (bakeryItems.length > 0) {
      // ใช้ Transaction เพื่อความปลอดภัยในการเขียนข้อมูล
      await prisma.$transaction(
        bakeryItems.map((item: any) =>
          prisma.product.update({
            where: { id: item.id },
            data: { 
              stock: { decrement: 1 } // ลดสต็อกลง 1 ชิ้น
            },
          })
        )
      );
    }

    return NextResponse.json({ message: 'บันทึกรายการและตัดสต็อกเบเกอรี่สำเร็จ' });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตัดสต็อก' }, { status: 500 });
  }
}