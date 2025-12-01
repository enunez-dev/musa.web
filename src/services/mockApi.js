import { mockData } from './mockData';

// Helper to simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate IDs
const generateId = (collection) => {
  return collection.length > 0 ? Math.max(...collection.map(i => i.id)) + 1 : 1;
};

// In-memory storage (resets on reload)
let db = { ...mockData };

const mockApi = {
  get: async (url) => {
    await delay(300); // Simulate 300ms latency
    console.log(`[MOCK API] GET ${url}`);

    // Parse URL params
    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');

    // Helper for pagination
    const paginate = (data) => {
      const start = (page - 1) * limit;
      const end = start + limit;
      return {
        data: data.slice(start, end),
        pagination: {
          totalItems: data.length,
          totalPages: Math.ceil(data.length / limit),
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    };

    // --- Routes ---

    // Auth (Not really used in GET but just in case)

    // Employees
    if (path === '/employees') return { data: paginate(db.employees) };
    if (path.match(/\/employees\/\d+/)) {
      const id = parseInt(path.split('/').pop());
      const item = db.employees.find(i => i.id === id);
      return { data: item };
    }

    // Products
    if (path === '/products') return { data: paginate(db.products) };
    if (path.match(/\/products\/\d+/)) {
      const id = parseInt(path.split('/').pop());
      const item = db.products.find(i => i.id === id);
      return { data: item };
    }

    // Services
    if (path === '/services') return { data: paginate(db.services) };
    if (path.match(/\/services\/\d+/)) {
      const id = parseInt(path.split('/').pop());
      const item = db.services.find(i => i.id === id);
      return { data: item };
    }

    // Warehouses
    if (path === '/warehouses') return { data: paginate(db.warehouses) };
    if (path.match(/\/warehouses\/\d+/)) {
      const id = parseInt(path.split('/').pop());
      const item = db.warehouses.find(i => i.id === id);
      return { data: item };
    }

    // Suppliers
    if (path === '/suppliers') return { data: paginate(db.suppliers) };
    if (path.match(/\/suppliers\/\d+/)) {
      const id = parseInt(path.split('/').pop());
      const item = db.suppliers.find(i => i.id === id);
      return { data: item };
    }

    // Purchases
    if (path === '/purchases' || path === '/reports/purchases') {
      // Enrich with relations for list view
      const enriched = db.purchases.map(p => ({
        ...p,
        Supplier: db.suppliers.find(s => s.id === p.supplier_id),
        Warehouse: db.warehouses.find(w => w.id === p.warehouse_id)
      }));
      return { data: paginate(enriched) };
    }

    // Sales
    if (path === '/sales' || path === '/reports/sales') {
      const enriched = db.sales.map(s => ({
        ...s,
        Warehouse: db.warehouses.find(w => w.id === s.warehouse_id)
      }));
      return { data: paginate(enriched) };
    }

    return Promise.reject({ response: { status: 404, statusText: 'Not Found' } });
  },

  post: async (url, data) => {
    await delay(300);
    console.log(`[MOCK API] POST ${url}`, data);

    // Login
    if (url === '/auth/login') {
      const { username, password } = data;
      const user = db.users.find(u => u.username === username); // Simple check
      if (user && (password === 'admin' || password === 'user' || password === user.password_hash)) {
        return { data: { token: 'mock-jwt-token-123', role: user.role } };
      }
      return Promise.reject({ response: { status: 401, data: { message: 'Invalid credentials' } } });
    }

    // Generic Create Helper
    const create = (collectionName) => {
      const newItem = { id: generateId(db[collectionName]), ...data };
      db[collectionName].push(newItem);
      return { data: newItem };
    };

    if (url === '/employees') return create('employees');
    if (url === '/products') return create('products');
    if (url === '/services') return create('services');
    if (url === '/warehouses') return create('warehouses');
    if (url === '/suppliers') return create('suppliers');

    if (url === '/purchases') {
      const newItem = {
        id: generateId(db.purchases),
        ...data,
        total_cost: data.items.reduce((sum, i) => sum + (i.quantity * i.unit_cost), 0),
        status: 'received'
      };
      db.purchases.push(newItem);
      return { data: newItem };
    }

    if (url === '/sales') {
      const newItem = {
        id: generateId(db.sales),
        ...data,
        total_amount: data.items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0)
      };
      db.sales.push(newItem);
      return { data: newItem };
    }

    return Promise.reject({ response: { status: 404 } });
  },

  put: async (url, data) => {
    await delay(300);
    console.log(`[MOCK API] PUT ${url}`, data);

    const update = (collectionName, id) => {
      const index = db[collectionName].findIndex(i => i.id === id);
      if (index !== -1) {
        db[collectionName][index] = { ...db[collectionName][index], ...data };
        return { data: db[collectionName][index] };
      }
      return Promise.reject({ response: { status: 404 } });
    };

    if (url.match(/\/employees\/\d+/)) return update('employees', parseInt(url.split('/').pop()));
    if (url.match(/\/products\/\d+/)) return update('products', parseInt(url.split('/').pop()));
    if (url.match(/\/services\/\d+/)) return update('services', parseInt(url.split('/').pop()));
    if (url.match(/\/warehouses\/\d+/)) return update('warehouses', parseInt(url.split('/').pop()));
    if (url.match(/\/suppliers\/\d+/)) return update('suppliers', parseInt(url.split('/').pop()));

    return Promise.reject({ response: { status: 404 } });
  },

  delete: async (url) => {
    await delay(300);
    console.log(`[MOCK API] DELETE ${url}`);

    const remove = (collectionName, id) => {
      const index = db[collectionName].findIndex(i => i.id === id);
      if (index !== -1) {
        db[collectionName].splice(index, 1);
        return { data: { message: 'Deleted successfully' } };
      }
      return Promise.reject({ response: { status: 404 } });
    };

    if (url.match(/\/employees\/\d+/)) return remove('employees', parseInt(url.split('/').pop()));
    if (url.match(/\/products\/\d+/)) return remove('products', parseInt(url.split('/').pop()));
    if (url.match(/\/services\/\d+/)) return remove('services', parseInt(url.split('/').pop()));
    if (url.match(/\/warehouses\/\d+/)) return remove('warehouses', parseInt(url.split('/').pop()));
    if (url.match(/\/suppliers\/\d+/)) return remove('suppliers', parseInt(url.split('/').pop()));

    return Promise.reject({ response: { status: 404 } });
  }
};

export default mockApi;
