"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useThemeColor } from "@/components/theme-color-provider"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const colors = [
  { name: "Zinc", value: "default", bgClass: "bg-zinc-900 dark:bg-zinc-100" },
  { name: "Blue", value: "blue", bgClass: "bg-blue-600" },
  { name: "Green", value: "green", bgClass: "bg-green-600" },
  { name: "Orange", value: "orange", bgClass: "bg-orange-600" },
]

export function ThemeSelector() {
  const { themeColor, setThemeColor } = useThemeColor()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Pilih Tema Warna</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Warna Aksen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.value}
            onClick={() => setThemeColor(color.value as any)}
            className={`flex items-center gap-2 cursor-pointer ${themeColor === color.value ? "bg-accent" : ""}`}
          >
            <div className={`h-4 w-4 rounded-full ${color.bgClass}`} />
            {color.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}