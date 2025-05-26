import React from 'react';
import { getStockStatusColor, getStockStatusText } from '../utils/helpers';

interface StockBadgeProps {
  currentStock: number;
  minimumStock: number;
  showText?: boolean;
  className?: string;
}

const StockBadge: React.FC<StockBadgeProps> = ({ 
  currentStock, 
  minimumStock, 
  showText = true,
  className = '' 
}) => {
  const colorClass = getStockStatusColor(currentStock, minimumStock);
  const statusText = getStockStatusText(currentStock, minimumStock);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {showText ? statusText : `${currentStock}`}
    </span>
  );
};

export default StockBadge;