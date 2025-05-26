import React from 'react';
import { Package } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          {icon || <Package className="h-6 w-6 text-blue-600" />}
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
        {action && (
          <div className="mt-6">
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;