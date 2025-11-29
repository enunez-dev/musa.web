import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { InputGroup, SelectGroup } from '@/components/ui/FormElements';
import api from '@/services/api';

export const EmployeeForm = () => {
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
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}`);
      const data = response.data;
      // Set form values
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await api.put(`/employees/${id}`, data);
      } else {
        await api.post('/employees', data);
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee');
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {isEditMode ? 'Edit Employee' : 'Add Employee'}
        </h2>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Employee Details
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
                required
                placeholder="Enter first name"
                customClasses="w-full xl:w-1/2"
              />
              <InputGroup
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
                required
                placeholder="Enter last name"
                customClasses="w-full xl:w-1/2"
              />
            </div>

            <InputGroup
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              required
              placeholder="Enter email address"
            />

            <InputGroup
              label="Phone"
              name="phone"
              register={register}
              error={errors.phone}
              placeholder="Enter phone number"
            />

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <SelectGroup
                label="Role"
                name="role"
                register={register}
                error={errors.role}
                required
                options={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'STYLIST', label: 'Stylist' },
                  { value: 'RECEPTIONIST', label: 'Receptionist' },
                ]}
                customClasses="w-full xl:w-1/2"
              />

              <InputGroup
                label="Commission Rate (%)"
                name="commissionRate"
                type="number"
                register={register}
                error={errors.commissionRate}
                placeholder="0"
                customClasses="w-full xl:w-1/2"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            >
              {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
