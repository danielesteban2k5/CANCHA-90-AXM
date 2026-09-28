import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Check, Heart, Menu, ShoppingBag, Truck, ShieldCheck, CreditCard, X, Minus, Plus, MessageCircle, Ruler, PackageCheck } from 'lucide-react'
import './styles.css'

const WHATSAPP_NUMBER = '573136171666'

const products = [
  { id: 1, name: 'Horizonte', type: 'Camisa titular', price: 65000, category: 'Nuevas', league: 'Liga BetPlay Dimayor', color: 'Navy', image: '/assets/cancha-90-product-navy.png', badge: 'Nuevo', sizes: ['S', 'M', 'L', 'XL'], stock: 12, description: 'Una camisa limpia y contundente, pensada para llevar la pasión todos los días dentro y fuera de la cancha.', details: ['Tela deportiva liviana', 'Cuello reforzado', 'Corte regular unisex'] },
  { id: 2, name: 'Ascenso', type: 'Camisa alternativa', price: 65000, category: 'Nuevas', league: 'Liga MX', color: 'Cream', image: '/assets/cancha-90-product-cream.png', sizes: ['S', 'M', 'L'], stock: 8, description: 'Contraste, textura y carácter en una pieza que funciona igual de bien en la tribuna o en la calle.', details: ['Tela de secado rápido', 'Panel frontal texturizado', 'Corte regular unisex'] },
  { id: 3, name: 'Legado', type: 'Edición especial', price: 65000, category: 'Especiales', league: 'LaLiga', color: 'Black', image: '/assets/cancha-90-product-black.png', badge: 'Más vendida', sizes: ['M', 'L', 'XL'], stock: 5, description: 'La edición especial para quienes entienden que una camiseta también puede guardar una historia.', details: ['Edición limitada', 'Textura técnica premium', 'Acabados de colección'] },
  { id: 4, name: 'Distrito', type: 'Camisa retro', price: 65000, oldPrice: 89900, category: 'Retro', league: 'Premier League', color: 'Red', image: '/assets/cancha-90-product-red.png', badge: 'Oferta', sizes: ['S', 'M', 'L', 'XL'], stock: 16, description: 'Una silueta retro con el color y la energía de las noches largas de fútbol.', details: ['Cuello estilo clásico', 'Tela suave', 'Inspiración noventera'] },
  { id: 5, name: 'Pórtico', type: 'Camisa de selección', price: 65000, category: 'Selecciones', league: 'Brasileirão Série A', color: 'Navy', image: '/assets/cancha-90-product-navy.png', sizes: ['S', 'M', 'L', 'XL'], stock: 10, description: 'Una selección de carácter limpio para representar tu pasión en cada partido.', details: ['Tela deportiva liviana', 'Escudo bordado', 'Corte regular unisex'] },
  { id: 6, name: 'Norte', type: 'Camisa de selección', price: 65000, category: 'Selecciones', league: 'Major League Soccer', color: 'Cream', image: '/assets/cancha-90-product-cream.png', sizes: ['S', 'M', 'L'], stock: 7, description: 'Una pieza versátil para jugar, viajar y llevar el fútbol contigo.', details: ['Tela de secado rápido', 'Panel frontal texturizado', 'Corte regular unisex'] },
  { id: 7, name: 'Pulso', type: 'Camisa titular', price: 65000, category: 'Nuevas', league: 'Primera División de Chile', color: 'Black', image: '/assets/cancha-90-product-black.png', sizes: ['M', 'L', 'XL'], stock: 9, description: 'Negro técnico y detalles vivos para las noches que se juegan hasta el final.', details: ['Textura técnica premium', 'Cuello reforzado', 'Edición limitada'] },
  { id: 8, name: 'Clásico', type: 'Camisa retro', price: 65000, category: 'Retro', league: 'Liga Profesional Argentina', color: 'Red', image: '/assets/cancha-90-product-red.png', sizes: ['S', 'M', 'L', 'XL'], stock: 11, description: 'Una silueta de archivo para quienes prefieren el fútbol con memoria.', details: ['Cuello estilo clásico', 'Tela suave', 'Inspiración noventera'] },
]

const leagues = ['Todas', ...new Set(products.map((product) => product.league))]
const leagueCountries = {
  'Liga BetPlay Dimayor': 'Colombia',
  'Liga MX': 'México',
  LaLiga: 'España',
  'Premier League': 'Inglaterra',
  'Brasileirão Série A': 'Brasil',
  'Major League Soccer': 'Estados Unidos',
  'Primera División de Chile': 'Chile',
  'Liga Profesional Argentina': 'Argentina',
}
const formatPrice = (value) => `$${value.toLocaleString('es-CO')}`

function App() {
  const [category, setCategory] = useState('Todas')
  const [league, setLeague] = useState('Todas')
  const [cart, setCart] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [detailProduct, setDetailProduct] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState([])
  const [notice, setNotice] = useState('')
  const [customer, setCustomer] = useState({ name: '', phone: '', city: '', address: '', notes: '' })

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'Todas' || (category === 'Ofertas' && product.badge === 'Oferta') || (category === 'Retro' && product.category === 'Retro') || (category === 'Selecciones' && (product.id === 2 || product.id === 3)) || product.category === category
      const matchesLeague = league === 'Todas' || product.league === league
      return matchesCategory && matchesLeague
    })
  }, [category, league])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2200) }

  const addToCart = (product, size = product.sizes[0], quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id && item.size === size)
      if (existing) return current.map((item) => item.id === product.id && item.size === size ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item)
      return [...current, { ...product, size, quantity }]
    })
    notify(`${product.name} · talla ${size} se añadió al carrito`)
    setDetailProduct(null)
    setDrawerOpen(true)
  }

  const updateQuantity = (id, size, amount) => {
    setCart((current) => current.map((item) => item.id === id && item.size === size ? { ...item, quantity: Math.max(0, Math.min(item.stock, item.quantity + amount)) } : item).filter((item) => item.quantity > 0))
  }

  const sendToWhatsApp = (event) => {
    event.preventDefault()
    if (!cart.length) return
    const lines = cart.map((item) => `• ${item.name} | Talla ${item.size} | Cantidad: ${item.quantity} | ${formatPrice(item.price * item.quantity)}`).join('\n')
    const message = `Hola CANCHA 90 AXM, quiero realizar este pedido:\n\n${lines}\n\nTotal productos: ${formatPrice(cartTotal)}\n\nDatos de entrega:\nNombre: ${customer.name}\nTeléfono: ${customer.phone}\nCiudad: ${customer.city}\nDirección: ${customer.address}\nNotas: ${customer.notes || 'Sin notas'}\n\nQuedo atento(a) para confirmar disponibilidad, envío y forma de pago.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    notify('Pedido preparado. WhatsApp se abrirá en una nueva pestaña.')
  }

  return <div className="site-shell">
    <div className="announcement"><span>Envíos gratis desde $180.000</span><span className="announcement-dot">•</span><span>Compra segura en cada jugada</span></div>
    <header className="header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={22} /></button>
      <a className="wordmark" href="#inicio" aria-label="CANCHA 90 AXM inicio">CANCHA <strong>90</strong></a>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>{['Inicio', 'Camisas', 'Retro', 'Selecciones', 'Ofertas'].map((item) => <a href={item === 'Inicio' ? '#inicio' : '#coleccion'} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}</nav>
      <div className="header-actions"><button className="icon-button" aria-label="Favoritos"><Heart size={19} /></button><button className="bag-button" onClick={() => setDrawerOpen(true)} aria-label="Abrir carrito"><ShoppingBag size={20} /><span>{cartCount}</span></button></div>
    </header>

    <main>
      <section className="hero" id="inicio"><div className="hero-copy"><p className="eyebrow red">FÚTBOL · ESTILO · ACTITUD</p><h1>VISTE TU <span>PASIÓN</span></h1><p className="hero-text">Camisas que cuentan historias. Para hoy, para siempre. Más que fútbol, es una forma de vivir.</p><div className="hero-cta"><a className="button button-lime" href="#coleccion">Ver colección <ArrowRight size={18} /></a><a className="text-link" href="#coleccion">Explorar camisas <ArrowRight size={15} /></a></div></div><div className="hero-notes"><span>MISMA<br />PASIÓN</span><span>NUEVAS<br />HISTORIAS</span></div><div className="hero-bottom"><div><Truck size={21} /><span><b>Envíos a todo el país</b><small>Rápidos y seguros</small></span></div><div><CreditCard size={21} /><span><b>Pagos coordinados</b><small>Directo por WhatsApp</small></span></div><div><ShieldCheck size={21} /><span><b>Compra protegida</b><small>Atención personalizada</small></span></div></div></section>

      <section className="collection-section" id="coleccion"><div className="section-heading"><div><p className="eyebrow red">TODA LA COLECCIÓN</p><h2>CAMISAS Y SELECCIONES</h2></div><a href="#coleccion" className="view-all">Ver todas <ArrowRight size={15} /></a></div><div className="catalog-toolbar"><div className="category-row">{['Todas', 'Nuevas', 'Retro', 'Selecciones', 'Ofertas'].map((item) => <button className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><div className="catalog-filters"><label><span>Liga</span><select value={league} onChange={(event) => setLeague(event.target.value)}>{leagues.map((item) => <option value={item} key={item}>{item}</option>)}</select></label><span className="results-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'camisa encontrada' : 'camisas encontradas'}</span></div></div><div className="collection-layout"><div className="product-grid">{filteredProducts.length ? filteredProducts.map((product) => <ProductCard key={product.id} product={product} liked={liked.includes(product.id)} onLike={() => setLiked((current) => current.includes(product.id) ? current.filter((item) => item !== product.id) : [...current, product.id])} onDetails={() => setDetailProduct(product)} onAdd={() => addToCart(product)} />) : <div className="empty-results"><h3>No encontramos camisas</h3><p>Prueba otra combinación de liga o categoría.</p></div>}</div></div></section>

      <section className="trust-section"><div><Truck size={25} /><strong>Envíos a todo el país</strong><span>Rápidos y seguros</span></div><div><CreditCard size={25} /><strong>Pagos coordinados</strong><span>Te atendemos por WhatsApp</span></div><div><ShieldCheck size={25} /><strong>Compra segura</strong><span>Tus datos protegidos</span></div></section>
      <section className="league-showcase"><div className="league-showcase-copy"><p className="eyebrow red">ELIGE TU LIGA</p><h2>COMPETICIONES REALES</h2><p>Explora camisas inspiradas en las principales ligas del fútbol mundial.</p><span className="league-count">08 LIGAS DISPONIBLES</span></div><div className="league-list">{leagues.filter((item) => item !== 'Todas').map((item, index) => <button key={item} onClick={() => { setLeague(item); setCategory('Todas'); window.location.hash = 'coleccion' }}><span className="league-number">0{index + 1}</span><span className="league-card-info"><strong>{item}</strong><small>{leagueCountries[item]}</small></span><ArrowRight size={19} /></button>)}</div></section>
    </main>

    <footer className="footer"><a className="wordmark" href="#inicio">CANCHA <strong>90</strong></a><span>Juega. Viste. Vive.</span><div className="footer-links"><a href="#coleccion">Tienda</a><a href="#coleccion">Colección</a><a href="#inicio">Contacto</a></div><small>© 2026 CANCHA 90 AXM. Todos los derechos reservados.</small></footer>
    {notice && <div className="toast"><Check size={17} /> {notice}</div>}
    {detailProduct && <ProductDetail product={detailProduct} onClose={() => setDetailProduct(null)} onAdd={addToCart} />}
    {drawerOpen && <CartDrawer cart={cart} cartCount={cartCount} cartTotal={cartTotal} onClose={() => setDrawerOpen(false)} onUpdate={updateQuantity} onCheckout={() => { setDrawerOpen(false); setCheckoutOpen(true) }} />}
    {checkoutOpen && <CheckoutModal customer={customer} setCustomer={setCustomer} cart={cart} cartTotal={cartTotal} onClose={() => setCheckoutOpen(false)} onSubmit={sendToWhatsApp} />}
  </div>
}

function ProductCard({ product, liked, onLike, onDetails, onAdd }) {
  return <article className="product-card"><button className="product-image product-image-button" onClick={onDetails} aria-label={`Ver detalles de ${product.name}`}><img src={product.image} alt={`Camisa ${product.name}`} />{product.badge && <span className="badge">{product.badge}</span>}<span className="quick-view">Ver detalles</span><span className="like-button" onClick={(event) => { event.stopPropagation(); onLike() }} aria-label="Añadir a favoritos"><Heart size={17} fill={liked ? 'currentColor' : 'none'} /></span></button><div className="product-info"><button className="product-name-button" onClick={onDetails}><h3>{product.name}</h3><div className="product-taxonomy"><span>{product.league}</span></div><p>{product.type} · {product.stock} disponibles</p></button><button className="add-button" onClick={onAdd} aria-label={`Añadir ${product.name}`}><Plus size={19} /></button><strong>{formatPrice(product.price)}</strong></div></article>
}

function ProductDetail({ product, onClose, onAdd }) {
  const [size, setSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  return <div className="modal-backdrop" onClick={onClose}><section className="product-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={21} /></button><div className="detail-image"><img src={product.image} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow red">{product.category.toUpperCase()} · {product.stock} DISPONIBLES</p><h2>{product.name}</h2><p className="detail-type">{product.type}</p><div className="detail-price">{formatPrice(product.price)} {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><p className="detail-description">{product.description}</p><div className="detail-meta"><span><PackageCheck size={17} /> Stock disponible</span><span><Truck size={17} /> Envío nacional</span></div><div className="size-label"><strong>Selecciona tu talla</strong><button className="size-guide"><Ruler size={14} /> Guía de tallas</button></div><div className="size-row">{product.sizes.map((item) => <button className={size === item ? 'size-button active' : 'size-button'} onClick={() => setSize(item)} key={item}>{item}</button>)}</div><div className="detail-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={14} /></button></div><button className="button button-lime add-detail" onClick={() => onAdd(product, size, quantity)}>Añadir al carrito <ShoppingBag size={17} /></button></div><ul className="detail-list">{product.details.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul></div></section></div>
}

function CartDrawer({ cart, cartCount, cartTotal, onClose, onUpdate, onCheckout }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow lime">TU SELECCIÓN</p><h2>Carrito <span>({cartCount})</span></h2></div><button className="icon-button" onClick={onClose}><X size={21} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={30} /><h3>Tu carrito está esperando</h3><p>Agrega una camisa y arma tu próxima jugada.</p><button className="button button-lime" onClick={onClose}>Seguir comprando</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={`${item.id}-${item.size}`}><img src={item.image} alt={item.name} /><div><h3>{item.name}</h3><p>{item.type} · Talla {item.size}</p><strong>{formatPrice(item.price * item.quantity)}</strong><div className="quantity"><button onClick={() => onUpdate(item.id, item.size, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => onUpdate(item.id, item.size, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><small>El envío y la forma de pago se coordinan por WhatsApp.</small><button className="button button-lime full-width" onClick={onCheckout}><MessageCircle size={17} /> Finalizar por WhatsApp</button></div></>}</aside></div>
}

function CheckoutModal({ customer, setCustomer, cart, cartTotal, onClose, onSubmit }) {
  const setField = (field, value) => setCustomer((current) => ({ ...current, [field]: value }))
  return <div className="modal-backdrop" onClick={onClose}><section className="checkout-modal" onClick={(event) => event.stopPropagation()}><div className="checkout-head"><div><p className="eyebrow lime">ÚLTIMO PASO</p><h2>Finaliza tu pedido</h2><p>Completa tus datos y te llevaremos a WhatsApp para confirmar disponibilidad, envío y pago.</p></div><button className="modal-close" onClick={onClose}><X size={21} /></button></div><div className="checkout-layout"><form className="checkout-form" onSubmit={onSubmit}><label>Nombre completo<input value={customer.name} onChange={(event) => setField('name', event.target.value)} placeholder="Ej. Juan Pérez" required /></label><div className="form-row"><label>Teléfono<input value={customer.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="300 000 0000" required /></label><label>Ciudad<input value={customer.city} onChange={(event) => setField('city', event.target.value)} placeholder="Bogotá" required /></label></div><label>Dirección de entrega<input value={customer.address} onChange={(event) => setField('address', event.target.value)} placeholder="Calle, carrera, número y barrio" required /></label><label>Notas del pedido <span className="optional">(opcional)</span><textarea value={customer.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Talla especial, indicaciones de entrega..." rows="3" /></label><button className="button whatsapp-button" type="submit"><MessageCircle size={18} /> Enviar pedido a WhatsApp</button></form><aside className="checkout-summary"><p className="eyebrow red">RESUMEN</p>{cart.map((item) => <div className="checkout-product" key={`${item.id}-${item.size}`}><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>Talla {item.size} · Cant. {item.quantity}</span></div><b>{formatPrice(item.price * item.quantity)}</b></div>)}<div className="checkout-total"><span>Total productos</span><strong>{formatPrice(cartTotal)}</strong></div><small><ShieldCheck size={14} /> No solicitamos datos de tarjeta en esta página.</small></aside></div></section></div>
}

createRoot(document.getElementById('root')).render(<App />)
