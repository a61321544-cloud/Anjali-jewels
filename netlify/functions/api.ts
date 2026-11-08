import storeData from '../../data/store.json';

export const handler = async (event: any, _context: any) => {
  // CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  const path = event.path || '';
  const method = event.httpMethod || 'GET';

  // 1. GET /api/products
  if (path.includes('/products') && method === 'GET') {
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        count: storeData.products.length,
        products: storeData.products
      })
    };
  }

  // 2. GET /api/settings
  if (path.includes('/settings') && method === 'GET') {
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        settings: storeData.settings
      })
    };
  }

  // 3. POST /api/orders
  if (path.includes('/orders') && method === 'POST') {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      const generatedOrder = {
        id: `AJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        totalAmount: body.totalAmount,
        channel: body.channel || 'WhatsApp',
        createdAt: new Date().toISOString()
      };

      return {
        statusCode: 201,
        headers: defaultHeaders,
        body: JSON.stringify({
          success: true,
          order: generatedOrder,
          message: 'Order registered successfully'
        })
      };
    } catch {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ success: false, message: 'Invalid order payload' })
      };
    }
  }

  // 4. POST /api/admin/login
  if (path.includes('/admin/login') && method === 'POST') {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      if (body.password === 'anjali2026') {
        return {
          statusCode: 200,
          headers: defaultHeaders,
          body: JSON.stringify({
            success: true,
            token: 'anjali-admin-token-2026',
            message: 'Authenticated'
          })
        };
      }
      return {
        statusCode: 401,
        headers: defaultHeaders,
        body: JSON.stringify({ success: false, message: 'Invalid passcode' })
      };
    } catch {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({ success: false, message: 'Bad request' })
      };
    }
  }

  // Fallback
  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({
      brand: 'ANJALI JEWELS',
      status: 'Serverless API Operational on Netlify',
      timestamp: new Date().toISOString()
    })
  };
};
