import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

// Helpers to read and write JSON data files
function readData<T>(fileName: string, defaultValue: T): T {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return defaultValue;
  }
}

function writeData<T>(fileName: string, data: T): boolean {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Role authentication helper
  const authenticateRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = (req.headers['x-user-role'] as string) || 'Customer';
      if (allowedRoles.includes('All') || allowedRoles.includes(userRole)) {
        return next();
      }
      return res.status(403).json({ error: 'Access denied. Insufficient permissions for this role.' });
    };
  };

  // ---------------- AUTH ROUTES ----------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { usernameOrEmail, password, role } = req.body;
    const employees = readData<any[]>('employees.json', []);

    // Check employee by email or id or demo
    if (role === 'Customer') {
      return res.json({
        success: true,
        user: {
          id: 'CUST-001',
          name: 'Alice Morgan',
          email: usernameOrEmail || 'customer@chocofactory.com',
          role: 'Customer',
          title: 'Valued Chocolate Connoisseur'
        },
        token: 'cust-demo-token'
      });
    }

    const employee = employees.find(
      (e) =>
        (e.email.toLowerCase() === (usernameOrEmail || '').toLowerCase() ||
          e.role.toLowerCase() === (usernameOrEmail || '').toLowerCase() ||
          e.name.toLowerCase() === (usernameOrEmail || '').toLowerCase()) &&
        (password === e.password || password === 'admin' || password === 'production' || password === 'qc' || password === 'inventory' || password === 'pass' || !password)
    );

    if (employee) {
      return res.json({
        success: true,
        user: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          department: employee.department
        },
        token: `token-${employee.id}`
      });
    }

    // Default fallback demo match by requested role
    if (role) {
      const roleMatch = employees.find((e) => e.role === role);
      if (roleMatch) {
        return res.json({
          success: true,
          user: {
            id: roleMatch.id,
            name: roleMatch.name,
            email: roleMatch.email,
            role: roleMatch.role,
            department: roleMatch.department
          },
          token: `token-${roleMatch.id}`
        });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials. Please check your username and password.' });
  });

  // ---------------- PRODUCTS ----------------
  app.get('/api/products', (req: Request, res: Response) => {
    const products = readData<any[]>('products.json', []);
    res.json(products);
  });

  app.post('/api/products', authenticateRole(['Admin']), (req: Request, res: Response) => {
    const products = readData<any[]>('products.json', []);
    const newProduct = {
      id: `PROD-${Date.now().toString().slice(-4)}`,
      ...req.body,
      stock: Number(req.body.stock) || 0,
      price: Number(req.body.price) || 0,
      rating: req.body.rating || 5.0
    };
    products.push(newProduct);
    writeData('products.json', products);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', authenticateRole(['Admin']), (req: Request, res: Response) => {
    const products = readData<any[]>('products.json', []);
    const idx = products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    products[idx] = { ...products[idx], ...req.body };
    writeData('products.json', products);
    res.json(products[idx]);
  });

  app.delete('/api/products/:id', authenticateRole(['Admin']), (req: Request, res: Response) => {
    let products = readData<any[]>('products.json', []);
    products = products.filter((p) => p.id !== req.params.id);
    writeData('products.json', products);
    res.json({ success: true, message: 'Product deleted' });
  });

  // ---------------- RAW MATERIALS ----------------
  app.get('/api/raw-materials', (req: Request, res: Response) => {
    const materials = readData<any[]>('raw_materials.json', []);
    res.json(materials);
  });

  app.post('/api/raw-materials', authenticateRole(['Admin', 'Inventory Manager']), (req: Request, res: Response) => {
    const materials = readData<any[]>('raw_materials.json', []);
    const newMat = {
      id: `MAT-${(materials.length + 1).toString().padStart(3, '0')}`,
      ...req.body,
      quantity: Number(req.body.quantity) || 0,
      minimumStock: Number(req.body.minimumStock) || 100
    };
    materials.push(newMat);
    writeData('raw_materials.json', materials);
    res.status(201).json(newMat);
  });

  // ---------------- INVENTORY MOVEMENTS ----------------
  app.get('/api/stock-movements', (req: Request, res: Response) => {
    const movements = readData<any[]>('stock_movements.json', []);
    res.json(movements);
  });

  app.post('/api/inventory/movement', authenticateRole(['Admin', 'Inventory Manager']), (req: Request, res: Response) => {
    const { materialId, movementType, quantity, reason, performedBy } = req.body;
    const materials = readData<any[]>('raw_materials.json', []);
    const movements = readData<any[]>('stock_movements.json', []);
    const notifications = readData<any[]>('notifications.json', []);

    const mat = materials.find((m) => m.id === materialId);
    if (!mat) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty === 0) {
      return res.status(400).json({ error: 'Quantity must be a non-zero number' });
    }

    const prevStock = mat.quantity;
    let newStock = prevStock;

    if (movementType === 'Received') {
      newStock += Math.abs(qty);
    } else if (movementType === 'Issued') {
      if (prevStock < Math.abs(qty)) {
        return res.status(400).json({ error: `Insufficient stock. Current: ${prevStock} ${mat.unit}` });
      }
      newStock -= Math.abs(qty);
    } else if (movementType === 'Adjusted') {
      newStock = Math.max(0, prevStock + qty);
    }

    mat.quantity = newStock;
    if (newStock === 0) {
      mat.status = 'Out of Stock';
    } else if (newStock <= mat.minimumStock) {
      mat.status = 'Low Stock';
      notifications.unshift({
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'warning',
        targetRole: 'Inventory Manager',
        message: `${mat.name} is Low Stock (${newStock} ${mat.unit}, min: ${mat.minimumStock} ${mat.unit}). Restock recommended.`,
        read: false
      });
      writeData('notifications.json', notifications);
    } else {
      mat.status = 'In Stock';
    }

    writeData('raw_materials.json', materials);

    const newMovement = {
      id: `SM-2026-${Date.now().toString().slice(-4)}`,
      materialId: mat.id,
      materialName: mat.name,
      movementType,
      quantity: movementType === 'Issued' ? -Math.abs(qty) : qty,
      unit: mat.unit,
      previousStock: prevStock,
      newStock: newStock,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: reason || 'Inventory update',
      performedBy: performedBy || 'Inventory Manager'
    };

    movements.unshift(newMovement);
    writeData('stock_movements.json', movements);

    res.json({ success: true, movement: newMovement, material: mat });
  });

  // ---------------- PRODUCTION BATCHES ----------------
  app.get('/api/production/batches', (req: Request, res: Response) => {
    const batches = readData<any[]>('production_batches.json', []);
    res.json(batches);
  });

  app.post('/api/production/batches', authenticateRole(['Admin', 'Production Manager']), (req: Request, res: Response) => {
    const batches = readData<any[]>('production_batches.json', []);
    const materials = readData<any[]>('raw_materials.json', []);
    const movements = readData<any[]>('stock_movements.json', []);
    const notifications = readData<any[]>('notifications.json', []);

    const { productId, productName, plannedQuantity, manager, notes, recipe } = req.body;

    const plannedQty = Number(plannedQuantity);
    if (!plannedQty || plannedQty <= 0) {
      return res.status(400).json({ error: 'Planned quantity must be greater than zero' });
    }

    const batchId = `CH-BATCH-${(batches.length + 1).toString().padStart(3, '0')}`;

    // Check materials availability & consume them for production
    const recipeItems = Array.isArray(recipe) ? recipe : [];
    for (const item of recipeItems) {
      const mat = materials.find((m) => m.id === item.materialId);
      if (mat) {
        const requiredAmount = Number(item.amount) || 0;
        if (mat.quantity < requiredAmount) {
          return res.status(400).json({
            error: `Material shortage: ${mat.name} has only ${mat.quantity} ${mat.unit} available (required: ${requiredAmount} ${item.unit || mat.unit})`
          });
        }
      }
    }

    // Deduct consumed materials and record stock movement
    for (const item of recipeItems) {
      const mat = materials.find((m) => m.id === item.materialId);
      if (mat) {
        const requiredAmount = Number(item.amount) || 0;
        const prev = mat.quantity;
        mat.quantity = Math.max(0, prev - requiredAmount);
        if (mat.quantity === 0) mat.status = 'Out of Stock';
        else if (mat.quantity <= mat.minimumStock) mat.status = 'Low Stock';

        movements.unshift({
          id: `SM-2026-${Date.now().toString().slice(-4)}`,
          materialId: mat.id,
          materialName: mat.name,
          movementType: 'Issued',
          quantity: -requiredAmount,
          unit: mat.unit,
          previousStock: prev,
          newStock: mat.quantity,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason: `Materials consumed for batch ${batchId} (${productName})`,
          performedBy: manager || 'Production Manager'
        });
      }
    }
    writeData('raw_materials.json', materials);
    writeData('stock_movements.json', movements);

    const newBatch = {
      id: batchId,
      productId,
      productName,
      plannedQuantity: plannedQty,
      producedQuantity: 0,
      startDate: new Date().toISOString().slice(0, 10),
      expectedCompletion: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      currentStage: 'Cocoa Preparation',
      manager: manager || 'Elena Rostova',
      status: 'In Production',
      notes: notes || 'New production batch initiated',
      recipe: recipeItems
    };

    batches.unshift(newBatch);
    writeData('production_batches.json', batches);

    notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'info',
      targetRole: 'All',
      message: `Production Batch ${batchId} started for ${productName} (${plannedQty} units).`,
      read: false
    });
    writeData('notifications.json', notifications);

    res.status(201).json(newBatch);
  });

  app.put('/api/production/batches/:id/stage', authenticateRole(['Admin', 'Production Manager']), (req: Request, res: Response) => {
    const batches = readData<any[]>('production_batches.json', []);
    const batch = batches.find((b) => b.id === req.params.id);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    const { stage, notes } = req.body;
    batch.currentStage = stage;
    if (notes) batch.notes = notes;
    if (batch.status === 'Planned') batch.status = 'In Production';

    writeData('production_batches.json', batches);
    res.json(batch);
  });

  app.put('/api/production/batches/:id/complete', authenticateRole(['Admin', 'Production Manager']), (req: Request, res: Response) => {
    const batches = readData<any[]>('production_batches.json', []);
    const notifications = readData<any[]>('notifications.json', []);
    const batch = batches.find((b) => b.id === req.params.id);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    const producedQty = Number(req.body.producedQuantity) || batch.plannedQuantity;
    batch.producedQuantity = producedQty;
    batch.currentStage = 'Packaging';
    batch.status = 'Sent to QC';
    if (req.body.notes) batch.notes = req.body.notes;

    writeData('production_batches.json', batches);

    notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'info',
      targetRole: 'Quality Control Manager',
      message: `Batch ${batch.id} (${batch.productName}) completed production and is waiting for QC inspection.`,
      read: false
    });
    writeData('notifications.json', notifications);

    res.json(batch);
  });

  // ---------------- QUALITY CONTROL ----------------
  app.get('/api/qc/inspections', (req: Request, res: Response) => {
    const qcs = readData<any[]>('quality_checks.json', []);
    res.json(qcs);
  });

  app.post('/api/qc/evaluate', authenticateRole(['Admin', 'QC Manager']), (req: Request, res: Response) => {
    const userRole = (req.headers['x-user-role'] as string) || '';
    if (userRole === 'Production Manager') {
      return res.status(403).json({ error: 'Production Manager is not permitted to approve or reject QC inspections.' });
    }

    const { batchId, inspector, decision, rejectionReason, tests, notes } = req.body;
    const batches = readData<any[]>('production_batches.json', []);
    const qcs = readData<any[]>('quality_checks.json', []);
    const products = readData<any[]>('products.json', []);
    const movements = readData<any[]>('stock_movements.json', []);
    const notifications = readData<any[]>('notifications.json', []);

    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    if (decision === 'Reject' && !rejectionReason) {
      return res.status(400).json({ error: 'Rejection reason is required when rejecting a batch.' });
    }

    const isApproved = decision === 'Approve';
    const overallResult = isApproved ? 'Pass' : 'Fail';
    const status = isApproved ? 'Approved' : 'Rejected';

    batch.status = status;
    writeData('production_batches.json', batches);

    const qcRecord = {
      id: `QC-2026-${Date.now().toString().slice(-4)}`,
      batchId,
      productName: batch.productName,
      inspector: inspector || 'Dr. Marcus Vance',
      date: new Date().toISOString().slice(0, 10),
      status,
      overallResult,
      rejectionReason: isApproved ? null : rejectionReason,
      tests: tests || {},
      notes: notes || (isApproved ? 'Batch passed all quality tests.' : `Batch rejected: ${rejectionReason}`)
    };

    qcs.unshift(qcRecord);
    writeData('quality_checks.json', qcs);

    if (isApproved) {
      // Connect to finished goods inventory:
      // A batch must be approved by QC before it becomes available as approved finished stock
      const product = products.find((p) => p.id === batch.productId || p.name === batch.productName);
      if (product) {
        const prevStock = product.stock;
        product.stock += batch.producedQuantity;
        if (product.status === 'Out of Stock' && product.stock > 0) {
          product.status = 'Active';
        }
        writeData('products.json', products);

        movements.unshift({
          id: `SM-2026-${Date.now().toString().slice(-4)}`,
          materialId: product.id,
          materialName: product.name,
          movementType: 'Finished Goods Stocked',
          quantity: batch.producedQuantity,
          unit: 'units',
          previousStock: prevStock,
          newStock: product.stock,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason: `QC Approved batch ${batch.id} stocked into finished warehouse`,
          performedBy: inspector || 'QC Manager'
        });
        writeData('stock_movements.json', movements);
      }

      notifications.unshift({
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'success',
        targetRole: 'All',
        message: `Batch ${batch.id} (${batch.productName}) APPROVED by QC. ${batch.producedQuantity} units added to sellable stock.`,
        read: false
      });
    } else {
      // Rejected batches must NOT become sellable finished stock
      notifications.unshift({
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'danger',
        targetRole: 'Production Manager',
        message: `Batch ${batch.id} (${batch.productName}) REJECTED by QC due to: ${rejectionReason}. Marked for rework.`,
        read: false
      });
    }

    writeData('notifications.json', notifications);

    res.json({ success: true, qcRecord, batch });
  });

  // ---------------- ORDERS ----------------
  app.get('/api/orders', (req: Request, res: Response) => {
    const userRole = (req.headers['x-user-role'] as string) || 'Customer';
    const customerEmail = (req.headers['x-user-email'] as string) || 'customer@chocofactory.com';
    const orders = readData<any[]>('orders.json', []);

    if (userRole === 'Customer') {
      const filtered = orders.filter((o) => (o.customer?.email || '').toLowerCase() === customerEmail.toLowerCase());
      return res.json(filtered);
    }

    res.json(orders);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { customer, items, paymentMethod, paymentDetails, deliveryFee } = req.body;
    const products = readData<any[]>('products.json', []);
    const orders = readData<any[]>('orders.json', []);
    const movements = readData<any[]>('stock_movements.json', []);
    const notifications = readData<any[]>('notifications.json', []);

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one chocolate item.' });
    }

    // Validate inventory & calculate
    let subtotal = 0;
    let totalQty = 0;
    const validatedItems: any[] = [];
    let requiresProduction = false;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.name} not found` });
      }
      if (product.status === 'Inactive') {
        return res.status(400).json({ error: `${product.name} is currently inactive and cannot be purchased.` });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      if (product.stock < qty) {
        requiresProduction = true;
      }

      // Deduct available stock
      const prevStock = product.stock;
      product.stock = Math.max(0, product.stock - qty);
      if (product.stock === 0) {
        product.status = 'Out of Stock';
      }

      movements.unshift({
        id: `SM-2026-${Date.now().toString().slice(-4)}`,
        materialId: product.id,
        materialName: product.name,
        movementType: 'Order Fulfillment',
        quantity: -qty,
        unit: 'units',
        previousStock: prevStock,
        newStock: product.stock,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reason: `Reserved for customer order`,
        performedBy: 'Sales System'
      });

      const itemSubtotal = product.price * qty;
      subtotal += itemSubtotal;
      totalQty += qty;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        subtotal: itemSubtotal
      });
    }

    writeData('products.json', products);
    writeData('stock_movements.json', movements);

    const fee = Number(deliveryFee) >= 0 ? Number(deliveryFee) : subtotal > 50 ? 0 : 5.0;
    const total = subtotal + fee;
    const orderId = `ORD-2026-${(orders.length + 1001).toString()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newOrder = {
      id: orderId,
      orderDate: nowStr,
      customer: {
        name: customer.name || 'Valued Customer',
        email: customer.email || 'customer@chocofactory.com',
        phone: customer.phone || '+1 (555) 000-0000',
        address: customer.address || 'Local Delivery Address',
        city: customer.city || 'San Francisco',
        postalCode: customer.postalCode || '94107'
      },
      items: validatedItems,
      totalQuantity: totalQty,
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: Number(fee.toFixed(2)),
      total: Number(total.toFixed(2)),
      paymentMethod: paymentMethod || 'Demo Card',
      paymentDetails: paymentDetails || {
        cardholderName: customer.name || 'Demo Holder',
        cardType: 'Demo Card',
        reference: `DEMO-PAY-${Date.now().toString().slice(-5)}`
      },
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      timeline: [
        { status: 'Placed', time: nowStr, note: 'Order placed online through Customer Shop' },
        { status: 'Confirmed', time: nowStr, note: 'Order confirmed and inventory assigned' }
      ]
    };

    orders.unshift(newOrder);
    writeData('orders.json', orders);

    // Factory order workflow connection:
    if (requiresProduction) {
      notifications.unshift({
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        type: 'warning',
        targetRole: 'Production Manager',
        message: `Order ${orderId} placed with low/out-of-stock items. Production batch creation required!`,
        read: false
      });
    } else {
      notifications.unshift({
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        type: 'success',
        targetRole: 'Inventory Manager',
        message: `New Order ${orderId} received for $${total.toFixed(2)}. Stock allocated in Finished Goods.`,
        read: false
      });
    }
    writeData('notifications.json', notifications);

    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', authenticateRole(['Admin', 'Inventory Manager']), (req: Request, res: Response) => {
    const orders = readData<any[]>('orders.json', []);
    const notifications = readData<any[]>('notifications.json', []);
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { status, note } = req.body;
    order.orderStatus = status;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    order.timeline.push({
      status,
      time: nowStr,
      note: note || `Status updated to ${status}`
    });

    if (status === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
      order.paymentStatus = 'Paid';
    }

    writeData('orders.json', orders);

    notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      type: 'info',
      targetRole: 'Customer',
      message: `Order ${order.id} status updated to: ${status}.`,
      read: false
    });
    writeData('notifications.json', notifications);

    res.json(order);
  });

  // ---------------- EMPLOYEES (ADMIN ONLY) ----------------
  app.get('/api/employees', authenticateRole(['Admin']), (req: Request, res: Response) => {
    const employees = readData<any[]>('employees.json', []);
    res.json(employees);
  });

  app.post('/api/employees', authenticateRole(['Admin']), (req: Request, res: Response) => {
    const employees = readData<any[]>('employees.json', []);
    const newEmp = {
      id: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`,
      ...req.body,
      joiningDate: req.body.joiningDate || new Date().toISOString().slice(0, 10),
      status: req.body.status || 'Active'
    };
    employees.push(newEmp);
    writeData('employees.json', employees);
    res.status(201).json(newEmp);
  });

  app.put('/api/employees/:id', authenticateRole(['Admin']), (req: Request, res: Response) => {
    const employees = readData<any[]>('employees.json', []);
    const idx = employees.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Employee not found' });

    employees[idx] = { ...employees[idx], ...req.body };
    writeData('employees.json', employees);
    res.json(employees[idx]);
  });

  app.delete('/api/employees/:id', authenticateRole(['Admin']), (req: Request, res: Response) => {
    let employees = readData<any[]>('employees.json', []);
    employees = employees.filter((e) => e.id !== req.params.id);
    writeData('employees.json', employees);
    res.json({ success: true, message: 'Employee deleted' });
  });

  // ---------------- SUPPLIERS ----------------
  app.get('/api/suppliers', authenticateRole(['Admin', 'Inventory Manager']), (req: Request, res: Response) => {
    const suppliers = readData<any[]>('suppliers.json', []);
    res.json(suppliers);
  });

  app.post('/api/suppliers', authenticateRole(['Admin', 'Inventory Manager']), (req: Request, res: Response) => {
    const suppliers = readData<any[]>('suppliers.json', []);
    const newSup = {
      id: `SUP-${(suppliers.length + 1).toString().padStart(2, '0')}`,
      ...req.body,
      status: req.body.status || 'Active'
    };
    suppliers.push(newSup);
    writeData('suppliers.json', suppliers);
    res.status(201).json(newSup);
  });

  app.put('/api/suppliers/:id', authenticateRole(['Admin', 'Inventory Manager']), (req: Request, res: Response) => {
    const suppliers = readData<any[]>('suppliers.json', []);
    const idx = suppliers.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Supplier not found' });

    suppliers[idx] = { ...suppliers[idx], ...req.body };
    writeData('suppliers.json', suppliers);
    res.json(suppliers[idx]);
  });

  // ---------------- NOTIFICATIONS ----------------
  app.get('/api/notifications', (req: Request, res: Response) => {
    const notifications = readData<any[]>('notifications.json', []);
    res.json(notifications);
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const notifications = readData<any[]>('notifications.json', []);
    const notif = notifications.find((n) => n.id === req.params.id);
    if (notif) {
      notif.read = true;
      writeData('notifications.json', notifications);
    }
    res.json({ success: true });
  });

  // ---------------- SETTINGS ----------------
  app.get('/api/settings', (req: Request, res: Response) => {
    const settings = readData<any>('settings.json', {});
    res.json(settings);
  });

  app.put('/api/settings', authenticateRole(['Admin']), (req: Request, res: Response) => {
    const settings = readData<any>('settings.json', {});
    const updated = { ...settings, ...req.body };
    writeData('settings.json', updated);
    res.json(updated);
  });

  // ---------------- REPORTS & STATS (REAL COMPUTED DATA) ----------------
  app.get('/api/reports/summary', (req: Request, res: Response) => {
    const products = readData<any[]>('products.json', []);
    const rawMaterials = readData<any[]>('raw_materials.json', []);
    const batches = readData<any[]>('production_batches.json', []);
    const qcs = readData<any[]>('quality_checks.json', []);
    const orders = readData<any[]>('orders.json', []);

    const totalProducts = products.length;
    const totalRawMaterials = rawMaterials.length;
    const activeProductionBatches = batches.filter((b) => b.status === 'In Production').length;
    const pendingQC = batches.filter((b) => b.status === 'Sent to QC').length;
    const finishedGoodsUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length;
    const lowStockItems = rawMaterials.filter((m) => m.quantity <= m.minimumStock).length;
    const factoryRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.total : 0), 0);

    const passedQc = qcs.filter((q) => q.status === 'Approved').length;
    const failedQc = qcs.filter((q) => q.status === 'Rejected').length;
    const qcPassRate = qcs.length > 0 ? ((passedQc / qcs.length) * 100).toFixed(1) : '100';

    res.json({
      totalProducts,
      totalRawMaterials,
      activeProductionBatches,
      pendingQC,
      finishedGoodsUnits,
      pendingOrders,
      lowStockItems,
      factoryRevenue: Number(factoryRevenue.toFixed(2)),
      passedQc,
      failedQc,
      qcPassRate: `${qcPassRate}%`,
      todayProductionTarget: 1000,
      todayActualProduction: batches.reduce((acc, b) => acc + (b.producedQuantity || 0), 0)
    });
  });

  app.get('/api/reports/export-csv/:type', (req: Request, res: Response) => {
    const { type } = req.params;
    let csvData = '';
    let fileName = `report-${type}.csv`;

    if (type === 'products') {
      const items = readData<any[]>('products.json', []);
      csvData = 'ID,Name,Category,Price,Weight,Stock,Status,Rating\n' +
        items.map((i) => `"${i.id}","${i.name}","${i.category}",${i.price},"${i.weight}",${i.stock},"${i.status}",${i.rating}`).join('\n');
    } else if (type === 'raw-materials') {
      const items = readData<any[]>('raw_materials.json', []);
      csvData = 'ID,Name,Category,Quantity,Unit,MinimumStock,Supplier,ExpiryDate,Status\n' +
        items.map((i) => `"${i.id}","${i.name}","${i.category}",${i.quantity},"${i.unit}",${i.minimumStock},"${i.supplier}","${i.expiryDate}","${i.status}"`).join('\n');
    } else if (type === 'production') {
      const items = readData<any[]>('production_batches.json', []);
      csvData = 'BatchID,Product,PlannedQty,ProducedQty,StartDate,Stage,Manager,Status\n' +
        items.map((i) => `"${i.id}","${i.productName}",${i.plannedQuantity},${i.producedQuantity},"${i.startDate}","${i.currentStage}","${i.manager}","${i.status}"`).join('\n');
    } else if (type === 'quality') {
      const items = readData<any[]>('quality_checks.json', []);
      csvData = 'QCID,BatchID,Product,Inspector,Date,Result,RejectionReason,Notes\n' +
        items.map((i) => `"${i.id}","${i.batchId}","${i.productName}","${i.inspector}","${i.date}","${i.status}","${i.rejectionReason || ''}","${(i.notes || '').replace(/"/g, '""')}"`).join('\n');
    } else if (type === 'orders') {
      const items = readData<any[]>('orders.json', []);
      csvData = 'OrderID,Date,Customer,TotalQty,TotalAmount,PaymentMethod,PaymentStatus,OrderStatus\n' +
        items.map((i) => `"${i.id}","${i.orderDate}","${i.customer.name}",${i.totalQuantity},${i.total},"${i.paymentMethod}","${i.paymentStatus}","${i.orderStatus}"`).join('\n');
    } else if (type === 'inventory') {
      const items = readData<any[]>('stock_movements.json', []);
      csvData = 'MovementID,Material,Type,Quantity,Unit,PreviousStock,NewStock,Date,Reason,PerformedBy\n' +
        items.map((i) => `"${i.id}","${i.materialName}","${i.movementType}",${i.quantity},"${i.unit}",${i.previousStock},${i.newStock},"${i.date}","${(i.reason || '').replace(/"/g, '""')}","${i.performedBy}"`).join('\n');
    } else {
      return res.status(400).send('Invalid report type');
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(csvData);
  });

  // ---------------- VITE MIDDLEWARE / STATIC ASSETS ----------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chocolate Factory Server running on http://localhost:${PORT}`);
  });
}

startServer();
