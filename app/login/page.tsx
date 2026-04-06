'use client'
import { useState } from 'react'
import Swal from 'sweetalert2'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        // แจ้งเตือนความสำเร็จ
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: `สวัสดีคุณ ${data.name || 'ผู้ใช้งาน'}`,
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          // ถ้าเป็น ADMIN ไปหน้าสรุปภาพรวม ถ้าเป็น STAFF ไปหน้าประวัติการขาย
          window.location.href = data.role === 'ADMIN' ? '/admin/summary' : '/admin/orders'
        })
      } else {
        // แจ้งเตือนเมื่อรหัสผิด
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: data.error || 'Username หรือ Password ไม่ถูกต้อง',
          confirmButtonColor: '#ef4444'
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 text-center">
        <div className="bg-blue-600 w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-200">☕</div>
        <h1 className="text-3xl font-black italic uppercase text-slate-900 mb-2">MeetPro Login</h1>
        <p className="text-slate-400 font-bold text-sm mb-8 uppercase tracking-widest">Coffee POS Management</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 ml-4 uppercase">Username</label>
            <input
              type="text"
              placeholder="ผู้ใช้งาน"
              className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none font-bold transition-all"
              onChange={e => setForm({...form, username: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 ml-4 uppercase">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none font-bold transition-all"
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}