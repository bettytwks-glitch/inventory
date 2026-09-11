export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItem {
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  description?: string;
}
