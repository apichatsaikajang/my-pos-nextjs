'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Coffee, 
  Users, 
  History, 
  LogOut,
  ShieldCheck,
  Menu, // เพิ่ม icon 3 ขีด
  X     // เพิ่ม icon ปิด
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State สำหรับ Hamburger Menu

  useEffect(() => {
    const cookies = document.cookie.split('; ')
    const roleCookie = cookies.find(row => row.startsWith('userRole='))
    setRole(roleCookie ? roleCookie.split('=')[1] : 'STAFF')
    
    // ปิดเมนูอัตโนมัติเมื่อเปลี่ยนหน้า (สำหรับมือถือ)
    setIsMenuOpen(false)
  }, [pathname])

  const menuItems = [
    { name: 'สรุปภาพรวม', href: '/admin/summary', icon: <LayoutDashboard size={20} />, adminOnly: true },
    // { name: 'หน้าจอขาย POS', href: '/admin/pos', icon: <ShoppingCart size={20} />, adminOnly: false },
    { name: 'ประวัติการขาย', href: '/admin/orders', icon: <History size={20} />, adminOnly: false },
    // { name: 'จัดการสต็อก', href: '/admin/inventory', icon: <Package size={20} />, adminOnly: false },
    { name: 'จัดการเมนูและราคา', href: '/admin/products', icon: <Coffee size={20} />, adminOnly: true },
    { name: 'จัดการผู้ใช้งาน', href: '/admin/users', icon: <Users size={20} />, adminOnly: true },
  ]

  const handleLogout = () => {
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    window.location.href = '/login'
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative overflow-x-hidden">
      
      {/* --- Mobile Header & Hamburger Button --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a233a] flex items-center justify-between px-6 z-40 shadow-xl">
        <div className="flex items-center gap-2">
          <Coffee className="text-blue-500" size={24} />
          <h1 className="text-xl font-black italic tracking-tighter text-white">MEETPRO</h1>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- Sidebar Navigation --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1a233a] text-white p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:h-screen lg:sticky lg:top-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header/Logo */}
        <div className="mb-10 px-4 mt-4 lg:mt-0">
          <div className="flex items-center gap-2 mb-1">
             <Coffee className="text-blue-500" size={28} />
             <h1 className="text-2xl font-black italic tracking-tighter text-white">MEETPRO</h1>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Coffee POS System</p>
          
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <ShieldCheck size={12} className={role === 'ADMIN' ? 'text-blue-400' : 'text-green-400'} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {role === 'ADMIN' ? 'Administrator' : 'Staff Member'}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 scrollbar-hide">
          {menuItems.map((item) => {
            if (role !== 'ADMIN' && item.adminOnly) return null
            const isActive = pathname === item.href

            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                <span className="text-sm tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout Section */}
        <div className="mt-auto pt-6 border-t border-slate-800/50 px-2">
          <button 
            onClick={handleLogout} 
            className="group flex items-center gap-4 w-full p-4 rounded-2xl font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* --- Overlay สำหรับมือถือ (แตะเพื่อปิดเมนู) --- */}
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* --- Main Content Area --- */}
      <main className="flex-1 p-6 lg:p-12 mt-16 lg:mt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  )
}