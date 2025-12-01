import React from 'react';
import CardDataStats from '../components/CardDataStats';
import { Eye, ShoppingCart, ShoppingBag, Users } from 'lucide-react';

export function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <Eye className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <ShoppingCart className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <ShoppingBag className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <Users className="text-primary dark:text-white" size={22} />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Charts can go here */}
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-100 dark:bg-meta-4 flex items-center justify-center text-bodydark">
            Chart Placeholder
          </div>
        </div>

        <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
          <h3 className="text-xl font-semibold text-black dark:text-white mb-4">Visitors Analytics</h3>
          <div className="h-64 bg-gray-100 dark:bg-meta-4 flex items-center justify-center text-bodydark">
            Chart Placeholder
          </div>
        </div>
      </div>
    </>
  );
}
