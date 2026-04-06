'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

export default function AdminProductPage() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [image, setImage] = useState('') 
  const [category, setCategory] = useState('Coffee')
  const [priceHot, setPriceHot] = useState(0)
  const [priceIce, setPriceIce] = useState(0)
  const [priceSpin, setPriceSpin] = useState(0)
  const [stock, setStock] = useState(0)
  const [editId, setEditId] = useState<number | null>(null)

  // ดึงข้อมูลสินค้า (แก้ Path ให้ตรงตามโครงสร้างจริงของพี่แล้ว)
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products') 
      if (res.ok) setProducts(await res.json())
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSubmit = async () => {
    if (!name) return alert('กรุณากรอกชื่อเมนู')
    if (!image) return alert('กรุณาอัปโหลดรูปภาพก่อน')
    
    const payload = {
      name, image, category,
      priceHot: Number(priceHot),
      priceIce: category === 'Coffee' ? Number(priceIce) : 0,
      priceSpin: category === 'Coffee' ? Number(priceSpin) : 0,
      stock: category === 'Coffee' ? 0 : Number(stock)
    }

    const method = editId ? 'PATCH' : 'POST'
    const body = editId ? JSON.stringify({ id: editId, ...payload }) : JSON.stringify(payload)

    const res = await fetch('/api/products', { // แก้ Path
      method,
      headers: { 'Content-Type': 'application/json' },
      body
    })

    if (res.ok) {
      alert(editId ? 'แก้ไขสำเร็จ!' : 'เพิ่มสำเร็จ!')
      resetForm()
      fetchProducts()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบรายการนี้?')) return
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' }) // แก้ Path
    if (res.ok) fetchProducts()
  }

  const startEdit = (p: any) => {
    setEditId(p.id)
    setName(p.name)
    setImage(p.image)
    setCategory(p.category)
    setPriceHot(p.priceHot)
    setPriceIce(p.priceIce)
    setPriceSpin(p.priceSpin)
    setStock(p.stock)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditId(null)
    setName(''); setImage(''); setPriceHot(0); setPriceIce(0); setPriceSpin(0); setStock(0)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-black font-sans bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black mb-8 italic uppercase text-slate-800 tracking-tighter">
        {editId ? '📝 EDIT PRODUCT' : '➕ ADD NEW PRODUCT'}
      </h1>
      
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 mb-12">
        <div className="flex gap-4 mb-8">
          <button onClick={() => setCategory('Coffee')} className={`px-8 py-2 rounded-xl font-bold transition-all ${category === 'Coffee' ? 'bg-[#1a1c2e] text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>☕ COFFEE</button>
          <button onClick={() => setCategory('Bakery')} className={`px-8 py-2 rounded-xl font-bold transition-all ${category === 'Bakery' ? 'bg-orange-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>🥐 BAKERY</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">ชื่อเมนูสินค้า</label>
            <input type="text" value={name} placeholder="ระบุชื่อเมนู..." className="p-4 bg-slate-50 rounded-2xl border focus:border-blue-500 outline-none font-bold" onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">รูปภาพสินค้า (Upload)</label>
            <div className="flex gap-4">
              <CldUploadWidget 
                uploadPreset="meetpro_preset" 
                onSuccess={(result: any) => {
                   if (result.event === 'success') {
                     setImage(result.info.secure_url);
                   }
                }}
              >
                {({ open }) => (
                  <button 
                    type="button" 
                    onClick={() => open()} 
                    className={`flex-1 p-4 border-2 border-dashed rounded-2xl font-bold transition-all ${image ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {image ? '✅ อัปโหลดสำเร็จ' : '📁 เลือกไฟล์รูปภาพ'}
                  </button>
                )}
              </CldUploadWidget>
              {image && (
                <div className="w-16 h-16 rounded-2xl overflow-hidden border">
                  <img src={image} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {category === 'Coffee' ? (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 text-center">ร้อน (HOT)</label>
              <input type="number" value={priceHot} className="p-4 bg-slate-50 rounded-2xl text-center font-black" onChange={(e) => setPriceHot(Number(e.target.value))} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 text-center">เย็น (ICE)</label>
              <input type="number" value={priceIce} className="p-4 bg-slate-50 rounded-2xl text-center font-black" onChange={(e) => setPriceIce(Number(e.target.value))} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 text-center">ปั่น (SPIN)</label>
              <input type="number" value={priceSpin} className="p-4 bg-slate-50 rounded-2xl text-center font-black" onChange={(e) => setPriceSpin(Number(e.target.value))} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-orange-400 text-center uppercase">Price per piece</label>
              <input type="number" value={priceHot} className="p-4 bg-orange-50 rounded-2xl text-center font-black border border-orange-100" onChange={(e) => setPriceHot(Number(e.target.value))} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-orange-400 text-center uppercase">Stock Quantity</label>
              <input type="number" value={stock} className="p-4 bg-orange-50 rounded-2xl text-center font-black border border-orange-100" onChange={(e) => setStock(Number(e.target.value))} />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex-1 py-5 bg-[#1a1c2e] text-white rounded-[2rem] font-black text-lg hover:bg-black transition-all shadow-xl active:scale-95">
            {editId ? 'บันทึกการแก้ไข' : 'เพิ่มลงในรายการเมนู'}
          </button>
          {editId && <button onClick={resetForm} className="px-10 bg-slate-200 rounded-[2rem] font-black hover:bg-slate-300">ยกเลิก</button>}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-sm border overflow-hidden">
        <h3 className="mb-6 font-black italic text-slate-400 uppercase text-xs tracking-widest">รายการสินค้าล่าสุด</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase font-black border-b tracking-tighter">
              <th className="pb-6">Product</th>
              <th className="pb-6 text-center">Price Structure</th>
              <th className="pb-6 text-center">Stock</th>
              <th className="pb-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50 group">
                <td className="py-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={p.image || 'https://placehold.co/400x400?text=No+Image'} 
                      className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=Invalid+Img' }} // กันรูปเก่าเสีย
                    />
                    <div>
                      <p className="font-black text-slate-800 leading-none mb-1">{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-6 text-center">
                   <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">
                     ฿{p.priceHot}/{p.priceIce}/{p.priceSpin}
                   </span>
                </td>
                <td className="py-6 text-center font-black text-slate-400">
                  {p.category === 'Bakery' ? <span className="text-orange-500">{p.stock}</span> : 'UNLIMITED'}
                </td>
                <td className="py-6 text-right space-x-4">
                  <button onClick={() => startEdit(p)} className="text-blue-500 font-black text-xs uppercase hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-300 font-black text-xs uppercase hover:text-red-600 transition-all">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}