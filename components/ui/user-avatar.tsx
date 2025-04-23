"use client"

import { useMemo } from "react"
import { User } from "lucide-react"
import { useSession } from "next-auth/react"

interface UserAvatarProps {
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

export function UserAvatar({ size = "sm", onClick }: UserAvatarProps) {
  const { data: session } = useSession()

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-base",
  }

  // Generate a consistent color based on the user's email
  const avatarColor = useMemo(() => {
    if (!session?.user?.email) return "bg-emerald-400"

    // Simple hash function to generate a consistent color
    const hash = Array.from(session.user.email).reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // List of background colors
    const colors = [
      "bg-emerald-400",
      "bg-blue-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-orange-400",
      "bg-red-400",
      "bg-indigo-400",
      "bg-teal-400",
      "bg-cyan-400",
    ]

    return colors[hash % colors.length]
  }, [session?.user?.email])

  // Get user initials
  const initials = useMemo(() => {
    if (!session?.user?.name) return ""

    return session.user.name
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }, [session?.user?.name])

  return (
    <button
      onClick={onClick}
      className={`${avatarColor} ${sizeClasses[size]} flex items-center justify-center rounded-full text-white font-medium cursor-pointer`}
      aria-label="Menú de usuario"
    >
      {initials || <User className="h-5 w-5" />}
    </button>
  )
}
