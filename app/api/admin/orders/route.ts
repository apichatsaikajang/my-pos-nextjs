import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // ปรับ path ตามที่พี่เก็บไฟล์ prisma client ไว้ครับ

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true, // ดึงข้อมูลรายการสินค้าในบิลนั้นออกมาด้วย
      },
      orderBy: {
        createdAt: 'desc', // เอาบิลล่าสุดขึ้นก่อน
      },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}