
export enum UserRole {
  ADMIN = 'Admin',
  SALES_MANAGER = 'Sales Manager',
  SALES_EXECUTIVE = 'Sales Executive',
  CUSTOMER = 'Customer'
}

export interface Car {
  id: string;
  model: string;
  variant: string;
  price: number;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'Hybrid';
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  imageUrl: string;
}

export interface Booking {
  id: string;
  customerName: string;
  carModel: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string;
}

export interface DashboardStats {
  totalSales: number;
  pendingApprovals: number;
  inventoryCount: number;
  activeTestDrives: number;
}
