import React, { createContext, useContext, useState, useEffect } from 'react';
import { Part, Movement, Category } from '../types';
import { generateId } from '../utils/helpers';

interface AppContextType {
  parts: Part[];
  movements: Movement[];
  categories: Category[];
  addPart: (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt' | 'currentStock'>) => void;
  updatePart: (id: string, part: Partial<Part>) => void;
  deletePart: (id: string) => void;
  addMovement: (movement: Omit<Movement, 'id'>) => void;
  getPartById: (id: string) => Part | undefined;
  getPartMovements: (partId: string) => Movement[];
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  getDashboardSummary: () => {
    totalParts: number;
    lowStockCount: number;
    recentMovements: Movement[];
    lowStockParts: Part[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Mecânicos' },
  { id: '3', name: 'Elétricos' },
  { id: '4', name: 'Hidráulicos' },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parts, setParts] = useState<Part[]>(() => {
    const savedParts = localStorage.getItem('inventory-parts');
    return savedParts ? JSON.parse(savedParts) : [];
  });
  
  const [movements, setMovements] = useState<Movement[]>(() => {
    const savedMovements = localStorage.getItem('inventory-movements');
    return savedMovements ? JSON.parse(savedMovements) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('inventory-categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inventory-parts', JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem('inventory-movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('inventory-categories', JSON.stringify(categories));
  }, [categories]);

  const addPart = (part: Omit<Part, 'id' | 'createdAt' | 'updatedAt' | 'currentStock'>) => {
    const newPart: Part = {
      ...part,
      id: generateId(),
      currentStock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setParts([...parts, newPart]);
  };

  const updatePart = (id: string, updates: Partial<Part>) => {
    setParts(parts.map(part => 
      part.id === id ? { ...part, ...updates, updatedAt: new Date() } : part
    ));
  };

  const deletePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
    // Also delete all movements for this part
    setMovements(movements.filter(movement => movement.partId !== id));
  };

  const addMovement = (movement: Omit<Movement, 'id'>) => {
    const newMovement: Movement = {
      ...movement,
      id: generateId(),
    };
    
    setMovements([...movements, newMovement]);
    
    // Update the part's current stock
    const part = parts.find(p => p.id === movement.partId);
    if (part) {
      const stockChange = movement.type === 'entry' ? movement.quantity : -movement.quantity;
      updatePart(part.id, { 
        currentStock: part.currentStock + stockChange 
      });
    }
  };

  const getPartById = (id: string) => {
    return parts.find(part => part.id === id);
  };

  const getPartMovements = (partId: string) => {
    return movements
      .filter(movement => movement.partId === partId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: generateId(),
      name
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const getDashboardSummary = () => {
    const lowStockParts = parts.filter(part => part.currentStock < part.minimumStock);
    const recentMovements = [...movements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    return {
      totalParts: parts.length,
      lowStockCount: lowStockParts.length,
      recentMovements,
      lowStockParts
    };
  };

  const value = {
    parts,
    movements,
    categories,
    addPart,
    updatePart,
    deletePart,
    addMovement,
    getPartById,
    getPartMovements,
    addCategory,
    deleteCategory,
    getDashboardSummary,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};