import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InputGroup, SelectGroup } from '@/components/ui/FormElements';
import api from '@/services/api';
import { Plus, Trash2 } from 'lucide-react';

export const SalesForm = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

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
      payment_method: 'cash',
      items: [{ item_type: 'product', id: '', quantity: 1, unit_price: 0, lot_number: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch items to calculate total
  const items = watch('items');
  const totalAmount = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehousesRes, productsRes, servicesRes] = await Promise.all([
          api.get('/warehouses?limit=100'),
          api.get('/products?limit=100'),
          api.get('/services?limit=100')
        ]);

        setWarehouses(warehousesRes.data.data || []);
        setProducts(productsRes.data.data || []);
        setServices(servicesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dependencies:', error);
      }
    };
    fetchData();
  }, []);

  // Handle item selection change to auto-fill price
  const handleItemChange = (index, type, id) => {
    if (!id) return;

    let price = 0;
    if (type === 'product') {
      const product = products.find(p => p.id === Number(id));
      if (product) price = product.sale_price;
    } else {
      const service = services.find(s => s.id === Number(id));
      if (service) price = service.base_price;
    }

    setValue(`items.${index}.unit_price`, price);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          id: Number(item.id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        }))
      };

      await api.post('/sales', payload); // Assuming POST /sales maps to createSale in transactionController
      navigate('/sales');
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Error creating sale');
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          New Sale (POS)
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            {/* General Info */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Sale Details
                </h3>
              </div>
              <div className="p-6.5">
                <SelectGroup
                  label="Warehouse"
                  name="warehouse_id"
                  register={register}
                  error={errors.warehouse_id}
                  required
                  options={warehouses.map(w => ({ value: w.id, label: w.name }))}
                />
                <InputGroup
                  label="Customer Name"
                  name="customer_name"
                  register={register}
                  error={errors.customer_name}
                  required
                  placeholder="Walk-in Customer"
                />
                <SelectGroup
                  label="Payment Method"
                  name="payment_method"
                  register={register}
                  error={errors.payment_method}
                  required
                  options={[
                    { value: 'cash', label: 'Cash' },
                    { value: 'card', label: 'Card' },
                    { value: 'transfer', label: 'Transfer' },
                  ]}
                />
                <InputGroup
                  label="Date"
                  name="date"
                  type="date"
                  register={register}
                  error={errors.date}
                  required
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
                  <span>Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Sale'}
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
              onClick={() => append({ item_type: 'product', id: '', quantity: 1, unit_price: 0, lot_number: '' })}
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
          <div className="p-6.5">
            {fields.map((item, index) => {
              const currentType = items[index]?.item_type || 'product';
              return (
                <div key={item.id} className="mb-4 pb-4 border-b border-stroke dark:border-strokedark last:border-0 last:pb-0">
                  <div className="flex flex-wrap gap-4 items-end">

                    <div className="w-full xl:w-1/6">
                      <label className="mb-2.5 block text-black dark:text-white">Type</label>
                      <select
                        {...register(`items.${index}.item_type`)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onChange={(e) => {
                          setValue(`items.${index}.item_type`, e.target.value);
                          setValue(`items.${index}.id`, ''); // Reset selection
                          setValue(`items.${index}.unit_price`, 0);
                        }}
                      >
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                      </select>
                    </div>

                    <div className="w-full xl:w-1/4">
                      <label className="mb-2.5 block text-black dark:text-white">Item</label>
                      <select
                        {...register(`items.${index}.id`, { required: true })}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onChange={(e) => {
                          setValue(`items.${index}.id`, e.target.value);
                          handleItemChange(index, currentType, e.target.value);
                        }}
                      >
                        <option value="">Select...</option>
                        {currentType === 'product' ? (
                          products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                          ))
                        ) : (
                          services.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))
                        )}
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
                        label="Unit Price"
                        name={`items.${index}.unit_price`}
                        type="number"
                        register={register}
                        required
                        placeholder="0.00"
                      />
                    </div>

                    {currentType === 'product' && (
                      <div className="w-full xl:w-1/6">
                        <InputGroup
                          label="Lot Number"
                          name={`items.${index}.lot_number`}
                          register={register}
                          placeholder="Optional"
                        />
                      </div>
                    )}

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
              )
            })}
          </div>
        </div>
      </form>
    </>
  );
};
