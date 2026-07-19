require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const contactRoutes = require('./routes/contact.routes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:4200',   // Angular dev server
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// ─── Root route ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Organic Grocery API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f1117; color: #e0e0e0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { max-width: 700px; width: 90%; padding: 40px; background: #1a1d27; border-radius: 16px; border: 1px solid #2a2d3a; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        h1 { color: #4ade80; font-size: 28px; margin-bottom: 8px; }
        .subtitle { color: #888; margin-bottom: 30px; font-size: 14px; }
        .status { display: inline-flex; align-items: center; gap: 8px; background: #16291e; color: #4ade80; padding: 6px 14px; border-radius: 20px; font-size: 13px; margin-bottom: 24px; }
        .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        h2 { color: #a78bfa; font-size: 16px; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 1px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #2a2d3a; font-size: 13px; }
        th { color: #888; font-weight: 600; }
        .method { font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
        .get { color: #4ade80; background: #16291e; }
        .post { color: #60a5fa; background: #172136; }
        .put { color: #fbbf24; background: #2a2410; }
        .patch { color: #fb923c; background: #2a1f10; }
        .lock { color: #f87171; font-size: 11px; }
        a { color: #60a5fa; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌿 Organic Grocery API</h1>
        <p class="subtitle">Node.js + Express Backend Server</p>
        <div class="status"><span class="dot"></span> Server is running</div>

        <h2>Auth Endpoints</h2>
        <table>
          <tr><th>Method</th><th>Endpoint</th><th>Auth</th></tr>
          <tr><td><span class="method post">POST</span></td><td><a href="/api/auth/register">/api/auth/register</a></td><td>—</td></tr>
          <tr><td><span class="method post">POST</span></td><td><a href="/api/auth/login">/api/auth/login</a></td><td>—</td></tr>
          <tr><td><span class="method get">GET</span></td><td><a href="/api/auth/profile">/api/auth/profile</a></td><td><span class="lock">🔒 JWT</span></td></tr>
          <tr><td><span class="method put">PUT</span></td><td><a href="/api/auth/profile">/api/auth/profile</a></td><td><span class="lock">🔒 JWT</span></td></tr>
        </table>

        <h2>Product Endpoints</h2>
        <table>
          <tr><th>Method</th><th>Endpoint</th><th>Auth</th></tr>
          <tr><td><span class="method get">GET</span></td><td><a href="/api/products">/api/products</a></td><td>—</td></tr>
          <tr><td><span class="method get">GET</span></td><td><a href="/api/products/featured">/api/products/featured</a></td><td>—</td></tr>
          <tr><td><span class="method get">GET</span></td><td><a href="/api/products/bestsellers">/api/products/bestsellers</a></td><td>—</td></tr>
          <tr><td><span class="method get">GET</span></td><td><a href="/api/products/categories">/api/products/categories</a></td><td>—</td></tr>
          <tr><td><span class="method get">GET</span></td><td>/api/products/:id</td><td>—</td></tr>
        </table>

        <h2>Order Endpoints</h2>
        <table>
          <tr><th>Method</th><th>Endpoint</th><th>Auth</th></tr>
          <tr><td><span class="method post">POST</span></td><td>/api/orders</td><td><span class="lock">🔒 JWT</span></td></tr>
          <tr><td><span class="method get">GET</span></td><td>/api/orders</td><td><span class="lock">🔒 JWT</span></td></tr>
          <tr><td><span class="method get">GET</span></td><td>/api/orders/:id</td><td><span class="lock">🔒 JWT</span></td></tr>
          <tr><td><span class="method patch">PATCH</span></td><td>/api/orders/:id/advance</td><td><span class="lock">🔒 JWT</span></td></tr>
        </table>

        <h2>Other Endpoints</h2>
        <table>
          <tr><th>Method</th><th>Endpoint</th><th>Auth</th></tr>
          <tr><td><span class="method post">POST</span></td><td><a href="/api/contact">/api/contact</a></td><td>—</td></tr>
          <tr><td><span class="method get">GET</span></td><td><a href="/api/health">/api/health</a></td><td>—</td></tr>
        </table>
      </div>
    </body>
    </html>
  `);
});

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── Centralized error handler (must be last) ───────────────
app.use(errorHandler);

// ─── Connect to MongoDB & Start server ──────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌿 Organic Grocery API running on http://localhost:${PORT}`);
  });
});
