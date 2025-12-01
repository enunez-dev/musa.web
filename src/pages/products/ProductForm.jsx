import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { InputGroup, SelectGroup } from '@/components/ui/FormElements';
import api from '@/services/api';

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const data = response.data;
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, data);
      } else {
        await api.post('/products', data);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {isEditMode ? 'Edit Product' : 'Add Product'}
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Product Details
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Product Name"
                name="name"
                register={register}
                error={errors.name}
                required
                placeholder="Enter product name"
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="SKU"
                name="sku"
                register={register}
                error={errors.sku}
                required
                placeholder="Enter SKU"
                customClasses="w-full xl:w-1/2"
              />
            </div>

            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter product description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                {...register('description')}
              ></textarea>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Brand"
                name="brand"
                register={register}
                error={errors.brand}
                placeholder="Enter brand"
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="Barcode"
                name="barcode"
                register={register}
                error={errors.barcode}
                placeholder="Enter barcode"
                customClasses="w-full xl:w-1/2"
              />
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="Sale Price"
                name="sale_price"
                type="number"
                register={register}
                error={errors.sale_price}
                required
                placeholder="0.00"
                customClasses="w-full xl:w-1/3"
              />
              <InputGroup
                label="Cost Price"
                name="cost_price"
                type="number"
                register={register}
                error={errors.cost_price}
                placeholder="0.00"
                customClasses="w-full xl:w-1/3"
              />
              <InputGroup
                label="Min Stock Level"
                name="min_stock_level"
                type="number"
                register={register}
                error={errors.min_stock_level}
                placeholder="0"
                customClasses="w-full xl:w-1/3"
              />
            </div>

            <SelectGroup
              label="Category"
              name="category"
              register={register}
              error={errors.category}
              required
              options={[
                { value: 'Hair Care', label: 'Hair Care' },
                { value: 'Skin Care', label: 'Skin Care' },
                { value: 'Color', label: 'Color' },
                { value: 'Tools', label: 'Tools' },
              ]}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
