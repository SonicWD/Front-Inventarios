'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import config from '@/utils/config'  // Asegúrate de tener la URL de tu API en config

// Definición de la interfaz para las categorías
interface Categoria {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
}

const tiposCategoria = ['BEBIDA', 'COMIDA', 'UTENSILIO', 'OTRO']

export function CategoriasComponent() {
  const [categorias, setCategorias] = useState<Categoria[]>([])  // Añadimos el tipo Categoria[]
  const [newCategoria, setNewCategoria] = useState<Categoria>({
    id: 0, nombre: '', tipo: '', descripcion: ''
  })

  // Obtener categorías del backend al cargar el componente
  useEffect(() => {
    fetch(`${config.API_URL}/categorias`)
      .then(response => response.json())
      .then((data: Categoria[]) => setCategorias(data))
      .catch(error => console.error('Error fetching categories:', error))
  }, [])

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewCategoria({ ...newCategoria, [e.target.name]: e.target.value })
  }

  // Agregar una nueva categoría en el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.API_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategoria),
      })

      if (response.ok) {
        const nuevaCategoria: Categoria = await response.json()
        setCategorias([...categorias, nuevaCategoria])
        setNewCategoria({ id: 0, nombre: '', tipo: '', descripcion: '' })
      } else {
        console.error('Error adding category:', response.statusText)
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  // Eliminar una categoría en el backend
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.API_URL}/categorias/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategorias(categorias.filter(categoria => categoria.id !== id))
      } else {
        console.error('Error deleting category:', response.statusText)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
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
          <Select
            name="tipo"
            value={newCategoria.tipo}
            onValueChange={handleInputChange}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tiposCategoria.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </Select>
          <Input
            name="descripcion"
            placeholder="Descripción"
            value={newCategoria.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Agregar Categoría
        </Button>
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
                <Button variant="ghost" size="sm">
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
