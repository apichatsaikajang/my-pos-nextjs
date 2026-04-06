'use client'

import { useEffect, useState } from 'react'

export default function OrderDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans bg-slate-50 min-h-screen text-slate-800">
      {/* Header & Total Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
            Sales Dashboard
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-1">ประวัติการขายและสรุปรายได้ของ MeetPro Coffee</p>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 min-w-[280px]">
          <p className="text-xs font-black uppercase opacity-70 tracking-widest mb-1">ยอดขายรวมสุทธิ</p>
          <p className="text-5xl font-black">฿{totalSales.toLocaleString()}</p>
        </div>
      </div>

      {/* Order List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-300 animate-pulse">กำลังดึงข้อมูลยอดขาย...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-300 font-bold italic text-xl">
            ยังไม่มีข้อมูลการขายในระบบ
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between gap-8 hover:shadow-md transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-slate-900 text-white px-5 py-1.5 rounded-full text-xs font-black">
                    BILL #{order.id}
                  </div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                    {new Date(order.createdAt).toLocaleString('th-TH', { 
                      dateStyle: 'medium', 
                      timeStyle: 'short' 
                    })}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-1 min-w-[150px]">
                      <span className="font-black text-slate-800 text-lg">{item.name}</span>
                      <div className="flex gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${
                          item.type === 'ร้อน' ? 'bg-red-100 text-red-600' : 
                          item.type === 'เย็น' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg font-black italic">
                          หวาน {item.sweet}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-bold">฿{item.price} x {item.qty}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center items-end lg:border-l-2 lg:border-dashed lg:border-slate-100 lg:pl-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ยอดรวมบิลนี้</p>
                <p className="text-4xl font-black text-blue-600">฿{order.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}