import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto' // เพิ่มการนำเข้าสำหรับสุ่ม ID

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'ดึงข้อมูลไม่สำเร็จ' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // ตรวจสอบว่ามีข้อมูลครบไหม
    if (!body.username || !body.password || !body.name) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(), // สร้าง ID แบบสุ่มเพื่อให้ไม่ติด Error 500
        username: body.username,
        password: body.password,
        name: body.name,
        role: body.role || 'STAFF',
      }
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error(error) // ดู Error จริงใน Terminal ของ VS Code
    return NextResponse.json({ error: 'ไม่สามารถเพิ่ม User ได้' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
    
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'ลบข้อมูลไม่สำเร็จ' }, { status: 500 })
  }
}