import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { username }
    })

    // ตรวจสอบรหัสผ่าน (ในระบบจริงควรใช้ bcrypt เพื่อความปลอดภัย)
    if (user && user.password === password) {
      const response = NextResponse.json({ 
        success: true, 
        role: user.role,
        name: user.name 
      })
      
      // แก้ไข: ใช้ maxAge (A ตัวใหญ่) เพื่อป้องกัน Build Error
      response.cookies.set('isLoggedIn', 'true', { 
        path: '/', 
        maxAge: 86400 // 1 วัน
      })
      
      response.cookies.set('userRole', user.role, { 
        path: '/', 
        maxAge: 86400 
      })

      return response
    }

    return NextResponse.json(
      { error: 'Username หรือ Password ไม่ถูกต้อง' }, 
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    )
  }
}