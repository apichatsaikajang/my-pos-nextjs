'use client'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'STAFF' })

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'เพิ่มผู้ใช้งานเรียบร้อยแล้ว',
        confirmButtonColor: '#2563eb'
      })
      setForm({ username: '', password: '', name: '', role: 'STAFF' })
      fetchUsers()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ล้มเหลว',
        text: 'ไม่สามารถเพิ่มข้อมูลได้ (Username นี้อาจมีในระบบแล้ว)',
        confirmButtonColor: '#ef4444'
      })
    }
  }

  const handleDelete = async (id: string, username: string) => {
    // ป้องกันการลบตัวเอง (Admin)
    if (username === 'admin') {
      return Swal.fire('ไม่อนุญาต', 'ไม่สามารถลบ Account หลักได้', 'error')
    }

    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: `คุณต้องการลบผู้ใช้ ${username} ใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
          fetchUsers()
          Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบแล้ว', 'success')
        }
      }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Manage Users 👥</h1>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-blue-600">เพิ่มผู้ใช้งานใหม่</h2>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="text" placeholder="Username" className="p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-600" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="Password" className="p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-600" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input type="text" placeholder="ชื่อพนักงาน" className="p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-600" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <select className="p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none cursor-pointer" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="STAFF">STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-200">
            เพิ่มข้อมูล
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-white font-bold uppercase text-xs tracking-[0.2em]">
            <tr>
              <th className="p-6">Username</th>
              <th className="p-6">ชื่อ</th>
              <th className="p-6">ตำแหน่ง</th>
              <th className="p-6 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-all font-bold text-slate-600">
                <td className="p-6 text-slate-900">{user.username}</td>
                <td className="p-6">{user.name}</td>
                <td className="p-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => handleDelete(user.id, user.username)} className="text-red-400 hover:text-red-600 transition-all font-black px-4 py-2 hover:bg-red-50 rounded-xl">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}