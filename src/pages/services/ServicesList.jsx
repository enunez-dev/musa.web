import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@/components/ui/Table';
import api from '@/services/api';
import { Edit, Trash2, Plus } from 'lucide-react';

export const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Mock data
      // const response = await api.get('/services');
      // setServices(response.data);

      setServices([
        { id: 1, name: 'Corte de Cabello', duration: 30, price: 35.00, commissionRate: 50 },
        { id: 2, name: 'Tinte Completo', duration: 120, price: 120.00, commissionRate: 40 },
        { id: 3, name: 'Manicure', duration: 45, price: 25.00, commissionRate: 60 },
      ]);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Duration (min)', accessor: 'duration' },
    { header: 'Price', accessor: 'price', render: (row) => `$${row.price.toFixed(2)}` },
    { header: 'Commission (%)', accessor: 'commissionRate', render: (row) => `${row.commissionRate}%` },
  ];

  const actions = (row) => (
    <>
      <Link
        to={`/services/${row.id}/edit`}
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
          Services
        </h2>
        <Link
          to="/services/new"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={services} actions={actions} />
      )}
    </>
  );
};
