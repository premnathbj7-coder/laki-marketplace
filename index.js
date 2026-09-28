import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const promotionEndsAt = Date.now() + 2 * 60 * 60 * 1000;
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const products = [
  { id: 'p1', name: 'Everyday Cotton Kurti', category: 'Women', price: 499, originalPrice: 899, rating: 4.5, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e3?auto=format&fit=crop&w=700&q=80', description: 'A soft, comfortable cotton kurti for everyday wear.' },
  { id: 'p2', name: 'Classic Casual Shirt', category: 'Men', price: 599, originalPrice: 999, rating: 4.3, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80', description: 'A versatile shirt made for workdays and weekends.' },
  { id: 'p3', name: 'Printed Cushion Covers (Set of 2)', category: 'Home', price: 349, originalPrice: 599, rating: 4.6, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80', description: 'Bring a fresh look to your living room with this pair.' },
  { id: 'p4', name: 'Everyday Sling Bag', category: 'Accessories', price: 429, originalPrice: 749, rating: 4.2, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80', description: 'A lightweight sling bag with room for your essentials.' },
  { id: 'p5', name: 'Festive Floral Dress', category: 'Women', price: 699, originalPrice: 1199, rating: 4.7, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80', description: 'A bright floral dress for celebrations and outings.' },
  { id: 'p6', name: 'Minimal Desk Organizer', category: 'Home', price: 279, originalPrice: 449, rating: 4.4, image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=80', description: 'Keep your workspace tidy with this compact organizer.' },
  { id: 'p7', name: 'Running Shoes', category: 'Men', price: 899, originalPrice: 1499, rating: 4.5, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80', description: 'Lightweight everyday trainers with a cushioned sole.' },
  { id: 'p8', name: 'Color Pop Earrings', category: 'Accessories', price: 199, originalPrice: 399, rating: 4.1, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80', description: 'A cheerful finishing touch for your favorite outfits.' },
  { id: 'p9', name: 'Soft Knit Cardigan', category: 'Women', price: 799, originalPrice: 1299, rating: 4.6, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80', description: 'A cozy knit layer for cool mornings and evenings.' },
  { id: 'p10', name: 'Canvas Weekend Tote', category: 'Accessories', price: 329, originalPrice: 549, rating: 4.4, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80', description: 'A roomy everyday tote for errands and weekend plans.' },
  { id: 'p11', name: 'Ceramic Coffee Mug Set', category: 'Home', price: 399, originalPrice: 699, rating: 4.5, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80', description: 'A pair of cheerful ceramic mugs for your coffee break.' },
  { id: 'p12', name: 'Relaxed Fit Polo Tee', category: 'Men', price: 449, originalPrice: 799, rating: 4.2, image: 'https://images.unsplash.com/photo-1625910513413-5fc6e3f6b4d5?auto=format&fit=crop&w=700&q=80', description: 'An easy, breathable polo tee for everyday comfort.' },
  { id: 'p13', name: 'Printed Everyday Saree', category: 'Women', price: 899, originalPrice: 1499, rating: 4.7, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80', description: 'A graceful printed saree for celebrations and gatherings.' },
  { id: 'p14', name: 'Woven Storage Basket', category: 'Home', price: 499, originalPrice: 849, rating: 4.3, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=80', description: 'A handy woven basket to organize your everyday essentials.' },
  { id: 'p15', name: 'Everyday Analog Watch', category: 'Accessories', price: 649, originalPrice: 1099, rating: 4.4, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80', description: 'A clean, classic watch that pairs easily with any outfit.' },
  { id: 'p16', name: 'Cotton Lounge Co-ord', category: 'Women', price: 749, originalPrice: 1249, rating: 4.6, image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80', description: 'A relaxed matching set for slow days and cozy evenings.' },
  { id: 'p17', name: 'Glow Day Skincare Set', category: 'Beauty', price: 549, originalPrice: 899, rating: 4.5, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80', description: 'A simple self-care set for your everyday routine.' },
  { id: 'p18', name: 'Little Explorer Backpack', category: 'Kids', price: 499, originalPrice: 799, rating: 4.4, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', description: 'A lightweight backpack for school days and little adventures.' },
  { id: 'p19', name: 'Cushioned Walking Sneakers', category: 'Footwear', price: 699, originalPrice: 1199, rating: 4.3, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80', description: 'Comfortable everyday sneakers with a cushioned feel.' },
  { id: 'p20', name: 'Stoneware Serving Bowl', category: 'Kitchen', price: 379, originalPrice: 649, rating: 4.5, image: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=700&q=80', description: 'A versatile serving bowl for snacks, salads, and sides.' }
];
const orders = [];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'Laki Marketplace API' }));
app.get('/api/promotion', (_req, res) => res.json({ code: 'JOY10', percent: 10, minimumOrder: 999, endsAt: promotionEndsAt }));
app.get('/api/categories', (_req, res) => res.json([...new Set(products.map(p => p.category))]));
app.get('/api/products', (req, res) => {
  const q = String(req.query.q || '').toLowerCase();
  const category = String(req.query.category || '');
  res.json(products.filter(p => (!category || p.category === category) && (!q || `${p.name} ${p.category}`.toLowerCase().includes(q))));
});
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});
app.post('/api/orders', (req, res) => {
  const { customerName, phone, address, paymentMethod, items } = req.body || {};
  if (!customerName?.trim() || !/^[0-9]{10}$/.test(phone || '') || !address?.trim() || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Enter your name, a valid 10 digit phone number, delivery address, and at least one item.' });
  if (!['upi-demo', 'card-demo', 'cod'].includes(paymentMethod)) return res.status(400).json({ error: 'Choose a valid payment method.' });
  const normalized = [];
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return res.status(400).json({ error: 'One of the cart items is invalid.' });
    normalized.push({ productId: product.id, name: product.name, unitPrice: product.price, quantity });
  }
  const subtotal = normalized.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const promoActive = req.body.promoCode === 'JOY10' && Date.now() < promotionEndsAt && subtotal >= 999;
  const discount = promoActive ? Math.round(subtotal * 0.1) : 0;
  const order = { id: `RM${Date.now().toString().slice(-8)}`, customerName: customerName.trim(), phone, address: address.trim(), paymentMethod, paymentStatus: paymentMethod === 'cod' ? 'pay-on-delivery' : 'paid-demo', items: normalized, subtotal, discount, total: subtotal - discount, createdAt: new Date().toISOString() };
  orders.push(order);
  res.status(201).json(order);
});

app.listen(PORT, () => console.log(`API ready at http://localhost:${PORT}`));
