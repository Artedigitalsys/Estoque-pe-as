import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle, Download } from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/Card';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import MovementItem from '../components/MovementItem';
import StockBadge from '../components/StockBadge';
import { exportToExcel, exportToPDF } from '../utils/export';

const Dashboard: React.FC = () => {
  const { getDashboardSummary, parts } = useAppContext();
  const { totalParts, lowStockCount, recentMovements, lowStockParts } = getDashboardSummary();

  const handleExportExcel = () => {
    exportToExcel(
      parts.filter(part => part.currentStock <= part.minimumStock),
      'estoque-baixo'
    );
  };

  const handleExportPDF = () => {
    exportToPDF(
      parts.filter(part => part.currentStock <= part.minimumStock),
      'Relatório de Estoque Baixo',
      'estoque-baixo'
    );
  };

  return (
    <Layout>
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do seu estoque"
      />
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total de Peças</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalParts}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Estoque Baixo</h3>
              <p className="text-2xl font-semibold text-gray-900">{lowStockCount}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ArrowDownCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Entradas</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {recentMovements.filter(m => m.type === 'entry').length}
              </p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <ArrowUpCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Saídas</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {recentMovements.filter(m => m.type === 'exit').length}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader 
            title="Movimentações Recentes" 
            action={
              <Link to="/movements">
                <Button variant="outline" size="sm">Ver todas</Button>
              </Link>
            } 
          />
          <CardBody className="p-0">
            {recentMovements.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentMovements.map(movement => (
                  <MovementItem key={movement.id} movement={movement} />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                Nenhuma movimentação registrada
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader 
            title="Peças com Estoque Baixo" 
            action={
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="h-4 w-4" />}
                  onClick={handleExportExcel}
                  disabled={lowStockParts.length === 0}
                >
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="h-4 w-4" />}
                  onClick={handleExportPDF}
                  disabled={lowStockParts.length === 0}
                >
                  PDF
                </Button>
                <Link to="/parts">
                  <Button variant="outline" size="sm">Ver todas</Button>
                </Link>
              </div>
            } 
          />
          <CardBody className="p-0">
            {lowStockParts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {lowStockParts.map(part => (
                  <Link 
                    to={`/parts/${part.id}`} 
                    key={part.id}
                    className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{part.name}</h3>
                      <p className="text-xs text-gray-500">Código: {part.code}</p>
                    </div>
                    <div className="text-right">
                      <StockBadge 
                        currentStock={part.currentStock} 
                        minimumStock={part.minimumStock}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {part.currentStock}/{part.minimumStock} {part.unit}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                Nenhuma peça com estoque baixo
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;