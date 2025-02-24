'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import config from '@/utils/config'

interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  correo: string;
  telefono: string;
  direccion: string;
}

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [newProveedor, setNewProveedor] = useState<Proveedor>({
    id: 0,
    nombre: '',
    contacto: '',
    correo: '',
    telefono: '',
    direccion: ''
  })
  const [isEditing, setIsEditing] = useState(false)

  // Función auxiliar para obtener los headers con el token actualizado
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  useEffect(() => {
    fetchProveedores()
  }, [])

  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${config.API_URL}/proveedores`, {
        method: 'GET',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Error al obtener proveedores')
      const data: Proveedor[] = await response.json()
      setProveedores(data)
    } catch (error) {
      console.error('Error fetching proveedores:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProveedor(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = isEditing
        ? `${config.API_URL}/proveedores/${newProveedor.id}`
        : `${config.API_URL}/proveedores`
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(newProveedor),
      })

      if (!response.ok) throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el proveedor`)

      await fetchProveedores()
      resetForm()
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} proveedor:`, error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.API_URL}/proveedores/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) throw new Error('Error al eliminar el proveedor')

      await fetchProveedores()
    } catch (error) {
      console.error('Error deleting proveedor:', error)
    }
  }

  const handleEdit = (proveedor: Proveedor) => {
    setNewProveedor(proveedor)
    setIsEditing(true)
  }

  const resetForm = () => {
    setNewProveedor({
      id: 0,
      nombre: '',
      contacto: '',
      correo: '',
      telefono: '',
      direccion: ''
    })
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Gestión de Proveedores</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="nombre"
            placeholder="Nombre del proveedor"
            value={newProveedor.nombre}
            onChange={handleInputChange}
            required
          />
          <Input
            name="contacto"
            placeholder="Persona de contacto"
            value={newProveedor.contacto}
            onChange={handleInputChange}
            required
          />
          <Input
            name="correo"
            type="email"
            placeholder="Correo electrónico"
            value={newProveedor.correo}
            onChange={handleInputChange}
            required
          />
          <Input
            name="telefono"
            placeholder="Teléfono"
            value={newProveedor.telefono}
            onChange={handleInputChange}
            required
          />
          <Input
            name="direccion"
            placeholder="Dirección"
            value={newProveedor.direccion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mt-4 flex justify-between">
          <Button type="submit">
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Actualizar Proveedor
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Agregar Proveedor
              </>
            )}
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar Edición
            </Button>
          )}
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor.id}>
              <TableCell>{proveedor.nombre}</TableCell>
              <TableCell>{proveedor.contacto}</TableCell>
              <TableCell>{proveedor.correo}</TableCell>
              <TableCell>{proveedor.telefono}</TableCell>
              <TableCell>{proveedor.direccion}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(proveedor)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(proveedor.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}
