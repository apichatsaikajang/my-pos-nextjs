'use client'

import { useState, useEffect } from 'react'

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('COFFEE')
  const [selectedType, setSelectedType] = useState('เย็น')
  const [selectedSweet, setSelectedSweet] = useState('ปกติ')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ดึงข้อมูลสินค้าใหม่
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) setProducts(await res.json())
    } catch (error) { console.error(error) }
  }

  useEffect(() => { fetchProducts() }, [])

  // ฟังก์ชันดึงราคาให้ตรงกับประเภทที่เลือก (แก้ปัญหาราคาไม่ขึ้น)
  const getPriceByType = (p: any) => {
    if (p.category === 'BAKERY') return p.price || p.priceHot || 0
    if (selectedType === 'ร้อน') return p.priceHot || 0
    if (selectedType === 'เย็น') return p.priceIce || 0
    if (selectedType === 'ปั่น') return p.priceSpin || 0
    return 0
  }

  const addToCart = (p: any) => {
    const finalPrice = getPriceByType(p)
    // เช็กสต็อกก่อนเพิ่ม (ถ้ามีข้อมูลสต็อก)
    if (p.stock <= 0) {
      alert('สินค้าหมดสต็อก!')
      return
    }

    const item = {
      ...p,
      cartId: Date.now(),
      type: p.category === 'BAKERY' ? 'ชิ้น' : selectedType,
      sweet: p.category === 'BAKERY' ? '' : selectedSweet,
      finalPrice: finalPrice
    }
    setCart([...cart, item])
  }

  // ฟังก์ชันกดยืนยันชำระเงินและตัดสต็อก
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      })

      if (res.ok) {
        alert('ชำระเงินสำเร็จและตัดสต็อกเรียบร้อย!')
        setCart([])
        fetchProducts() // รีโหลดสินค้าเพื่ออัปเดตเลขสต็อกใหม่
      } else {
        alert('เกิดข้อผิดพลาดในการตัดสต็อก')
      }
    } catch (error) {
      console.error(error)
      alert('ระบบเชื่อมต่อฐานข้อมูลขัดข้อง')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 flex flex-col gap-6 overflow-x-hidden">
      
      {/* ส่วนปรับแต่งเครื่องดื่ม */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Type</p>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {['ร้อน', 'เย็น', 'ปั่น'].map(t => (
              <button key={t} onClick={() => setSelectedType(t)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedType === t ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sweetness</p>
          <div className="flex bg-slate-100 p-1 rounded-2xl flex-wrap">
            {['0%', '25%', '50%', 'ปกติ', 'หวานมาก'].map(s => (
              <button key={s} onClick={() => setSelectedSweet(s)}
                className={`flex-1 min-w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${selectedSweet === s ? 'bg-white shadow-md text-orange-600' : 'text-slate-400'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ปุ่มหมวดหมู่ */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
        {['COFFEE', 'BAKERY', 'ACCESSORIES'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl font-black text-xs tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* รายการสินค้า (แสดงราคาและสต็อก) */}
      <div className="grid grid-cols-2 gap-4">
        {products.filter(p => p.category.toUpperCase() === activeCategory).map((p: any) => (
          <div key={p.id} onClick={() => addToCart(p)} className="bg-white p-3 rounded-[2rem] shadow-sm active:scale-95 transition-all relative">
            {/* แสดงจำนวนสต็อกคงเหลือ */}
            <span className="absolute top-4 right-4 bg-slate-800 text-white text-[9px] px-2 py-1 rounded-full font-bold uppercase">
              Stock: {p.stock}
            </span>
            <div className="aspect-square bg-slate-50 rounded-2xl mb-2 overflow-hidden">
              {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">☕</div>}
            </div>
            <p className="font-bold text-xs truncate px-1">{p.name}</p>
            {/* แสดงราคาที่คำนวณแล้ว */}
            <p className="font-black text-blue-600 text-base px-1">฿{getPriceByType(p)}</p>
          </div>
        ))}
      </div>

      {/* ตะกร้าสินค้า (MY ORDER) */}
      <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 mt-auto">
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">MY ORDER 🛒</h2>
        
        <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar mb-6">
          {cart.map((item) => (
            <div key={item.cartId} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-[10px] text-blue-500 font-black">{item.type} {item.sweet && `| หวาน ${item.sweet}`}</p>
              </div>
              <p className="font-black text-lg">฿{item.finalPrice}</p>
            </div>
          ))}
          {cart.length === 0 && <div className="py-10 text-center text-slate-200 font-bold italic text-xs uppercase tracking-widest">Empty Order</div>}
        </div>

        <div className="pt-6 border-t border-dashed border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
          <p className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">฿{cart.reduce((s, i) => s + i.finalPrice, 0).toFixed(2)}</p>
          
          <button 
            disabled={cart.length === 0 || isSubmitting}
            onClick={handleConfirmOrder}
            className="w-full py-6 rounded-[2rem] font-black text-xl bg-[#1E293B] text-white shadow-2xl active:scale-95 transition-all disabled:bg-slate-100"
          >
            {isSubmitting ? 'PROCESSING...' : 'CONFIRM PAYMENT'}
          </button>
        </div>
      </section>

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  )
}