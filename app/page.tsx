import { prisma } from '@/lib/prisma'
import ProductList from '@/components/ProductList'

export default async function POSPage() {
  const products = await prisma.product.findMany()

  return (
    <main className="p-1 max-w-6xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-1 text-gray-800">☕ MeetPro Coffee POS</h1>
      <ProductList products={products} />
    </main>
  )
}