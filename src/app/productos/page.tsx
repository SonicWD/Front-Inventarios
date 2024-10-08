'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import config from '@/utils/config';

// Enum para los tipos perecibles
enum TipoPerecible {
  PERECEDERO = 'PERECEDERO',
  NO_PERECEDERO = 'NO_PERECEDERO',
}

// Interfaces
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  tipo_perecible: TipoPerecible;
  stock_minimo: number;
  unidad: string;
  precio: number;
  activo: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
}

// Componente
export function ProductosComponent() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [newProducto, setNewProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    descripcion: '',
    categoria_id: 0,
    tipo_perecible: TipoPerecible.NO_PERECEDERO, // Default value
    stock_minimo: 0,
    unidad: '',
    precio: 0,
    activo: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${config.API_URL}/items`);
      if (!response.ok) throw new Error('Error al obtener productos');
      const data: Producto[] = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${config.API_URL}/categorias`);
      if (!response.ok) throw new Error('Error al obtener categorías');
      const data: Categoria[] = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProducto(prev => ({
      ...prev,
      [name]: name === 'stock_minimo' || name === 'precio' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `${config.API_URL}/items/${newProducto.id}`
        : `${config.API_URL}/items`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProducto),
      });

      if (!response.ok) throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} el producto`);

      await fetchProductos();
      resetForm();
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} producto:`, error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.API_URL}/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el producto');

      await fetchProductos();
    } catch (error) {
      console.error('Error deleting producto:', error);
    }
  };

  const handleEdit = (producto: Producto) => {
    setNewProducto(producto);
    setIsEditing(true);
  };

  const resetForm = () => {
    setNewProducto({
      id: 0,
      nombre: '',
      descripcion: '',
      categoria_id: 0,
      tipo_perecible: TipoPerecible.NO_PERECEDERO, // Reset to default
      stock_minimo: 0,
      unidad: '',
      precio: 0,
      activo: true,
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6">Gestión de Productos</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="nombre"
            placeholder="Nombre del producto"
            value={newProducto.nombre}
            onChange={handleInputChange}
            required
          />
          <Input
            name="descripcion"
            placeholder="Descripción"
            value={newProducto.descripcion}
            onChange={handleInputChange}
          />
          <Select
            value={newProducto.categoria_id.toString()}
            onValueChange={(value) => setNewProducto(prev => ({ ...prev, categoria_id: Number(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map(categoria => (
                <SelectItem key={categoria.id} value={categoria.id.toString()}>{categoria.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={newProducto.tipo_perecible}
            onValueChange={(value) => setNewProducto(prev => ({ ...prev, tipo_perecible: value as TipoPerecible }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tipo perecible" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TipoPerecible).map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="stock_minimo"
            type="number"
            placeholder="Stock mínimo"
            value={newProducto.stock_minimo}
            onChange={handleInputChange}
            required
          />
          <Input
            name="unidad"
            placeholder="Unidad de medida"
            value={newProducto.unidad}
            onChange={handleInputChange}
            required
          />
          <Input
            name="precio"
            type="number"
            step="0.01"
            placeholder="Precio"
            value={newProducto.precio}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mt-4 flex justify-between">
          <Button type="submit">
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Actualizar Producto
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Agregar Producto
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
            <TableHead>Categoría</TableHead>
            <TableHead>Tipo Perecible</TableHead>
            <TableHead>Stock Mínimo</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{categorias.find(c => c.id === producto.categoria_id)?.nombre}</TableCell>
              <TableCell>{producto.tipo_perecible}</TableCell>
              <TableCell>{producto.stock_minimo}</TableCell>
              <TableCell>{producto.unidad}</TableCell>
              <TableCell>${producto.precio.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="link" onClick={() => handleEdit(producto)}>
                  <Edit className="mr-1 h-4 w-4" />
                </Button>
                <Button variant="link" onClick={() => handleDelete(producto.id)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
export default ProductosComponent;