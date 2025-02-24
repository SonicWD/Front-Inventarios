'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ArrowUp, ArrowDown, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import config from '@/utils/config'

interface Conteo {
  id: number;
  item_id: number;
  almacen_id: number;
  cantidad: number;
  contado_por: string;
  fecha: string;
}

interface Movimiento {
  id: number;
  item_id: number;
  cantidad: number;
  tipo: 'entrada' | 'salida';
  referencia: string;
  notas: string;
  fecha: string;
}

interface Item {
  id: number;
  nombre: string;
}

interface Almacen {
  id: number;
  nombre: string;
}

export default function Inventario() {
  const [conteos, setConteos] = useState<Conteo[]>([])
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [almacenes, setAlmacenes] = useState<Almacen[]>([])
  const [newConteo, setNewConteo] = useState<Omit<Conteo, 'id' | 'fecha'>>({
    item_id: 0,
    almacen_id: 0,
    cantidad: 0,
    contado_por: ''
  })
  const [newMovimiento, setNewMovimiento] = useState<Omit<Movimiento, 'id' | 'fecha'>>({
    item_id: 0,
    cantidad: 0,
    tipo: 'entrada',
    referencia: '',
    notas: ''
  })

  // Función auxiliar para obtener los headers con el token actualizado
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  useEffect(() => {
    fetchConteos()
    fetchMovimientos()
    fetchItems()
    fetchAlmacenes()
  }, [])

  const fetchConteos = async () => {
    try {
      const response = await fetch(`${config.API_URL}/conteos_inventario`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Error al obtener conteos')
      const data: Conteo[] = await response.json()
      setConteos(data)
    } catch (error) {
      console.error('Error fetching conteos:', error)
    }
  }

  const fetchMovimientos = async () => {
    try {
      const response = await fetch(`${config.API_URL}/movimientos_inventario`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Error al obtener movimientos')
      const data: Movimiento[] = await response.json()
      setMovimientos(data)
    } catch (error) {
      console.error('Error fetching movimientos:', error)
    }
  }

  const fetchItems = async () => {
    try {
      const response = await fetch(`${config.API_URL}/items`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Error al obtener items')
      const data: Item[] = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  const fetchAlmacenes = async () => {
    try {
      const response = await fetch(`${config.API_URL}/almacenes`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Error al obtener almacenes')
      const data: Almacen[] = await response.json()
      setAlmacenes(data)
    } catch (error) {
      console.error('Error fetching almacenes:', error)
    }
  }

  const handleConteoChange = (name: string, value: string | number) => {
    setNewConteo(prev => ({ ...prev, [name]: value }))
  }

  const handleMovimientoChange = (name: string, value: string | number) => {
    setNewMovimiento(prev => ({ ...prev, [name]: value }))
  }

  const handleConteoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.API_URL}/conteos_inventario`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newConteo),
      })

      if (!response.ok) throw new Error('Error al registrar conteo')

      await fetchConteos()
      setNewConteo({
        item_id: 0,
        almacen_id: 0,
        cantidad: 0,
        contado_por: ''
      })
    } catch (error) {
      console.error('Error submitting conteo:', error)
    }
  }

  const handleMovimientoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.API_URL}/movimientos_inventario`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMovimiento),
      })

      if (!response.ok) throw new Error('Error al registrar movimiento')

      await fetchMovimientos()
      setNewMovimiento({
        item_id: 0,
        cantidad: 0,
        tipo: 'entrada',
        referencia: '',
        notas: ''
      })
    } catch (error) {
      console.error('Error submitting movimiento:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Gestión de Inventario</h2>
      
      <Tabs defaultValue="conteo" className="mb-8">
        <TabsList>
          <TabsTrigger value="conteo">Conteo de Inventario</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos de Inventario</TabsTrigger>
        </TabsList>
        <TabsContent value="conteo">
          <form onSubmit={handleConteoSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={newConteo.item_id.toString()}
                onValueChange={(value) => handleConteoChange('item_id', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newConteo.almacen_id.toString()}
                onValueChange={(value) => handleConteoChange('almacen_id', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un almacén" />
                </SelectTrigger>
                <SelectContent>
                  {almacenes.map(almacen => (
                    <SelectItem key={almacen.id} value={almacen.id.toString()}>{almacen.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Cantidad"
                value={newConteo.cantidad}
                onChange={(e) => handleConteoChange('cantidad', Number(e.target.value))}
                required
              />
              <Input
                placeholder="Contado por"
                value={newConteo.contado_por}
                onChange={(e) => handleConteoChange('contado_por', e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Registrar Conteo
            </Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Almacén</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Contado por</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conteos.map((conteo) => (
                <TableRow key={conteo.id}>
                  <TableCell>{items.find(i => i.id === conteo.item_id)?.nombre}</TableCell>
                  <TableCell>{almacenes.find(a => a.id === conteo.almacen_id)?.nombre}</TableCell>
                  <TableCell>{conteo.cantidad}</TableCell>
                  <TableCell>{conteo.contado_por}</TableCell>
                  <TableCell>{new Date(conteo.fecha).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="movimientos">
          <form onSubmit={handleMovimientoSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={newMovimiento.item_id.toString()}
                onValueChange={(value) => handleMovimientoChange('item_id', Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {items.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Cantidad"
                value={newMovimiento.cantidad}
                onChange={(e) => handleMovimientoChange('cantidad', Number(e.target.value))}
                required
              />
              <Select
                value={newMovimiento.tipo}
                onValueChange={(value) => handleMovimientoChange('tipo', value as 'entrada' | 'salida')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo de movimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Número de referencia"
                value={newMovimiento.referencia}
                onChange={(e) => handleMovimientoChange('referencia', e.target.value)}
                required
              />
              <Input
                placeholder="Notas"
                value={newMovimiento.notas}
                onChange={(e) => handleMovimientoChange('notas', e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Registrar Movimiento
            </Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.map((movimiento) => (
                <TableRow key={movimiento.id}>
                  <TableCell>{items.find(i => i.id === movimiento.item_id)?.nombre}</TableCell>
                  <TableCell>{movimiento.cantidad}</TableCell>
                  <TableCell>
                    {movimiento.tipo === 'entrada' ? (
                      <ArrowUp className="text-green-500" />
                    ) : (
                      <ArrowDown className="text-red-500" />
                    )}
                    {movimiento.tipo}
                  </TableCell>
                  <TableCell>{movimiento.referencia}</TableCell>
                  <TableCell>{movimiento.notas}</TableCell>
                  <TableCell>{new Date(movimiento.fecha).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
