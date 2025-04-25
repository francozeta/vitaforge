"use client"

import { Spinner as RadixSpinner, Flex } from "@radix-ui/themes"

interface SpinnerProps {
  size?: "1" | "2" | "3"
  className?: string
}

export function Spinner({ size = "2", className }: SpinnerProps) {
  return (
    <Flex align="center" justify="center" className={className}>
      <RadixSpinner size={size} />
    </Flex>
  )
}

