import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import PartCard from '../components/PartCard';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import Card from '../components/Card';

const PartsList: React.FC = () => {
  const { parts, categories, addPart } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [newPart, setNewPart] = useState({
    code: '',
    name: '',
    description: '',
    minimumStock: 0,
    unit: 'un',
    category: categories[0]?.id || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPart({
      ...newPart,
      [name]: name === 'minimumStock' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryObj = categories.find(cat => cat.id === newPart.category);
    
    addPart({
      ...newPart,
      category: categoryObj?.name || '',
    });
    
    setNewPart({
      code: '',
      name: '',
      description: '',
      minimumStock: 0,
      unit: 'un',
      category: categories[0]?.id || '',
    });
    
    setIsAddModalOpen(false);
  };

  const filteredParts = parts
    .filter(part => 
      (part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       part.code.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter ? part.category === categoryFilter : true)
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <Layout>
      <PageHeader 
        title="Cadastro de Peças" 
        description="Gerencie todas as peças do seu estoque"
        action={
          <Button 
            variant="primary" 
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Nova Peça
          </Button>
        } 
      />
      
      {parts.length > 0 ? (
        <>
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Buscar por nome ou código"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="sm:w-48">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredParts.map(part => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
          
          {filteredParts.length === 0 && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">Nenhuma peça encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar seus filtros ou adicione uma nova peça.
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="Nenhuma peça cadastrada"
          description="Comece adicionando sua primeira peça ao estoque."
          action={{
            label: "Adicionar Peça",
            onClick: () => setIsAddModalOpen(true),
          }}
        />
      )}
      
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Nova Peça"
        size="lg"
        footer={
          <>
            <Button
              variant="primary"
              className="sm:ml-3"
              onClick={handleSubmit}
              disabled={!newPart.name || !newPart.code}
            >
              Salvar
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="code"
                  id="code"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newPart.code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newPart.name}
                  onChange={handleInputChange}
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
                  value={newPart.description}
                  onChange={handleInputChange}
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
                  value={newPart.minimumStock}
                  onChange={handleInputChange}
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
                  value={newPart.unit}
                  onChange={handleInputChange}
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
                <select
                  name="category"
                  id="category"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newPart.category}
                  onChange={handleInputChange}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default PartsList;