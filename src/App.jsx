import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Plus, Minus, Trash2, ArrowRight, Sparkles, CheckCircle2, CreditCard } from 'lucide-react';
const API = 'http://localhost:5000/api';
const money = value => `₹${Number(value).toLocaleString('en-IN')}`;

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('rangoli-cart') || '[]'));
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('rangoli-favorites') || '[]'));
  const [showFavorites, setShowFavorites] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentQrOpen, setPaymentQrOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [checkout, setCheckout] = useState({ customerName: '', phone: '', address: '', paymentMethod: 'upi-demo' });
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => { localStorage.setItem('rangoli-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('rangoli-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { fetch(`${API}/promotion`).then(r => r.json()).then(setPromotion).catch(() => {}); }, []);
  useEffect(() => {
    if (!promotion?.endsAt) return;
    const update = () => setSecondsLeft(Math.max(0, Math.floor((promotion.endsAt - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [promotion]);
  useEffect(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(list => setCategories(['All', ...list])).catch(() => {});
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (!showFavorites && category !== 'All') params.set('category', category);
    if (!showFavorites && query.trim()) params.set('q', query.trim());
    setLoading(true); setError('');
    fetch(`${API}/products?${params}`).then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setProducts).catch(() => setError('Could not connect to the shop server. Start the backend and refresh.'))
      .finally(() => setLoading(false));
  }, [category, query, showFavorites]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const promoEligible = Boolean(promotion && secondsLeft > 0 && total >= promotion.minimumOrder);
  const discount = promoEligible ? Math.round(total * promotion.percent / 100) : 0;
  const clock = `${String(Math.floor(secondsLeft / 3600)).padStart(2, '0')}:${String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const addToCart = product => {
    setCart(current => current.some(item => item.id === product.id)
      ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]);
    setToast('Added to your bag'); window.setTimeout(() => setToast(''), 1800);
  };
  const toggleFavorite = productId => setFavorites(current => current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId]);
  const changeQuantity = (id, amount) => setCart(current => current.map(item => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter(item => item.quantity > 0));
  const submitOrder = async () => {
    setPlacingOrder(true);
    try {
      const response = await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...checkout, promoCode: promoEligible ? promotion.code : undefined, items: cart.map(item => ({ productId: item.id, quantity: item.quantity })) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not place order');
      setCart([]); setCartOpen(false); setCheckoutOpen(false); setCompletedOrder(result);
    } catch (e) { setToast(e.message); window.setTimeout(() => setToast(''), 3500); }
    finally { setPlacingOrder(false); }
  };
  const placeOrder = event => {
    event.preventDefault();
    if (checkout.paymentMethod === 'cod') return submitOrder();
    setPaymentReference(`LAKI${Date.now().toString().slice(-8)}`);
    setCheckoutOpen(false);
    setPaymentQrOpen(true);
  };
  const visibleProducts = showFavorites ? products.filter(product => favorites.includes(product.id)) : products;

  return <>
    <div className="announcement">A little joy in every delivery <span>✦</span> Free delivery on orders above ₹499</div>
    <header className="header">
      <button className="icon-button mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button>
      <a href="#home" className="brand"><span className="brand-mark">l</span><span>laki<span className="brand-dot">.</span><small>MARKETPLACE</small></span></a>
      <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>{['Women', 'Men', 'Home', 'Accessories'].map(item => <button key={item} onClick={() => { setCategory(item); setMobileMenu(false); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }}>{item}</button>)}</nav>
      <div className="header-actions"><label className="search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for anything lovely" /></label><button className="bag-button" onClick={() => setCartOpen(true)} aria-label="Open shopping bag"><ShoppingBag size={21} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}</button></div>
    </header>
    <main id="home">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> YOUR EVERYDAY HAPPY PLACE</div><h1>Good finds.<br /><em>Lovely prices.</em></h1><p>Fresh styles and little home joys, picked just for you.</p><a href="#shop" className="primary-button">Explore the collection <ArrowRight size={17} /></a><div className="hero-note"><span>✳</span> Made for your kind of everyday</div></div><div className="hero-art"><div className="hero-image"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=85" alt="Friends enjoying a day of shopping" /></div><div className="floating-note"><span>the little things</span><strong>make a lovely day</strong><i>♡</i></div><div className="sunburst">GOOD<br />VIBES</div></div></section>
      <section className="benefits"><div><span className="benefit-icon">♡</span><span><b>Thoughtful finds</b><small>For every kind of day</small></span></div><div><span className="benefit-icon">✦</span><span><b>Prices to smile about</b><small>More joy for your budget</small></span></div><div><span className="benefit-icon">↺</span><span><b>Easy returns</b><small>Shop with peace of mind</small></span></div><div><span className="benefit-icon">⌂</span><span><b>At your doorstep</b><small>Across India</small></span></div></section>
      {promotion && <section className={secondsLeft ? 'offer-strip' : 'offer-strip offer-ended'}><div className="offer-spark">✦</div><div className="offer-copy"><span className="eyebrow">{secondsLeft ? 'A LITTLE EXTRA JOY, FOR A LIMITED TIME' : 'THIS LITTLE OFFER HAS ENDED'}</span><strong>{secondsLeft ? `${promotion.percent}% off orders above ${money(promotion.minimumOrder)}` : 'Thanks for stopping by!'}</strong><span>{secondsLeft ? <>Use code <b>{promotion.code}</b> at checkout</> : 'Look out for our next lovely deal.'}</span></div>{secondsLeft > 0 && <div className="offer-timer-wrap"><small>OFFER ENDS IN</small><div className="offer-timer"><span>{clock.slice(0, 2)}</span><i>:</i><span>{clock.slice(3, 5)}</span><i>:</i><span>{clock.slice(6, 8)}</span></div></div>}<a href="#shop" className="offer-link">Shop now <ArrowRight size={16} /></a></section>}
      <section className="shop-section" id="shop"><div className="section-heading"><div><span className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</span><h2>{showFavorites ? <>Your <em>favorites</em></> : <>Find your <em>favorites</em></>}</h2></div><span className="result-count">{visibleProducts.length} lovely finds</span></div><div className="category-row">{categories.map(item => <button className={!showFavorites && category === item ? 'category-pill active' : 'category-pill'} key={item} onClick={() => { setCategory(item); setShowFavorites(false); }}>{item}</button>)}<button className={showFavorites ? 'category-pill active favorite-filter' : 'category-pill favorite-filter'} onClick={() => setShowFavorites(!showFavorites)}><Heart size={13} /> Saved ({favorites.length})</button></div>
        {error && <div className="notice">{error}</div>}{loading ? <div className="loading">Finding lovely things for you…</div> : visibleProducts.length === 0 ? <div className="empty-state">{showFavorites ? 'No favorites saved yet. Tap a heart on a product to save it.' : 'No finds yet. Try another search or category.'}</div> : <div className="product-grid">{visibleProducts.map(product => { const saving = Math.max(0, Math.round((1 - product.price / product.originalPrice) * 100)); const isFavorite = favorites.includes(product.id); return <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /><button className={isFavorite ? 'wish-button wished' : 'wish-button'} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={isFavorite} onClick={() => toggleFavorite(product.id)}><Heart size={18} /></button>{saving > 0 && <span className="tag">{saving}% OFF</span>}</div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><div className="price-line"><strong>{money(product.price)}</strong><del>{money(product.originalPrice)}</del><span className="rating">★ {product.rating}</span></div><button className="add-button" onClick={() => addToCart(product)}>Add to bag <Plus size={16} /></button></div></article>; })}</div>}
      </section>
      <section className="bottom-banner"><div><span className="eyebrow">A LITTLE TREAT FROM US</span><h2>Make room for <em>more joy.</em></h2><p>Lovely everyday finds are just a few clicks away.</p></div><a className="light-button" href="#shop">Shop the collection <ArrowRight size={16} /></a><span className="banner-flower">✿</span></section>
    </main>
    <footer><a href="#home" className="brand footer-brand"><span className="brand-mark">l</span><span>laki<span className="brand-dot">.</span><small>MARKETPLACE</small></span></a><span>Everyday finds, lovely prices.</span><span>© 2026 Laki Marketplace</span></footer>
    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">YOUR LOVELY FINDS</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button></div>{cart.length === 0 ? <div className="cart-empty"><span>♡</span><h3>Your bag is waiting</h3><p>Add a few lovely finds to get started.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Keep exploring</button></div> : <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item-main"><b>{item.name}</b><strong>{money(item.price)}</strong><div className="qty"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Reduce quantity"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button><button className="remove" onClick={() => setCart(current => current.filter(i => i.id !== item.id))} aria-label="Remove item"><Trash2 size={15} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(total)}</strong></div>{promotion && <div className="promo-line"><span>{promoEligible ? `Offer ${promotion.code} (${promotion.percent}% off)` : secondsLeft ? `Add ${money(Math.max(0, promotion.minimumOrder - total))} to unlock ${promotion.code}` : 'Offer expired'}</span><strong>{discount ? `−${money(discount)}` : money(0)}</strong></div>}<div className="cart-total"><span>Total</span><strong>{money(total - discount)}</strong></div><small>Delivery calculated at checkout.</small><button className="checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Continue to checkout <ArrowRight size={17} /></button><p>Demo payment only · No real charge</p></div></>}</aside></div>}
    {checkoutOpen && <div className="modal-backdrop" onClick={() => setCheckoutOpen(false)}><section className="checkout-modal" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">STEP 2 OF 3 · DELIVERY & PAYMENT</span><h2>Checkout</h2></div><button className="icon-button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button></div><form onSubmit={placeOrder}><label className="field-label">Full name<input required minLength="2" value={checkout.customerName} onChange={e => setCheckout({...checkout, customerName: e.target.value})} placeholder="Your name" /></label><label className="field-label">Phone number<input required pattern="[0-9]{10}" value={checkout.phone} onChange={e => setCheckout({...checkout, phone: e.target.value})} placeholder="10 digit mobile number" inputMode="numeric" /></label><label className="field-label">Delivery address<textarea required minLength="8" value={checkout.address} onChange={e => setCheckout({...checkout, address: e.target.value})} placeholder="House, street, city, PIN code" rows="3" /></label><div className="payment-title"><CreditCard size={17} /> Choose payment method</div><label className="payment-option"><input type="radio" name="payment" value="upi-demo" checked={checkout.paymentMethod === 'upi-demo'} onChange={e => setCheckout({...checkout, paymentMethod: e.target.value})} /><span><b>UPI QR · Demo payment</b><small>Show a demo QR at the next step; no money is charged</small></span></label><label className="payment-option"><input type="radio" name="payment" value="card-demo" checked={checkout.paymentMethod === 'card-demo'} onChange={e => setCheckout({...checkout, paymentMethod: e.target.value})} /><span><b>Card · Demo payment</b><small>Test flow only; do not enter card details</small></span></label><label className="payment-option"><input type="radio" name="payment" value="cod" checked={checkout.paymentMethod === 'cod'} onChange={e => setCheckout({...checkout, paymentMethod: e.target.value})} /><span><b>Cash on delivery</b><small>Pay when your sample order arrives</small></span></label><div className="checkout-total"><span>Amount due</span><strong>{money(total - discount)}</strong></div><button className="checkout-button" type="submit" disabled={placingOrder}>{checkout.paymentMethod === 'cod' ? 'Place order' : 'Continue to payment'} <ArrowRight size={17} /></button><p className="demo-note">Demo checkout only. Online payment is simulated; no real payment will be collected.</p></form></section></div>}
    {paymentQrOpen && <div className="modal-backdrop"><section className="qr-modal"><button className="icon-button qr-close" onClick={() => setPaymentQrOpen(false)} aria-label="Back to checkout"><X /></button><span className="eyebrow">STEP 3 OF 3 · DEMO PAYMENT</span><h2>Scan to pay</h2><p className="qr-amount">{money(total - discount)}</p><div className="qr-frame"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(`LAKI MARKETPLACE DEMO ONLY | REF ${paymentReference} | AMOUNT ${total - discount} INR`)}`} alt="Demo payment QR code" /><span>LAKI · DEMO</span></div><div className="qr-reference">Reference: <b>{paymentReference}</b></div><p className="qr-warning">This QR is a checkout demo reference only. It cannot accept payment. Do not scan it to send money.</p><button className="checkout-button" disabled={placingOrder} onClick={submitOrder}>{placingOrder ? 'Confirming demo payment…' : 'Simulate successful payment'} <CheckCircle2 size={17} /></button><button className="back-link" onClick={() => { setPaymentQrOpen(false); setCheckoutOpen(true); }}>Back to payment choices</button></section></div>}
    {completedOrder && <div className="modal-backdrop"><section className="success-modal"><div className="success-check"><CheckCircle2 size={52} /></div><span className="eyebrow">ORDER CONFIRMED</span><h2>Your order is on its way!</h2><p>Thanks, {completedOrder.customerName}. Your order was placed successfully.</p><div className="success-details"><div><span>Order number</span><b>{completedOrder.id}</b></div><div><span>Payment</span><b>{completedOrder.paymentStatus === 'paid-demo' ? 'Demo payment successful' : 'Cash on delivery'}</b></div><div><span>Amount</span><b>{money(completedOrder.total)}</b></div></div><div className="success-items">{completedOrder.items.map(item => <div key={item.productId}><span>{item.name} × {item.quantity}</span><b>{money(item.unitPrice * item.quantity)}</b></div>)}</div><button className="checkout-button" onClick={() => setCompletedOrder(null)}>Continue shopping <ArrowRight size={17} /></button><small className="demo-note">This is a sample order; no real payment or delivery is made.</small></section></div>}
    {toast && <div className="toast">{toast}</div>}
  </>;
}
