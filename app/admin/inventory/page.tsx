'use client'
import { useState, useEffect } from 'react'

export default function IngredientInventory() {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState(0)
  const [newUnit, setNewUnit] = useState('ถุง')

  const fetchIngredients = async () => {
    try {
      const res = await fetch('/api/admin/ingredients')
      const data = await res.json()
      setIngredients(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchIngredients() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName) return
    await fetch('/api/admin/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, unit: newUnit, amount: Number(newAmount) })
    })
    setNewName(''); setNewAmount(0);
    fetchIngredients()
  }

  const handleUpdate = async (id: number, newStock: number) => {
    if (newStock < 0) return
    await fetch(`/api/admin/ingredients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: newStock })
    })
    fetchIngredients()
  }

  if (loading) return <div className="p-10 text-center">กำลังโหลดสต็อก...</div>

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-gray-800 border-b pb-4">📦 สต็อกวัตถุดิบ & Bakery</h1>

      {/* --- ส่วนฟอร์ม: ชื่อ -> จำนวน -> หน่วย --- */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex flex-wrap gap-4 items-end border border-blue-100">
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-bold mb-2 text-gray-600">ชื่อรายการ (กาแฟ/นม/ขนม)</label>
          <input 
            type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="เช่น ครัวซองต์, ขนมปังแผ่น..." 
            className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none focus:border-blue-500"
          />
        </div>

        <div className="w-28">
          <label className="block text-sm font-bold mb-2 text-gray-600">จำนวน</label>
          <input 
            type="number" value={newAmount} onChange={(e) => setNewAmount(Number(e.target.value))}
            className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-center font-bold"
          />
        </div>

        <div className="w-32">
          <label className="block text-sm font-bold mb-2 text-gray-600">หน่วย</label>
          <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)} className="w-full p-2.5 bg-gray-50 border rounded-xl outline-none cursor-pointer font-medium">
            <option value="ชิ้น">ชิ้น (Bakery)</option>
            <option value="ถุง">ถุง (กาแฟ)</option>
            <option value="กล่อง">กล่อง (นม)</option>
            <option value="ขวด">ขวด (ไซรัป)</option>
            <option value="แพ็ค">แพ็ค</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition h-[46px]">
          เพิ่มเข้าคลัง
        </button>
      </form>

      {/* --- รายการในคลัง --- */}
      <div className="grid gap-4">
        {ingredients.map((item: any) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center hover:border-blue-200 transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-400 font-bold">
                {item.unit === 'ชิ้น' ? '🥐' : '📦'}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <p className="text-sm font-medium text-gray-500">
                  จำนวน: <span className="text-blue-600 font-bold text-lg">{item.amount}</span> {item.unit}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                <button onClick={() => handleUpdate(item.id, item.amount - 1)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-bold text-red-500 hover:bg-red-50 transition">-</button>
                <input type="number" value={item.amount} onChange={(e) => handleUpdate(item.id, Number(e.target.value))} className="w-16 text-center bg-transparent font-black text-2xl text-gray-800 outline-none" />
                <button onClick={() => handleUpdate(item.id, item.amount + 1)} className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-xl shadow-sm font-bold hover:bg-black transition">+</button>
              </div>
              <button onClick={async () => { if(confirm('ลบ?')) { await fetch(`/api/admin/ingredients/${item.id}`, {method:'DELETE'}); fetchIngredients(); } }} className="text-gray-300 hover:text-red-500 transition p-2">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}