import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card, { CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const Settings: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useAppContext();
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddCategoryModalOpen(false);
    }
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };
  
  return (
    <Layout>
      <PageHeader 
        title="Configurações" 
        description="Gerencie as configurações do sistema"
      />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader 
            title="Categorias" 
            action={
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setIsAddCategoryModalOpen(true)}
              >
                Nova Categoria
              </Button>
            } 
          />
          <CardBody className="p-0">
            {categories.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-4">
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => setCategoryToDelete(category.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-gray-500">
                Nenhuma categoria cadastrada
              </div>
            )}
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader title="Sobre o Sistema" />
          <CardBody>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Versão</h3>
                <p className="mt-1 text-sm text-gray-500">1.0.0</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700">Desenvolvido por</h3>
                <p className="mt-1 text-sm text-gray-500">EstoqueApp</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700">Descrição</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sistema de gerenciamento de estoque para controle de peças, movimentações
                  de entrada e saída, e atualização automática do saldo com alerta de estoque mínimo.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Adicionar Nova Categoria"
        size="md"
        footer={
          <>
            <Button
              variant="primary"
              className="sm:ml-3"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
            >
              Adicionar
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setIsAddCategoryModalOpen(false)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
            Nome da Categoria
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex: Eletrônicos, Mecânicos, etc."
            />
          </div>
        </div>
      </Modal>
      
      {/* Delete Category Confirmation Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Excluir Categoria"
        size="md"
        footer={
          <>
            <Button
              variant="danger"
              className="sm:ml-3"
              onClick={handleDeleteCategory}
            >
              Excluir
            </Button>
            <Button
              variant="secondary"
              className="mt-3 sm:mt-0"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancelar
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Você tem certeza que deseja excluir esta categoria? Esta ação não afetará as peças que já estão utilizando esta categoria.
        </p>
      </Modal>
    </Layout>
  );
};

export default Settings;