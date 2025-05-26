import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface QuoteItem {
  partId: string;
  quantity: number;
  laborHours: number;
  laborRate: number;
}

const QuoteGenerator: React.FC = () => {
  const { parts } = useAppContext();
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  
  const addItem = () => {
    setItems([...items, {
      partId: parts[0]?.id || '',
      quantity: 1,
      laborHours: 1,
      laborRate: 50
    }]);
  };
  
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const updateItem = (index: number, updates: Partial<QuoteItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...updates } : item));
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const part = parts.find(p => p.id === item.partId);
      const partCost = (part?.currentStock || 0) * item.quantity;
      const laborCost = item.laborHours * item.laborRate;
      return total + partCost + laborCost;
    }, 0);
  };
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('Orçamento', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Cliente: ${clientName}`, 20, 40);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 50);
    
    if (description) {
      doc.text('Descrição:', 20, 60);
      doc.setFontSize(10);
      doc.text(description, 20, 70);
    }
    
    // Add items table
    const tableData = items.map(item => {
      const part = parts.find(p => p.id === item.partId);
      const partCost = (part?.currentStock || 0) * item.quantity;
      const laborCost = item.laborHours * item.laborRate;
      
      return [
        part?.name || '',
        item.quantity.toString(),
        `R$ ${partCost.toFixed(2)}`,
        `${item.laborHours}h`,
        `R$ ${laborCost.toFixed(2)}`,
        `R$ ${(partCost + laborCost).toFixed(2)}`
      ];
    });
    
    (doc as any).autoTable({
      startY: description ? 80 : 60,
      head: [['Item', 'Qtd', 'Custo Peças', 'Horas', 'Custo MO', 'Total']],
      body: tableData,
    });
    
    // Add total
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.text(`Total: R$ ${calculateTotal().toFixed(2)}`, 150, finalY + 20, { align: 'right' });
    
    doc.save('orcamento.pdf');
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Gerador de Orçamentos" 
        description="Crie orçamentos para serviços e peças"
        action={
          <Button 
            variant="primary" 
            icon={<Download className="h-4 w-4" />}
            onClick={generatePDF}
            disabled={items.length === 0}
          >
            Gerar PDF
          </Button>
        }
      />
      
      <div className="space-y-6">
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader 
            title="Itens do Orçamento"
            action={
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={addItem}
              >
                Adicionar Item
              </Button>
            }
          />
          <CardBody className="p-0">
            {items.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Peça
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={item.partId}
                          onChange={(e) => updateItem(index, { partId: e.target.value })}
                        >
                          {parts.map(part => (
                            <option key={part.id} value={part.id}>
                              {part.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Horas de Trabalho
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={item.laborHours}
                          onChange={(e) => updateItem(index, { laborHours: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Valor Hora
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={item.laborRate}
                            onChange={(e) => updateItem(index, { laborRate: parseFloat(e.target.value) || 0 })}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="ml-2"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => removeItem(index)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-end">
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-500">Total:</span>
                      <span className="ml-2 text-lg font-semibold">
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum item adicionado ao orçamento
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default QuoteGenerator;