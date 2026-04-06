'use client'

import { useState, useEffect } from 'react'

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState('COFFEE')
  const [selectedType, setSelectedType] = useState('เย็น')
  const [selectedSweet, setSelectedSweet] = useState('ปกติ')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data))
  }, [])

  const getPrice = (p: any) => {
    if (p.category.toUpperCase() === 'BAKERY') return p.price || p.priceHot || 0
    if (selectedType === 'ร้อน') return p.priceHot || 0
    if (selectedType === 'เย็น') return p.priceIce || 0
    if (selectedType === 'ปั่น') return p.priceSpin || 0
    return 0
  }

  const addToCart = (p: any) => {
    const isBakery = p.category.toUpperCase() === 'BAKERY'
    if (isBakery && p.stock <= 0) {
      alert('สินค้าหมดครับ!')
      return
    }

    if (isBakery) {
      setProducts(prev => prev.map(item => 
        item.id === p.id ? { ...item, stock: item.stock - 1 } : item
      ))
    }

    const item = { 
      ...p, 
      cartId: Date.now(), 
      type: isBakery ? 'ชิ้น' : selectedType, 
      sweet: isBakery ? '' : selectedSweet, 
      finalPrice: getPrice(p) 
    }
    setCart([...cart, item])
  }

  const removeFromCart = (itemToRemove: any) => {
    if (itemToRemove.category.toUpperCase() === 'BAKERY') {
      setProducts(prev => prev.map(item => 
        item.id === itemToRemove.id ? { ...item, stock: item.stock + 1 } : item
      ))
    }
    setCart(cart.filter(item => item.cartId !== itemToRemove.cartId))
  }

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: cart.reduce((sum, item) => sum + item.finalPrice, 0),
          items: cart
        }),
      })
      if (res.ok) {
        alert('บันทึกสำเร็จ!')
        setCart([])
      }
    } catch (e) { alert('ผิดพลาด!') }
    finally { setIsSubmitting(false) }
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 flex flex-col gap-6 overflow-x-hidden">
      {/* SELECT TYPE & SWEETNESS */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Type</p>
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {['ร้อน', 'เย็น', 'ปั่น'].map(t => (
              <button key={t} onClick={() => setSelectedType(t)} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${selectedType === t ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Sweetness</p>
          <div className="flex bg-slate-100 p-1 rounded-2xl flex-wrap">
            {['ปกติ', 'หวานน้อย', 'หวานมาก'].map(s => (
              <button key={s} onClick={() => setSelectedSweet(s)} className={`flex-1 min-w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${selectedSweet === s ? 'bg-white shadow-md text-orange-600' : 'text-slate-400'}`}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {['COFFEE', 'BAKERY', 'ACCESSORIES'].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-2xl font-black text-xs tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}>{cat}</button>
        ))}
      </div>

      {/* PRODUCTS GRID + DYNAMIC IMAGE */}
      <div className="grid grid-cols-2 gap-4">
        {products.filter(p => p.category.toUpperCase() === activeCategory).map((p: any) => {
          const isBakery = p.category.toUpperCase() === 'BAKERY'
          const outOfStock = isBakery && p.stock <= 0
          
          return (
            <div key={p.id} onClick={() => !outOfStock && addToCart(p)} className={`bg-white p-3 rounded-[2.5rem] shadow-sm relative transition-all ${outOfStock ? 'opacity-50 grayscale' : 'active:scale-95 cursor-pointer'}`}>
              {isBakery && (
                <span className="absolute top-4 right-4 text-[9px] px-2 py-1 rounded-full font-bold bg-slate-800 text-white z-10">
                  {outOfStock ? 'หมด' : `คลัง: ${p.stock}`}
                </span>
              )}
              
              {/* จุดที่แก้: แสดงรูปจาก p.image */}
              <div className="aspect-square bg-slate-100 rounded-[1.8rem] mb-3 overflow-hidden flex items-center justify-center">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl italic font-black text-slate-200">MEET</span>
                )}
              </div>
              
              <div className="px-2 pb-2">
                <p className="font-bold text-[11px] text-slate-800 truncate mb-0.5">{p.name}</p>
                <p className="font-black text-blue-600 text-lg tracking-tighter">฿{getPrice(p)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ORDER SUMMARY */}
      <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 mt-auto">
        <h2 className="text-xl font-black mb-6">MY ORDER 🛒</h2>
        <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar mb-6">
          {cart.map((item) => (
            <div key={item.cartId} className="flex justify-between items-center bg-slate-50 p-4 rounded-[1.5rem]">
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-[10px] text-blue-500 font-black uppercase">{item.type} {item.sweet && `| ${item.sweet}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-black text-lg">฿{item.finalPrice}</p>
                <button onClick={() => removeFromCart(item)} className="text-red-500 font-bold p-2 bg-red-50 rounded-xl">✕</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-dashed border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Amount</p>
          <p className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">฿{cart.reduce((s, i) => s + i.finalPrice, 0).toFixed(2)}</p>
          <button disabled={cart.length === 0 || isSubmitting} onClick={handleConfirmOrder} className="w-full py-6 rounded-[2rem] font-black text-xl bg-blue-600 text-white shadow-2xl active:scale-95 disabled:bg-slate-100">CONFIRM PAYMENT</button>
        </div>
      </section>

      <style jsx global>{` .no-scrollbar::-webkit-scrollbar { display: none; } `}</style>
    </div>
  )
}