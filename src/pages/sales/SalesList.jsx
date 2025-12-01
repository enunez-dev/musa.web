import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import api from '@/services/api';
import { Plus, Eye } from 'lucide-react';

export const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchSales(currentPage);
  }, [currentPage]);

  const fetchSales = async (page) => {
    setLoading(true);
    try {
      // Trying /reports/sales as per reportController logic
      const response = await api.get(`/reports/sales?page=${page}&limit=${limit}`);
      console.log('Sales API Response:', response.data);

      if (Array.isArray(response.data)) {
        setSales(response.data);
        setTotalPages(1);
      } else {
        setSales(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Date', accessor: 'date', render: (row) => new Date(row.date).toLocaleDateString() },
    { header: 'Customer', accessor: 'customer_name' },
    { header: 'Payment Method', accessor: 'payment_method' },
    { header: 'Total Amount', accessor: 'total_amount', render: (row) => `$${Number(row.total_amount || 0).toFixed(2)}` },
    { header: 'Warehouse', accessor: 'Warehouse.name', render: (row) => row.Warehouse?.name || 'N/A' },
  ];

  const actions = (row) => (
    <>
      <button className="hover:text-primary" title="View Details">
        <Eye className="h-5 w-5" />
      </button>
    </>
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Sales (POS)
        </h2>
        <Link
          to="/sales/new"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <Plus className="h-5 w-5" />
          New Sale
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table columns={columns} data={sales} actions={actions} />
          <div className="mt-4">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
