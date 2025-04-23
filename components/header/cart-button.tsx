import Link from "next/link"
import { ShoppingBag } from "lucide-react"

interface CartButtonProps {
  count: number
  isLoading?: boolean
}

export function CartButton({ count, isLoading }: CartButtonProps) {
  if (isLoading) {
    return (
      <div className="relative p-2">
        <div className="h-6 w-6 rounded bg-gray-200 animate-pulse"></div>
        <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    )
  }

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
