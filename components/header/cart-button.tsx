import Link from "next/link"
import { ShoppingBag } from "lucide-react"

interface CartButtonProps {
  count: number
}

export function CartButton({ count }: CartButtonProps) {
  return (
    <Link href="/cart" className="group relative p-2 text-gray-700 hover:text-black">
      <ShoppingBag className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-medium text-white group-hover:bg-gray-800">
          {count}
        </span>
      )}
      <span className="sr-only">View cart</span>
    </Link>
  )
}
