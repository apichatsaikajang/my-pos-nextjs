import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ดึงค่า Cookie เพื่อเช็คสถานะการ Login
  const isLoggedIn = request.cookies.get('isLoggedIn')
  const isPathAdmin = request.nextUrl.pathname.startsWith('/admin')

  // ถ้าพยายามเข้าหน้า Admin แต่ยังไม่ได้ Login ให้ส่งกลับไปหน้า /login
  if (isPathAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// กำหนดให้ Middleware ตรวจสอบเฉพาะเส้นทาง /admin เท่านั้น
export const config = {
  matcher: '/admin/:path*',
}