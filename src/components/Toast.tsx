import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-rose-50 border-rose-200',
    info: 'bg-sky-50 border-sky-200'
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg animate-in slide-in-from-right duration-300",
      bgColors[type]
    )}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 mr-8 text-sm font-medium text-slate-800">{message}</div>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 focus:outline-none"
      >
        <span className="sr-only">Close</span>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
