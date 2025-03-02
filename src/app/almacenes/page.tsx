'use client'

import config from '@/utils/config'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Almacen {
  id: number;
  nombre: string;
  tipo: string;
  rango_temperatura: string;
  capacidad: number;
  uso_actual: number;
}

export default function AlmacenesComponent() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([])
  const [newAlmacen, setNewAlmacen] = useState<Almacen>({
    id: 0,
    nombre: '',
    tipo: '',
    rango_temperatura: '',
    capacidad: 0,
    uso_actual: 0
  })
  const [isEditing, setIsEditing] = useState(false)

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  const fetchAlmacenes = useCallback(async () => {
    try {
      const response = await fetch(`${config.API_URL}/almacenes`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Error al obtener los almacenes')
      const data: Almacen[] = await response.json()
      setAlmacenes(data)
    } catch (error) {
      console.error('Error fetching almacenes:', error)
    }
  }, [])

  useEffect(() => {
    fetchAlmacenes()
  }, [fetchAlmacenes])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAlmacen(prev => ({
      ...prev,
      [name]: name === 'capacidad' || name === 'uso_actual' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = isEditing
        ? `${config.API_URL}/almacenes/${newAlmacen.id}`
        : `${config.API_URL}/almacenes`
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(newAlmacen),
      })

      if (!response.ok) {
        throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el almacén`)
      }

      await fetchAlmacenes()
      resetForm()
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} almacen:`, error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.API_URL}/almacenes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el almacén')
      }

      await fetchAlmacenes()
    } catch (error) {
      console.error('Error deleting almacen:', error)
    }
  }

  const handleEdit = (almacen: Almacen) => {
    setNewAlmacen(almacen)
    setIsEditing(true)
  }

  const resetForm = () => {
    setNewAlmacen({
      id: 0,
      nombre: '',
      tipo: '',
      rango_temperatura: '',
      capacidad: 0,
      uso_actual: 0
    })
    setIsEditing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-3xl font-bold mb-6">Gestión de Almacenes</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="nombre" placeholder="Nombre del almacén" value={newAlmacen.nombre} onChange={handleInputChange} required />
          <Input name="tipo" placeholder="Tipo de almacén" value={newAlmacen.tipo} onChange={handleInputChange} required />
          <Input name="rango_temperatura" placeholder="Rango de temperatura" value={newAlmacen.rango_temperatura} onChange={handleInputChange} required />
          <Input name="capacidad" type="number" placeholder="Capacidad" value={newAlmacen.capacidad} onChange={handleInputChange} required />
          <Input name="uso_actual" type="number" placeholder="Uso actual" value={newAlmacen.uso_actual} onChange={handleInputChange} required />
        </div>
        <div className="mt-4 flex justify-between">
          <Button type="submit">{isEditing ? <><Save className="mr-2 h-4 w-4" /> Actualizar</> : <><Plus className="mr-2 h-4 w-4" /> Agregar</>}</Button>
          {isEditing && <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>}
        </div>
      </form>
    </motion.div>
  )
}