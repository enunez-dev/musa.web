import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@/components/ui/Table';
import api from '@/services/api';
import { Edit, Trash2, Plus } from 'lucide-react';

export const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data
      // const response = await api.get('/products');
      // setProducts(response.data);

      setProducts([
        { id: 1, name: 'Shampoo Hidratante', sku: 'SH-001', category: 'Hair Care', price: 25.00, stock: 50 },
        { id: 2, name: 'Acondicionador Reparador', sku: 'AC-002', category: 'Hair Care', price: 22.50, stock: 30 },
        { id: 3, name: 'Tinte Rojo Intenso', sku: 'TN-003', category: 'Color', price: 15.00, stock: 100 },
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price', render: (row) => `$${row.price.toFixed(2)}` },
    { header: 'Stock', accessor: 'stock' },
  ];

  const actions = (row) => (
    <>
      <Link
        to={`/products/${row.id}/edit`}
        className="hover:text-primary"
        title="Edit"
      >
        <Edit className="h-5 w-5" />
      </Link>
      <button
        onClick={() => handleDelete(row.id)}
        className="hover:text-meta-1"
        title="Delete"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </>
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Products
        </h2>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={products} actions={actions} />
      )}
    </>
  );
};
