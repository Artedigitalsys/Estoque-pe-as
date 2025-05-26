import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Edit, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Layout from '../components/Layout';
import Card, { CardBody, CardHeader } from '../components/Card';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import StockBadge from '../components/StockBadge';
import MovementItem from '../components/MovementItem';
import Modal from '../components/Modal';
import { formatDate } from '../utils/helpers';

const PartDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPartById, getPartMovements, updatePart, deletePart, addMovement } = useAppContext();
  
  const part = getPartById(id || '');
  const movements = getPartMovements(id || '');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [isAddExitModalOpen, setIsAddExitModalOpen] = useState(false);
  
  const [editedPart, setEditedPart] = useState(part);
  
  const [newMovement, setNewMovement] = useState({
    quantity: 1,
    notes: '',
    date: new Date().toISOString().slice(0, 10),
    createdBy: 'Usuário',
  });
  
  if (!part) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Peça não encontrada</h2>
          <div className="mt-6">
            <Button 
              variant="primary" 
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/parts')}
            >
              Voltar para lista
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPart({
      ...editedPart!,
      [name]: name === 'minimumStock' ? parseInt(value) || 0 : value,
    });
  };
  
  const handleMovementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMovement({
      ...newMovement,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    });
  };
  
  const handleUpdatePart = () => {
    if (editedPart) {
      updatePart(part.id, editedPart);
      setIsEditModalOpen(false);
    }
  };
  
  const handleDeletePart = () => {
    deletePart(part.id);
    navigate('/parts');
  };
  
  const handleAddMovement = (type: 'entry' | 'exit') => {
    addMovement({
      partId: part.id,
      type,
      quantity: newMovement.quantity,
      date: new Date(newMovement.date),
      notes: newMovement.notes,
      createdBy: newMovement.createdBy,
    });
    
    setNewMovement({
      quantity: 1,
      notes: '',
      date: new Date().toISOString().slice(0, 10),
      createdBy: 'Usuário',
    });
    
    if (type === 'entry') {
      setIsAddEntryModalOpen(false);
    } else {
      setIsAddExitModalOpen(false);
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title={part.name} 
        description={`Código: ${part.code}`}
        action={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/parts')}
            >
              Voltar
            </Button>
            <Button 
              variant="primary" 
              icon={<ArrowDownCircle className="h-4 w-4" />}
              onClick={() => setIsAddEntryModalOpen(true)}
            >
              Entrada
            </Button>
            <Button 
              variant="secondary" 
              icon={<ArrowUpCircle className="h-4 w-4" />}
              onClick={() => setIsAddExitModalOpen(true)}
            >
              Saída
            </Button>
          </div>
        } 
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader 
              title="Detalhes da Peça" 
              action={
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<Edit className="h-4 w-4" />}
                    onClick={() => {
                      setEditedPart(part);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Excluir
                  </Button>
                </div>
              } 
            />
            <CardBody>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{part.name}</h3>
                    <p className="text-sm text-gray-500">Código: {part.code}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <StockBadge 
                      currentStock={part.currentStock} 
                      minimumStock={part.minimumStock}
                      className="text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-700">
                      Estoque Atual: <span className="font-medium">{part.currentStock}</span> {part.unit}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Descrição</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {part.description || "Sem descrição disponível."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Categoria</h4>
                    <p className="mt-1 text-sm text-gray-500">{part.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Estoque Mínimo</h4>
                    <p className="mt-1 text-sm text-gray-500">{part.minimumStock} {part.unit}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Unidade</h4>
                    <p className="mt-1 text-sm text-gray-500">{part.unit}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Data de Criação</h4>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(part.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Última Atualização</h4>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(part.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader title="Resumo de Estoque" />
            <CardBody>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Estoque Atual:</span>
                  <span className="text-lg font-medium">{part.currentStock} {part.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Estoque Mínimo:</span>
                  <span className="text-lg font-medium">{part.minimumStock} {part.unit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status:</span>
                  <StockBadge 
                    currentStock={part.currentStock} 
                    minimumStock={part.minimumStock} 
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  icon={<ArrowDownCircle className="h-4 w-4" />}
                  onClick={() => setIsAddEntryModalOpen(true)}
                >
                  Entrada
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  icon={<ArrowUpCircle className="h-4 w-4" />}
                  onClick={() => setIsAddExitModalOpen(true)}
                >
                  Saída
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader title={`Histórico de Movimentações (${movements.length})`} />
          <CardBody className="p-0">
            {movements.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {movements.map(movement => (
                  <MovementItem key={movement.id} movement={movement} />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                Nenhuma movimentação registrada para esta peça
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Peça"
        size="lg"
        footer={
          <>
            <Button
              variant="primary"
              className="sm:ml-3"
              onClick={handleUpdatePart}
            >
              Salvar
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        {editedPart && (
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editedPart.code}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editedPart.name}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <div className="mt-1">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editedPart.description}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700">
                Estoque Mínimo
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="minimumStock"
                  id="minimumStock"
                  min="0"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editedPart.minimumStock}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unidade
              </label>
              <div className="mt-1">
                <select
                  name="unit"
                  id="unit"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editedPart.unit}
                  onChange={handleEditChange}
                >
                  <option value="un">Unidade (un)</option>
                  <option value="kg">Kilograma (kg)</option>
                  <option value="g">Grama (g)</option>
                  <option value="l">Litro (l)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="m">Metro (m)</option>
                  <option value="cm">Centímetro (cm)</option>
                  <option value="pc">Peça (pc)</option>
                  <option value="cx">Caixa (cx)</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="category"
                  id="category"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={editedPart.category}
                  onChange={handleEditChange}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Peça"
        size="md"
        footer={
          <>
            <Button
              variant="danger"
              className="sm:ml-3"
              onClick={handleDeletePart}
            >
              Excluir
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Você tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita e todos os dados de movimentação associados serão perdidos.
        </p>
      </Modal>
      
      {/* Add Entry Modal */}
      <Modal
        isOpen={isAddEntryModalOpen}
        onClose={() => setIsAddEntryModalOpen(false)}
        title="Registrar Entrada de Estoque"
        size="md"
        footer={
          <>
            <Button
              variant="primary"
              className="sm:ml-3"
              onClick={() => handleAddMovement('entry')}
              disabled={newMovement.quantity <= 0}
            >
              Registrar
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setIsAddEntryModalOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantidade
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newMovement.quantity}
                onChange={handleMovementChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="date"
                id="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newMovement.date}
                onChange={handleMovementChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <div className="mt-1">
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newMovement.notes}
                onChange={handleMovementChange}
                placeholder="Opcional: adicione informações sobre esta movimentação"
              />
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Add Exit Modal */}
      <Modal
        isOpen={isAddExitModalOpen}
        onClose={() => setIsAddExitModalOpen(false)}
        title="Registrar Saída de Estoque"
        size="md"
        footer={
          <>
            <Button
              variant="primary"
              className="sm:ml-3"
              onClick={() => handleAddMovement('exit')}
              disabled={newMovement.quantity <= 0 || newMovement.quantity > part.currentStock}
            >
              Registrar
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setIsAddExitModalOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantidade
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="quantity"
                id="quantity"
                min="1"
                max={part.currentStock}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newMovement.quantity}
                onChange={handleMovementChange}
              />
              {newMovement.quantity > part.currentStock && (
                <p className="mt-1 text-xs text-red-600">
                  A quantidade não pode ser maior que o estoque atual ({part.currentStock} {part.unit})
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="date"
                id="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newMovement.date}
                onChange={handleMovementChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <div className="mt-1">
              <textarea
                name="notes"
                id="notes"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newMovement.notes}
                onChange={handleMovementChange}
                placeholder="Opcional: adicione informações sobre esta movimentação"
              />
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default PartDetail;