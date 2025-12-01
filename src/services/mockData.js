export const mockData = {
  users: [
    { id: 1, username: 'admin', password_hash: 'admin', role: 'admin', email: 'admin@musa.com' },
    { id: 2, username: 'user', password_hash: 'user', role: 'user', email: 'user@musa.com' },
  ],
  employees: [
    { id: 1, name: 'Maria Gonzalez', role: 'Stylist', phone: '555-0101', email: 'maria@musa.com', hire_date: '2023-01-15', active: true },
    { id: 2, name: 'Carlos Rodriguez', role: 'Manager', phone: '555-0102', email: 'carlos@musa.com', hire_date: '2022-11-01', active: true },
    { id: 3, name: 'Ana Silva', role: 'Receptionist', phone: '555-0103', email: 'ana@musa.com', hire_date: '2023-03-10', active: true },
  ],
  products: [
    { id: 1, name: 'Shampoo Pro', description: 'Professional Shampoo', category: 'Hair Care', brand: 'Loreal', sku: 'SH-001', barcode: '123456789', min_stock_level: 10, cost_price: 15.00, sale_price: 25.00 },
    { id: 2, name: 'Conditioner Silk', description: 'Silk Touch Conditioner', category: 'Hair Care', brand: 'Loreal', sku: 'CN-001', barcode: '987654321', min_stock_level: 10, cost_price: 18.00, sale_price: 30.00 },
    { id: 3, name: 'Hair Dye Red', description: 'Vibrant Red', category: 'Color', brand: 'Wella', sku: 'HD-RED', barcode: '456123789', min_stock_level: 5, cost_price: 12.00, sale_price: 22.00 },
  ],
  services: [
    { id: 1, name: 'Haircut', description: 'Standard Haircut', category: 'Hair', duration_minutes: 45, base_price: 35.00, default_commission_percent: 40 },
    { id: 2, name: 'Coloring', description: 'Full Hair Coloring', category: 'Color', duration_minutes: 120, base_price: 80.00, default_commission_percent: 35 },
    { id: 3, name: 'Manicure', description: 'Basic Manicure', category: 'Nails', duration_minutes: 30, base_price: 20.00, default_commission_percent: 50 },
  ],
  warehouses: [
    { id: 1, name: 'Main Store', location: 'Downtown', phone: '555-1000', description: 'Main inventory storage' },
    { id: 2, name: 'Back Room', location: 'Store Back', phone: '555-1001', description: 'Quick access items' },
  ],
  suppliers: [
    { id: 1, name: 'Beauty Supplies Co.', contact_info: 'John Doe', phone: '555-2000', email: 'sales@beautysupplies.com', address: '123 Supply St', tax_id: 'TAX-001' },
    { id: 2, name: 'Loreal Direct', contact_info: 'Jane Smith', phone: '555-2001', email: 'orders@loreal.com', address: '456 Brand Ave', tax_id: 'TAX-002' },
  ],
  purchases: [
    { id: 1, date: '2023-10-01', invoice_number: 'INV-1001', supplier_id: 1, warehouse_id: 1, total_cost: 150.00, status: 'received', items: [] },
    { id: 2, date: '2023-10-15', invoice_number: 'INV-1002', supplier_id: 2, warehouse_id: 1, total_cost: 300.00, status: 'received', items: [] },
  ],
  sales: [
    { id: 1, date: '2023-11-01', customer_name: 'Elena Gomez', payment_method: 'cash', total_amount: 55.00, warehouse_id: 1, items: [] },
    { id: 2, date: '2023-11-02', customer_name: 'Walk-in', payment_method: 'card', total_amount: 35.00, warehouse_id: 1, items: [] },
  ],
};
