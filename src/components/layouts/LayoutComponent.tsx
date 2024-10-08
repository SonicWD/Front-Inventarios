// layouts/LayoutComponent.tsx
'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Package, Truck, Warehouse, BarChart2, List, Menu } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Categorías', href: '/categorias', icon: List },
  { name: 'Productos', href: '/productos', icon: Package },
  { name: 'Proveedores', href: '/proveedores', icon: Truck },
  { name: 'Almacenes', href: '/almacenes', icon: Warehouse },
  { name: 'Inventario', href: '/inventario', icon: BarChart2 },
]


interface LayoutComponentProps {
    children: ReactNode
    className?: string // Acepta className como prop opcional
  }

  //aca se encuentra el navbar y el sidebar de fora global
export function LayoutComponent({ children }: LayoutComponentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.nav
        initial={false}
        animate={{ width: isSidebarOpen ? 'auto' : '0' }}
        className="bg-white shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 shadow-md">
            <h1 className="text-3xl font-semibold text-primary">RestaurantApp</h1>
          </div>
          <ul className="flex flex-col py-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="flex items-center px-6 py-4 text-gray-700 hover:bg-primary hover:text-white transition-colors duration-300">
                  <item.icon className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.nav>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 focus:outline-none focus:text-primary"
          >
            <Menu size={24} />
          </button>
          <div className="text-2xl font-semibold text-primary">Sistema de Inventario</div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
