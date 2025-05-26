import React from 'react';
import { Link } from 'react-router-dom';
import { Part } from '../types';
import Card, { CardBody, CardFooter } from './Card';
import StockBadge from './StockBadge';
import { formatDate } from '../utils/helpers';
import Badge from './Badge';

interface PartCardProps {
  part: Part;
}

const PartCard: React.FC<PartCardProps> = ({ part }) => {
  return (
    <Link to={`/parts/${part.id}`} className="block hover:shadow-md transition-shadow duration-200">
      <Card>
        <CardBody>
          <div className="flex justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{part.name}</h3>
              <p className="text-sm text-gray-500">Código: {part.code}</p>
            </div>
            <StockBadge 
              currentStock={part.currentStock} 
              minimumStock={part.minimumStock} 
            />
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-2">{part.description}</p>
          </div>
          <div className="mt-4 flex items-center">
            <Badge variant="secondary">{part.category}</Badge>
            <div className="ml-auto text-sm text-gray-500">
              Estoque: <span className="font-medium">{part.currentStock}</span> {part.unit}
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex justify-between items-center text-xs text-gray-500">
          <div>Mínimo: {part.minimumStock} {part.unit}</div>
          <div>Atualizado em: {formatDate(part.updatedAt)}</div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PartCard;