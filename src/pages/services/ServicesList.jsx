import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import api from '@/services/api';
import { Edit, Trash2, Plus } from 'lucide-react';

export const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const fetchServices = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`/services?page=${page}&limit=${limit}`);
      setServices(response.data.data);
      setServices(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
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
        fetchServices(currentPage);
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Duration (min)', accessor: 'duration_minutes' },
    { header: 'Price', accessor: 'base_price', render: (row) => `$${Number(row.base_price || 0).toFixed(2)}` },
    { header: 'Commission (%)', accessor: 'default_commission_percent', render: (row) => `${row.default_commission_percent}%` },
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
        <>
          <Table columns={columns} data={services} actions={actions} />
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </>
  );
};
