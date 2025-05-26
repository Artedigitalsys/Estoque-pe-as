export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const getStockStatusColor = (currentStock: number, minimumStock: number): string => {
  if (currentStock <= 0) {
    return 'bg-red-100 text-red-800'; // Out of stock
  } else if (currentStock < minimumStock) {
    return 'bg-yellow-100 text-yellow-800'; // Below minimum
  } else if (currentStock < minimumStock * 1.5) {
    return 'bg-blue-100 text-blue-800'; // Near minimum
  } else {
    return 'bg-green-100 text-green-800'; // Healthy stock
  }
};

export const getStockStatusText = (currentStock: number, minimumStock: number): string => {
  if (currentStock <= 0) {
    return 'Sem estoque';
  } else if (currentStock < minimumStock) {
    return 'Estoque baixo';
  } else if (currentStock < minimumStock * 1.5) {
    return 'Estoque médio';
  } else {
    return 'Estoque bom';
  }
};