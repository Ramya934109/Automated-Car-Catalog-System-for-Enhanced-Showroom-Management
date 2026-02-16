
import { Car, Booking } from './types';

export const MOCK_CARS: Car[] = [
  { id: '1', model: 'Tesla Model S', variant: 'Plaid', price: 89990, fuelType: 'EV', stockStatus: 'In Stock', imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad42243c5d?auto=format&fit=crop&q=80&w=400' },
  { id: '2', model: 'BMW M4', variant: 'Competition', price: 78600, fuelType: 'Petrol', stockStatus: 'Low Stock', imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f3ca9940311?auto=format&fit=crop&q=80&w=400' },
  { id: '3', model: 'Mercedes EQE', variant: '350+', price: 74900, fuelType: 'EV', stockStatus: 'In Stock', imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400' },
  { id: '4', model: 'Audi RS6', variant: 'Avant', price: 121900, fuelType: 'Petrol', stockStatus: 'Out of Stock', imageUrl: 'https://images.unsplash.com/photo-1606152424101-ad2f9a287bd6?auto=format&fit=crop&q=80&w=400' },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'B1', customerName: 'John Doe', carModel: 'Tesla Model S', date: '2023-11-20', status: 'Pending', priority: 'High', assignedTo: 'Sarah Jenkins' },
  { id: 'B2', customerName: 'Jane Smith', carModel: 'BMW M4', date: '2023-11-21', status: 'Approved', priority: 'Medium', assignedTo: 'Mike Ross' },
  { id: 'B3', customerName: 'Alice Wong', carModel: 'Mercedes EQE', date: '2023-11-22', status: 'Completed', priority: 'Low', assignedTo: 'Sarah Jenkins' },
];

// Fix: Added missing SALES_DATA for the dashboard bar chart visualization
export const SALES_DATA = [
  { name: 'Jul', sales: 32 },
  { name: 'Aug', sales: 45 },
  { name: 'Sep', sales: 28 },
  { name: 'Oct', sales: 52 },
  { name: 'Nov', sales: 42 },
];

// Fix: Added missing INVENTORY_DATA for the dashboard pie chart visualization
export const INVENTORY_DATA = [
  { name: 'Petrol', value: 40, color: '#6366f1' },
  { name: 'EV', value: 35, color: '#10b981' },
  { name: 'Hybrid', value: 15, color: '#f59e0b' },
  { name: 'Diesel', value: 10, color: '#ef4444' },
];
