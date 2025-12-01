import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InputGroup, SelectGroup } from '@/components/ui/FormElements';
import api from '@/services/api';
import { Plus, Trash2 } from 'lucide-react';

export const PurchaseForm = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      items: [{ product_id: '', quantity: 1, unit_cost: 0, lot_number: '', expiration_date: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch items to calculate total
  const items = watch('items');
  const totalCost = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0);
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, warehousesRes, productsRes] = await Promise.all([
          api.get('/suppliers?limit=100'),
          api.get('/warehouses?limit=100'),
          api.get('/products?limit=100')
        ]);

        setSuppliers(suppliersRes.data.data || []);
        setWarehouses(warehousesRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dependencies:', error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      // Transform data if necessary
      const payload = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_cost: Number(item.unit_cost)
        }))
      };

      await api.post('/purchases', payload); // Assuming POST /purchases maps to createPurchase
      navigate('/inventory/purchases');
    } catch (error) {
      console.error('Error creating purchase:', error);
      alert('Error creating purchase');
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          New Purchase
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            {/* General Info */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  General Information
                </h3>
              </div>
              <div className="p-6.5">
                <SelectGroup
                  label="Supplier"
                  name="supplier_id"
                  register={register}
                  error={errors.supplier_id}
                  required
                  options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                />
                <SelectGroup
                  label="Warehouse"
                  name="warehouse_id"
                  register={register}
                  error={errors.warehouse_id}
                  required
                  options={warehouses.map(w => ({ value: w.id, label: w.name }))}
                />
                <InputGroup
                  label="Date"
                  name="date"
                  type="date"
                  register={register}
                  error={errors.date}
                  required
                />
                <InputGroup
                  label="Invoice Number"
                  name="invoice_number"
                  register={register}
                  error={errors.invoice_number}
                  placeholder="INV-001"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            {/* Summary */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Summary
                </h3>
              </div>
              <div className="p-6.5">
                <div className="mb-4 flex justify-between">
                  <span className="font-medium">Total Items:</span>
                  <span>{items.length}</span>
                </div>
                <div className="mb-4 flex justify-between text-xl font-bold text-primary">
                  <span>Total Cost:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {isSubmitting ? 'Processing...' : 'Create Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-9 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
            <h3 className="font-medium text-black dark:text-white">
              Items
            </h3>
            <button
              type="button"
              onClick={() => append({ product_id: '', quantity: 1, unit_cost: 0, lot_number: '', expiration_date: '' })}
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
          <div className="p-6.5">
            {fields.map((item, index) => (
              <div key={item.id} className="mb-4 pb-4 border-b border-stroke dark:border-strokedark last:border-0 last:pb-0">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="w-full xl:w-1/4">
                    <label className="mb-2.5 block text-black dark:text-white">Product</label>
                    <select
                      {...register(`items.${index}.product_id`, { required: true })}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full xl:w-1/6">
                    <InputGroup
                      label="Quantity"
                      name={`items.${index}.quantity`}
                      type="number"
                      register={register}
                      required
                      placeholder="1"
                    />
                  </div>

                  <div className="w-full xl:w-1/6">
                    <InputGroup
                      label="Unit Cost"
                      name={`items.${index}.unit_cost`}
                      type="number"
                      register={register}
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="w-full xl:w-1/6">
                    <InputGroup
                      label="Lot Number"
                      name={`items.${index}.lot_number`}
                      register={register}
                      placeholder="Lot"
                    />
                  </div>

                  <div className="w-full xl:w-1/6">
                    <InputGroup
                      label="Expires"
                      name={`items.${index}.expiration_date`}
                      type="date"
                      register={register}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mb-3 p-2 text-danger hover:bg-danger hover:bg-opacity-10 rounded"
                    title="Remove Item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </>
  );
};
