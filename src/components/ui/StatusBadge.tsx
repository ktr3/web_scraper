import React from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      className: 'bg-amber-100 text-amber-800 border-amber-200',
      label: 'Pending',
    },
    in_progress: {
      icon: RefreshCw,
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'In Progress',
    },
    completed: {
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200',
      label: 'Completed',
    },
    failed: {
      icon: AlertCircle,
      className: 'bg-red-100 text-red-800 border-red-200',
      label: 'Failed',
    },
  };

  const { icon: Icon, className, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
      <Icon size={12} className={status === 'in_progress' ? 'animate-spin' : ''} />
      {label}
    </span>
  );
}