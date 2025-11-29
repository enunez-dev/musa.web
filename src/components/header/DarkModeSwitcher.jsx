import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';

const DarkModeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <label
      className={`relative m-0 block h-7.5 w-14 rounded-full ${theme === 'dark' ? 'bg-primary' : 'bg-stroke'
        }`}
    >
      <input
        type="checkbox"
        onChange={() => {
          if (theme === 'dark') {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        }}
        className="dur absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        className={`absolute top-1/2 left-[3px] flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full bg-white shadow-switcher duration-75 ease-linear ${theme === 'dark' && '!right-[3px] !translate-x-full'
          }`}
      >
        <span className="dark:hidden">
          <Sun className="h-4 w-4 text-body" />
        </span>
        <span className="hidden dark:inline-block">
          <Moon className="h-4 w-4 text-body" />
        </span>
      </span>
    </label>
  );
};

export default DarkModeSwitcher;
