import React from 'react';
import { Movement } from '../types';
import { formatDateTime } from '../utils/helpers';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface MovementItemProps {
  movement: Movement;
}

const MovementItem: React.FC<MovementItemProps> = ({ movement }) => {
  const { getPartById } = useAppContext();
  const part = getPartById(movement.partId);

  if (!part) return null;

  const isEntry = movement.type === 'entry';
  
  return (
    <div className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className={`flex-shrink-0 ${isEntry ? 'text-green-500' : 'text-red-500'}`}>
        {isEntry ? (
          <ArrowDownCircle className="h-6 w-6" />
        ) : (
          <ArrowUpCircle className="h-6 w-6" />
        )}
      </div>
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-900">{part.name}</span>
          <span className={`text-sm font-medium ${isEntry ? 'text-green-600' : 'text-red-600'}`}>
            {isEntry ? '+' : '-'}{movement.quantity} {part.unit}
          </span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{movement.notes || 'Sem observações'}</span>
          <span className="text-xs text-gray-500">{formatDateTime(movement.date)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovementItem;