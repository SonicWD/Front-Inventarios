'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save } from 'lucide-react'
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
import config from '@/utils/config'

interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
}

const tiposCategoria = ['INGREDIENTE', 'BEBIDA', 'UTENSILIO', 'MOBILIARIO', 'LIMPIEZA', 'OFICINA', 'PICNIC', 'DECORACION', 'UNIFORME']

export function CategoriasComponent() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [newCategoria, setNewCategoria] = useState<Categoria>({
    id: 0, nombre: '', tipo: '', descripcion: ''
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${config.API_URL}/categorias`)
      if (!response.ok) throw new Error('Error al obtener categorías')
      const data: Categoria[] = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoria({ ...newCategoria, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setNewCategoria({ ...newCategoria, tipo: value })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = isEditing 
        ? `${config.API_URL}/categorias/${newCategoria.id}`
        : `${config.API_URL}/categorias`
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategoria),
      })

      if (!response.ok) throw new Error(`Error al ${isEditing ? 'actualizar' : 'agregar'} categoría`)
      
      await fetchCategorias()
      resetForm()
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} category:`, error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.API_URL}/categorias/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error al eliminar categoría')
      
      await fetchCategorias()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setNewCategoria(categoria)
    setIsEditing(true)
  }

  const resetForm = () => {
    setNewCategoria({ id: 0, nombre: '', tipo: '', descripcion: '' })
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Gestión de Categorías</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="nombre"
            placeholder="Nombre de la categoría"
            value={newCategoria.nombre}
            onChange={handleInputChange}
            required
          />
          <Select onValueChange={handleSelectChange} value={newCategoria.tipo}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposCategoria.map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="descripcion"
            placeholder="Descripción"
            value={newCategoria.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <Button type="submit">
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Actualizar Categoría
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Agregar Categoría
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
            <TableHead>Tipo</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorias.map((categoria) => (
            <TableRow key={categoria.id}>
              <TableCell>{categoria.nombre}</TableCell>
              <TableCell>{categoria.tipo}</TableCell>
              <TableCell>{categoria.descripcion}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(categoria.id)}>
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

export default CategoriasComponent