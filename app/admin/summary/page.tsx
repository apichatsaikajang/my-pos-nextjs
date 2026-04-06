'use client'

import { useState, useEffect } from 'react'

export default function SalesSummary() {
  // กำหนดค่าเริ่มต้นเป็น 0 เพื่อป้องกัน Error .toLocaleString()
  const [summary, setSummary] = useState({ totalSales: 0, totalOrders: 0 })
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/admin/summary')
      if (res.ok) {
        const data = await res.json()
        setSummary(data)
      }
    } catch (error) {
      console.error("Error fetching summary:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-black">
      <h1 className="text-3xl font-black italic mb-8 uppercase tracking-tighter text-slate-800">
        Dashboard Summary 📊
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* บล็อกยอดขายรวม - แก้ไขจุดที่เกิด Error */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-4 border-blue-500 transition-transform hover:scale-105">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">ยอดขายรวม</p>
          <p className="text-4xl font-black text-slate-900">
            ฿{(summary?.totalSales || 0).toLocaleString()}
          </p>
        </div>

        {/* บล็อกจำนวนออเดอร์ */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-4 border-emerald-500 transition-transform hover:scale-105">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">จำนวนออเดอร์</p>
          <p className="text-4xl font-black text-slate-900">
            {(summary?.totalOrders || 0).toLocaleString()} <span className="text-lg text-slate-400">Items</span>
          </p>
        </div>

        {/* บล็อกสถานะระบบ */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-b-4 border-orange-500 transition-transform hover:scale-105">
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">สถานะร้านค้า</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-2xl font-black text-slate-900 uppercase">Online</p>
          </div>
        </div>

      </div>

      {loading && (
        <p className="mt-8 text-center text-slate-400 font-bold italic animate-bounce">
          🔄 กำลังอัปเดตข้อมูลล่าสุด...
        </p>
      )}
    </div>
  )
}