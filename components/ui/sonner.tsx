"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-foreground font-semibold",
          description: "group-[.toast]:text-foreground", // Cambiado de text-muted-foreground a text-foreground
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:text-black", // Añadido para asegurar que el texto en toasts de éxito sea negro
          error: "group-[.toast]:text-black", // Añadido para asegurar que el texto en toasts de error sea negro
          info: "group-[.toast]:text-black", // Añadido para asegurar que el texto en toasts de info sea negro
          warning: "group-[.toast]:text-black", // Añadido para asegurar que el texto en toasts de advertencia sea negro
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
