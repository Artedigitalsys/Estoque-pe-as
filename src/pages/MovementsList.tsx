import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Filter, Calendar, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card, { CardBody } from '../components/Card';
import MovementItem from '../components/MovementItem';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';

const MovementsList: React.FC = () => {
  const { movements, parts } = useAppContext();
  const [typeFilter, setTypeFilter] = useState<'all' | 'entry' | 'exit'>('all');
  const [partFilter, setPartFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  
  const filteredMovements = movements
    .filter(movement => {
      const matchesType = typeFilter === 'all' || movement.type === typeFilter;
      const matchesPart = !partFilter || movement.partId === partFilter;
      const matchesDate = !dateFilter || 
        new Date(movement.date).toISOString().split('T')[0] === dateFilter;
      
      return matchesType && matchesPart && matchesDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalEntries = movements.filter(m => m.type === 'entry').length;
  const totalExits = movements.filter(m => m.type === 'exit').length;
  
  return (
    <Layout>
      <PageHeader 
        title="Movimentações de Estoque" 
        description="Histórico de entradas e saídas do estoque"
      />
      
      {movements.length > 0 ? (
        <>
          <Card className="mb-6">
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <label htmlFor="partFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Peça
                  </label>
                  <select
                    id="partFilter"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={partFilter}
                    onChange={(e) => setPartFilter(e.target.value)}
                  >
                    <option value="">Todas as peças</option>
                    {parts.map(part => (
                      <option key={part.id} value={part.id}>
                        {part.name} ({part.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="w-full md:w-48">
                  <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="typeFilter"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as 'all' | 'entry' | 'exit')}
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="entry">Entradas</option>
                      <option value="exit">Saídas</option>
                    </select>
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="dateFilter"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                </div>
                
                {(typeFilter !== 'all' || partFilter !== '' || dateFilter !== '') && (
                  <div className="flex items-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setTypeFilter('all');
                        setPartFilter('');
                        setDateFilter('');
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="p-0">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Movimentações ({filteredMovements.length})
                </h3>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <ArrowDownCircle className="h-4 w-4 mr-1" />
                    Entradas: {totalEntries}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <ArrowUpCircle className="h-4 w-4 mr-1" />
                    Saídas: {totalExits}
                  </span>
                </div>
              </div>
              
              {filteredMovements.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredMovements.map(movement => (
                    <MovementItem key={movement.id} movement={movement} />
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  Nenhuma movimentação encontrada com os filtros selecionados.
                </div>
              )}
            </CardBody>
          </Card>
        </>
      ) : (
        <EmptyState
          title="Nenhuma movimentação registrada"
          description="Comece adicionando uma entrada ou saída de estoque para uma peça."
          action={{
            label: "Ver Peças",
            onClick: () => window.location.href = '/parts',
          }}
        />
      )}
    </Layout>
  );
};

export default MovementsList;