export interface Part {
  id: string;
  code: string;
  name: string;
  description: string;
  minimumStock: number;
  currentStock: number;
  unit: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movement {
  id: string;
  partId: string;
  type: 'entry' | 'exit';
  quantity: number;
  date: Date;
  notes: string;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface DashboardSummary {
  totalParts: number;
  lowStockCount: number;
  totalEntries: number;
  totalExits: number;
}