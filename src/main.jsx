import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Check, ChevronDown, Heart, Menu, ShoppingBag, Truck, ShieldCheck, CreditCard, X, Minus, Plus, MessageCircle, Ruler, PackageCheck } from 'lucide-react'
import barcelonaImage from './assets/barcelona 1.webp'
import barcelonaTwoImage from './assets/barcelona 2.webp'
import nacionalImage from './assets/nacional.webp'
import psgImage from './assets/psg.webp'
import './styles.css'

const WHATSAPP_NUMBER = '573136171666'
const FREE_SHIPPING_THRESHOLD = 120000

const products = [
  { id: 1, name: 'Atlético Nacional', type: 'Camisa titular', price: 65000, oldPrice: 75000, category: 'Nuevas', league: 'Liga BetPlay Dimayor', color: 'Navy', image: nacionalImage, badge: 'Nuevo', sizes: ['S', 'M', 'L', 'XL'], stock: 12, description: 'Camiseta titular inspirada en Atlético Nacional, con los colores verde y blanco del Verdolaga. Ideal para alentar al equipo dentro y fuera de la cancha.', details: ['Tela deportiva liviana', 'Cuello reforzado', 'Corte regular unisex'] },
  { id: 2, name: 'Paris Saint-Germain', type: 'Camiseta local (Home) · Temporada 2026/27', price: 65000, oldPrice: 75000, category: 'Nuevas', league: 'Ligue 1', image: psgImage, badge: 'Temporada 2026/27', sizes: ['S', 'M', 'L'], stock: 8, description: 'Lleva la auténtica identidad parisina con la equipación oficial de local del PSG para la temporada 2026/27. Su base en azul Old Royal recupera la esencia clásica del club y se combina con un panel central de la franja Hechter más ancho que en años anteriores. Esta edición alinea verticalmente el escudo del Paris Saint-Germain y el Swoosh de Nike en el centro del pecho. Está confeccionada con tejido técnico microperforado de alta transpirabilidad e incluye Qatar Airways al frente y el logo urbano de Snipes en la zona lumbar baja.', details: ['Camiseta local oficial · Temporada 2026/27', 'Azul Old Royal y franja Hechter central más ancha', 'Escudo y Swoosh centrados · Qatar Airways y Snipes'] },
  { id: 9, name: 'FC Barcelona Retro 2026', type: 'Camisa visitante · Edición especial retro', price: 65000, oldPrice: 75000, category: 'Retro', league: 'LaLiga', color: 'Cream', image: barcelonaImage, badge: 'Edición 2026', sizes: ['S', 'M', 'L', 'XL'], stock: 10, description: 'Edición especial retro lanzada en 2026, inspirada en la mítica camiseta visitante del FC Barcelona de las temporadas 2001/02 y 2002/03. Su base crema/oro y su franja vertical central azulgrana evocan el diseño original, junto con los detalles oscuros del cuello y las mangas. Una reinterpretación moderna que combina tecnología textil actual con la nostalgia de inicios de siglo.', details: ['Lanzamiento: 2026', 'Inspirada en la visitante de 2001/02 y 2002/03', 'Base crema/oro y franja central azulgrana'] },
  { id: 10, name: 'FC Barcelona Local 2026/27', type: 'Camiseta local', price: 65000, oldPrice: 75000, category: 'Nuevas', league: 'LaLiga', image: barcelonaTwoImage, badge: 'Temporada 2026/27', sizes: ['S', 'M', 'L', 'XL'], stock: 10, description: 'Camiseta local oficial del FC Barcelona para la temporada 2026/27, lanzada a mediados de 2026. Su diseño texturizado en tonos azulgrana está inspirado en la fachada del renovado Spotify Camp Nou y representa una nueva era para el club. Incorpora tecnología textil de alto rendimiento para ofrecer frescura, comodidad y transpirabilidad dentro y fuera de la cancha, junto con los logos de Nike y Spotify.', details: ['Temporada 2026/27 · lanzamiento a mediados de 2026', 'Diseño inspirado en la fachada del Spotify Camp Nou', 'Logos Nike y Spotify'] },
]

const capImages = import.meta.glob('./assets/Gorras/*.{jpeg,jpg,png,webp}', { eager: true, import: 'default' })
const capProducts = Object.entries(capImages)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, 'es', { numeric: true }))
  .map(([imagePath, image], index) => ({
    id: imagePath,
    name: `Gorra ${String(index + 1).padStart(2, '0')}`,
    type: 'Gorra · Ajuste y disponibilidad por confirmar',
    price: 45000,
    category: 'Gorras',
    league: 'Gorras',
    image,
    sizes: [],
    stock: 0,
    description: 'Modelo de gorra de colección. Consulta el tipo de ajuste y la disponibilidad antes de comprar.',
    details: ['Precio fijo: $45.000', 'Ajuste y talla: confirmar según el modelo', 'Envío nacional: tarifa según ciudad'],
  }))
const allProducts = [...products, ...capProducts]
const productCategories = [...new Set(products.map((product) => product.category))]
const categories = ['Todas', ...productCategories, ...(products.some((product) => product.oldPrice) ? ['Ofertas'] : [])]
const navigationItems = ['Inicio', 'Camisas', 'Gorras', ...productCategories.filter((category) => category !== 'Nuevas'), ...(categories.includes('Ofertas') ? ['Ofertas'] : [])]
const leagues = ['Todas', ...new Set(products.map((product) => product.league))]
const leagueCountries = {
  'Liga BetPlay Dimayor': 'Colombia',
  'Liga MX': 'México',
  LaLiga: 'España',
  'Ligue 1': 'Francia',
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
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('cancha90-cart') || '[]')
      return Array.isArray(saved) ? saved.flatMap((item) => {
        if (!item || typeof item !== 'object') return []
        const product = products.find((entry) => entry.id === item.id)
        if (!product || !product.sizes.includes(item.size) || !Number.isFinite(item.quantity) || item.quantity < 1) return []
        const quantity = Math.min(Math.floor(item.quantity), product.stock)
        return quantity ? [{ ...product, size: item.size, quantity }] : []
      }) : []
    } catch {
      return []
    }
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [detailProduct, setDetailProduct] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [liked, setLiked] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('cancha90-favorites') || '[]')
      return Array.isArray(saved) ? saved.filter((id) => allProducts.some((product) => product.id === id)) : []
    } catch {
      return []
    }
  })
  const [notice, setNotice] = useState('')
  const [customer, setCustomer] = useState({ name: '', phone: '', city: '', address: '', notes: '' })

  useEffect(() => {
    try {
      window.localStorage.setItem('cancha90-favorites', JSON.stringify(liked))
    } catch {
      return
    }
  }, [liked])

  useEffect(() => {
    try {
      window.localStorage.setItem('cancha90-cart', JSON.stringify(cart))
    } catch {
      return
    }
  }, [cart])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === 'Todas' || (category === 'Ofertas' && product.oldPrice) || product.category === category
      const matchesLeague = league === 'Todas' || product.league === league
      return matchesCategory && matchesLeague
    })
  }, [category, league])

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const favoriteProducts = allProducts.filter((product) => liked.includes(product.id))

  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2200) }

  const addToCart = (product, size = product.sizes[0], quantity = 1) => {
    if (!product.sizes.includes(size)) {
      notify('Selecciona una talla antes de agregar al carrito')
      return
    }
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
    const shippingMessage = cartTotal >= FREE_SHIPPING_THRESHOLD ? 'Envío gratis aplicable desde $120.000.' : 'Costo de envío por confirmar según ciudad.'
    const message = `Hola CANCHA 90 AXM, quiero realizar este pedido:\n\n${lines}\n\nTotal productos: ${formatPrice(cartTotal)}\n${shippingMessage}\n\nDatos de entrega:\nNombre: ${customer.name}\nTeléfono: ${customer.phone}\nCiudad: ${customer.city}\nDirección: ${customer.address}\nNotas: ${customer.notes || 'Sin notas'}\n\nPor favor confirmen disponibilidad, envío y medios de pago antes de realizar el pago.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    notify('Pedido preparado. WhatsApp se abrirá en una nueva pestaña.')
  }

  return <div className="site-shell">
    <div className="announcement"><span>Envíos gratis desde $120.000</span><span className="announcement-dot">•</span><span>Envío y pago se confirman por WhatsApp</span></div>
    <header className="header">
      <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú"><Menu size={22} /></button>
      <a className="wordmark" href="#inicio" aria-label="CANCHA 90 AXM inicio">CANCHA <strong>90</strong></a>
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>{navigationItems.map((item) => <a href={item === 'Inicio' ? '#inicio' : item === 'Gorras' ? '#gorras' : '#coleccion'} key={item} onClick={() => { setMenuOpen(false); if (item === 'Camisas') { setCategory('Todas'); setLeague('Todas') } else if (item !== 'Inicio' && item !== 'Gorras') { setCategory(item); setLeague('Todas') } }}>{item}</a>)}</nav>
      <div className="header-actions"><button className="icon-button favorites-button" onClick={() => setFavoritesOpen(true)} aria-label={`Ver favoritos (${liked.length})`}><Heart size={19} />{liked.length > 0 && <span className="favorites-count">{liked.length}</span>}</button><button className="bag-button" onClick={() => setDrawerOpen(true)} aria-label="Abrir carrito"><ShoppingBag size={20} /><span>{cartCount}</span></button></div>
    </header>

    <main>
      <section className="hero" id="inicio"><div className="hero-copy"><p className="eyebrow red">CAMISAS DE FÚTBOL</p><h1>VISTE TU <span>PASIÓN</span></h1><p className="hero-text">Camisas de tus equipos y ligas favoritas para llevar tu pasión dentro y fuera de la cancha.</p><div className="hero-cta"><a className="button button-lime" href="#coleccion">Ver colección <ArrowRight size={18} /></a><a className="text-link" href="#coleccion">Explorar colección <ArrowRight size={15} /></a></div></div><div className="hero-notes"><span>MISMA<br />PASIÓN</span><span>NUEVAS<br />HISTORIAS</span></div><div className="hero-bottom"><div><Truck size={21} /><span><b>Envíos a todo el país</b><small>Rápidos y seguros</small></span></div><div><CreditCard size={21} /><span><b>Pagos coordinados</b><small>Directo por WhatsApp</small></span></div><div><ShieldCheck size={21} /><span><b>Confirmación antes del pago</b><small>Disponibilidad por WhatsApp</small></span></div></div></section>

      <section className="collection-section" id="coleccion">
        <div className="section-heading">
          <div><p className="eyebrow red">TODA LA COLECCIÓN</p><h2>CAMISAS DE CLUBES</h2></div>
          <a href="#coleccion" className="view-all">Ver todas <ArrowRight size={15} /></a>
        </div>
        <div className="catalog-toolbar">
          <div className="category-row">{categories.map((item) => <button className={category === item ? 'category active' : 'category'} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
          <div className="catalog-filters">
            <div className="league-filter">
              <span id="league-filter-label">Liga</span>
              <LeagueDropdown options={leagues} value={league} onChange={setLeague} />
            </div>
            <span className="results-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'camisa encontrada' : 'camisas encontradas'}</span>
          </div>
        </div>
        <div className="collection-layout">
          <div className="product-grid">{filteredProducts.length ? filteredProducts.map((product) => <ProductCard key={product.id} product={product} liked={liked.includes(product.id)} onLike={() => setLiked((current) => current.includes(product.id) ? current.filter((item) => item !== product.id) : [...current, product.id])} onDetails={() => setDetailProduct(product)} onAdd={() => addToCart(product)} />) : <div className="empty-results"><h3>No encontramos camisas</h3><p>Prueba otra combinación de liga o categoría.</p></div>}</div>
        </div>
      </section>

      <section className="caps-section" id="gorras">
        <div className="caps-heading">
          <p className="eyebrow lime">NUEVOS MODELOS</p>
          <h2>GORRAS</h2>
        </div>
        <div className="cap-template-grid">{capProducts.map((product) => <ProductCard key={product.id} product={product} liked={liked.includes(product.id)} onLike={() => setLiked((current) => current.includes(product.id) ? current.filter((item) => item !== product.id) : [...current, product.id])} onDetails={() => setDetailProduct(product)} />)}</div>
      </section>

      <section className="trust-section"><div><Truck size={25} /><strong>Envíos a todo el país</strong><span>El costo se confirma según ciudad</span></div><div><CreditCard size={25} /><strong>Medios de pago coordinados</strong><span>Se confirman por WhatsApp</span></div><div><ShieldCheck size={25} /><strong>Confirmación antes del pago</strong><span>Sin cobros en esta página</span></div></section>
      <section className="league-showcase"><div className="league-showcase-copy"><p className="eyebrow red">ELIGE TU LIGA</p><h2>COMPETICIONES REALES</h2><p>Explora camisas inspiradas en las principales ligas del fútbol mundial.</p><span className="league-count">{String(leagues.length - 1).padStart(2, '0')} LIGAS DISPONIBLES</span></div><div className="league-list">{leagues.filter((item) => item !== 'Todas').map((item, index) => <button key={item} onClick={() => { setLeague(item); setCategory('Todas'); window.location.hash = 'coleccion' }}><span className="league-number">0{index + 1}</span><span className="league-card-info"><strong>{item}</strong><small>{leagueCountries[item]}</small></span><ArrowRight size={19} /></button>)}</div></section>
    </main>

    <footer className="footer"><a className="wordmark" href="#inicio">CANCHA <strong>90</strong></a><span>Juega. Viste. Vive.</span><div className="footer-links"><a href="#coleccion">Tienda</a><a href="#coleccion">Colección</a><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola CANCHA 90 AXM, quiero más información.')}`} target="_blank" rel="noreferrer">Contacto</a></div><small>© 2026 CANCHA 90 AXM. Todos los derechos reservados.</small></footer>
    {notice && <div className="toast"><Check size={17} /> {notice}</div>}
    {detailProduct && <ProductDetail product={detailProduct} onClose={() => setDetailProduct(null)} onAdd={addToCart} />}
    {drawerOpen && <CartDrawer cart={cart} cartCount={cartCount} cartTotal={cartTotal} onClose={() => setDrawerOpen(false)} onUpdate={updateQuantity} onCheckout={() => { setDrawerOpen(false); setCheckoutOpen(true) }} />}
    {favoritesOpen && <FavoritesDrawer products={favoriteProducts} onClose={() => setFavoritesOpen(false)} onRemove={(id) => setLiked((current) => current.filter((item) => item !== id))} onDetails={(product) => { setFavoritesOpen(false); setDetailProduct(product) }} />}
    {checkoutOpen && <CheckoutModal customer={customer} setCustomer={setCustomer} cart={cart} cartTotal={cartTotal} onClose={() => setCheckoutOpen(false)} onSubmit={sendToWhatsApp} />}
  </div>
}

function LeagueDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(value)))
  const triggerRef = useRef(null)
  const optionRefs = useRef([])

  useEffect(() => {
    if (isOpen) optionRefs.current[activeIndex]?.focus()
  }, [activeIndex, isOpen])

  const openMenu = () => {
    setActiveIndex(Math.max(0, options.indexOf(value)))
    setIsOpen(true)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      triggerRef.current?.focus()
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

    event.preventDefault()
    if (!isOpen) {
      openMenu()
      return
    }

    setActiveIndex((current) => {
      if (event.key === 'Home') return 0
      if (event.key === 'End') return options.length - 1
      const direction = event.key === 'ArrowDown' ? 1 : -1
      return (current + direction + options.length) % options.length
    })
  }

  const chooseOption = (option) => {
    onChange(option)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return <div className="league-select" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false) }} onKeyDown={handleKeyDown}>
    <button ref={triggerRef} className="league-select-trigger" type="button" aria-labelledby="league-filter-label" aria-haspopup="listbox" aria-expanded={isOpen} aria-controls="league-options" onClick={() => isOpen ? setIsOpen(false) : openMenu()}>
      <span>{value}</span><ChevronDown size={17} aria-hidden="true" />
    </button>
    <div className="league-options" id="league-options" role="listbox" aria-label="Ligas" hidden={!isOpen}>
      {options.map((option, index) => <button ref={(element) => { optionRefs.current[index] = element }} className="league-option" type="button" role="option" aria-selected={value === option} tabIndex={index === activeIndex ? 0 : -1} key={option} onFocus={() => setActiveIndex(index)} onClick={() => chooseOption(option)}>
        <span>{option}</span>{value === option && <Check size={16} aria-hidden="true" />}
      </button>)}
    </div>
  </div>
}

function ProductCard({ product, liked, onLike, onDetails }) {
  const canPurchase = product.price != null && product.stock > 0 && product.sizes.length > 0
  return <article className="product-card"><div className="product-image"><button className="product-image-button" type="button" onClick={onDetails} aria-label={`Ver detalles de ${product.name}`}>{product.image ? <img src={product.image} alt={`${product.type} ${product.name}`} loading="lazy" decoding="async" /> : <span className="product-image-placeholder">Foto de la gorra</span>}<span className="quick-view">Ver detalles</span></button>{product.badge && <span className="badge">{product.badge}</span>}<button className={`like-button ${liked ? 'liked' : ''}`} type="button" onClick={onLike} aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'} aria-pressed={liked}><Heart size={17} fill={liked ? 'currentColor' : 'none'} /></button></div><div className="product-info"><button className="product-name-button" onClick={onDetails}><h3>{product.name}</h3><div className="product-taxonomy"><span>{product.league}</span></div><p>{product.type}{product.stock > 0 ? ` · ${product.stock} disponibles` : ''}</p></button><button className="add-button" onClick={onDetails} disabled={!canPurchase} aria-label={`Elegir talla de ${product.name}`} title="Ver tallas y detalles"><Ruler size={19} /></button><div className="product-price">{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}<strong>{product.price == null ? 'Precio pendiente' : formatPrice(product.price)}</strong></div></div></article>
}

function ProductDetail({ product, onClose, onAdd }) {
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const canPurchase = product.price != null && product.stock > 0 && product.sizes.length > 0
  const inquiryHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola CANCHA 90 AXM, me interesa ${product.name} por $45.000. Quiero confirmar el ajuste, la disponibilidad y el costo de envío.`)}`
  return <div className="modal-backdrop" onClick={onClose}>
    <section className={product.category === 'Gorras' ? 'product-modal product-modal-cap' : 'product-modal'} onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={21} /></button>
      <div className="detail-image">{product.image ? <img src={product.image} alt={product.name} loading="eager" decoding="async" /> : <span className="detail-image-placeholder">Foto pendiente</span>}</div>
      <div className="detail-copy">
        <p className="eyebrow red">{product.category.toUpperCase()} {product.category === 'Gorras' ? '· DISPONIBILIDAD POR CONFIRMAR' : product.stock > 0 ? `· ${product.stock} DISPONIBLES` : ''}</p>
        <h2>{product.name}</h2>
        <p className="detail-type">{product.type}</p>
        <div className="detail-price">{product.price == null ? 'Precio pendiente' : formatPrice(product.price)} {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div>
        <p className="detail-description">{product.description}</p>
        {product.category === 'Gorras' ? <div className="detail-meta"><span><PackageCheck size={17} /> Existencias por confirmar</span><span><Truck size={17} /> Envíos nacionales</span></div> : canPurchase && <div className="detail-meta"><span><PackageCheck size={17} /> Stock disponible</span><span><Truck size={17} /> Envío nacional</span></div>}
        {product.category === 'Gorras' && <div className="cap-adjustment"><strong>Ajuste / talla</strong><span>Confirmar según el modelo</span></div>}
        {product.sizes.length > 0 && <>
          <div className="size-label">
            <strong>{product.category === 'Gorras' ? 'Ajuste' : 'Selecciona tu talla'}</strong>
            {product.category !== 'Gorras' && <button className="size-guide"><Ruler size={14} /> Guía de tallas</button>}
          </div>
          <div className="size-row">{product.sizes.map((item) => <button className={size === item ? 'size-button active' : 'size-button'} onClick={() => setSize(item)} key={item}>{item}</button>)}</div>
        </>}
        {canPurchase ? <div className="detail-actions">
          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={14} /></button>
          </div>
          <button className="button button-lime add-detail" onClick={() => onAdd(product, size, quantity)}>Añadir al carrito <ShoppingBag size={17} /></button>
        </div> : product.category === 'Gorras' ? <a className="button whatsapp-button full-width" href={inquiryHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Consultar ajuste y disponibilidad</a> : <p className="detail-pending">Precio y disponibilidad por confirmar antes de la compra.</p>}
        {product.details.length > 0 && <ul className="detail-list">{product.details.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul>}
      </div>
    </section>
  </div>
}

function CartDrawer({ cart, cartCount, cartTotal, onClose, onUpdate, onCheckout }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow lime">TU SELECCIÓN</p><h2>Carrito <span>({cartCount})</span></h2></div><button className="icon-button" onClick={onClose}><X size={21} /></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={30} /><h3>Tu carrito está esperando</h3><p>Agrega una camisa y arma tu próxima jugada.</p><button className="button button-lime" onClick={onClose}>Seguir comprando</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={`${item.id}-${item.size}`}><img src={item.image} alt={item.name} /><div><h3>{item.name}</h3><p>{item.type} · Talla {item.size}</p><strong>{formatPrice(item.price * item.quantity)}</strong><div className="quantity"><button onClick={() => onUpdate(item.id, item.size, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => onUpdate(item.id, item.size, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal productos</span><strong>{formatPrice(cartTotal)}</strong></div><div><span>Envío</span><strong>{cartTotal >= FREE_SHIPPING_THRESHOLD ? 'Gratis' : 'Por confirmar'}</strong></div><small>{cartTotal >= FREE_SHIPPING_THRESHOLD ? 'Envío gratis desde $120.000. ' : 'Costo según ciudad. '}El medio de pago se confirma por WhatsApp antes de comprar.</small><button className="button button-lime full-width" onClick={onCheckout}><MessageCircle size={17} /> Finalizar por WhatsApp</button></div></>}</aside></div>
}

function FavoritesDrawer({ products, onClose, onRemove, onDetails }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow red">TU LISTA</p><h2>Favoritos <span>({products.length})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar favoritos"><X size={21} /></button></div>{products.length === 0 ? <div className="empty-cart"><Heart size={30} /><h3>Aún no tienes favoritos</h3><p>Guarda productos con el corazón de cada tarjeta.</p><button className="button button-lime" onClick={onClose}>Seguir explorando</button></div> : <div className="cart-items">{products.map((product) => <article className="cart-item favorite-item" key={product.id}>{product.image ? <img src={product.image} alt={product.name} /> : <div className="favorite-image-placeholder">Foto pendiente</div>}<div><h3>{product.name}</h3><p>{product.type}</p><strong>{product.price == null ? 'Precio pendiente' : formatPrice(product.price)}</strong><div className="favorite-item-actions"><button className="favorite-detail-button" onClick={() => onDetails(product)}>Ver detalles</button><button className="favorite-remove-button" onClick={() => onRemove(product.id)} aria-label={`Quitar ${product.name} de favoritos`}><X size={17} /></button></div></div></article>)}</div>}</aside></div>
}

function CheckoutModal({ customer, setCustomer, cart, cartTotal, onClose, onSubmit }) {
  const setField = (field, value) => setCustomer((current) => ({ ...current, [field]: value }))
  return <div className="modal-backdrop" onClick={onClose}>
    <section className="checkout-modal" onClick={(event) => event.stopPropagation()}>
      <div className="checkout-head">
        <div>
          <p className="eyebrow lime">ÚLTIMO PASO</p>
          <h2>Finaliza tu pedido</h2>
          <p>Completa tus datos y te llevaremos a WhatsApp para confirmar disponibilidad, envío y pago.</p>
        </div>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={21} />
        </button>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={onSubmit}>
          <label>Nombre completo<input value={customer.name} onChange={(event) => setField('name', event.target.value)} placeholder="Ej. Juan Pérez" required /></label>
          <div className="form-row">
            <label>Teléfono<input value={customer.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="300 000 0000" required /></label>
            <label>Ciudad<input value={customer.city} onChange={(event) => setField('city', event.target.value)} placeholder="Bogotá" required /></label>
          </div>
          <label>Dirección de entrega<input value={customer.address} onChange={(event) => setField('address', event.target.value)} placeholder="Calle, carrera, número y barrio" required /></label>
          <label>Notas del pedido <span className="optional">(opcional)</span><textarea value={customer.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Talla especial, indicaciones de entrega..." rows="3" /></label>
          <button className="button whatsapp-button" type="submit"><MessageCircle size={18} /> Enviar pedido a WhatsApp</button>
        </form>
        <aside className="checkout-summary">
          <p className="eyebrow red">RESUMEN</p>
          {cart.map((item) => <div className="checkout-product" key={`${item.id}-${item.size}`}>
            <img src={item.image} alt={item.name} />
            <div><strong>{item.name}</strong><span>Talla {item.size} · Cant. {item.quantity}</span></div>
            <b>{formatPrice(item.price * item.quantity)}</b>
          </div>)}
          <div className="checkout-total">
            <span>Total productos</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>
          <div className="checkout-shipping">
            <span>Envío</span>
            <strong>{cartTotal >= FREE_SHIPPING_THRESHOLD ? 'Gratis' : 'Por confirmar según ciudad'}</strong>
          </div>
          <small>Disponibilidad, medio de pago y costo final se confirman contigo por WhatsApp antes de pagar. No se realiza ningún cobro en esta página.</small>
        </aside>
      </div>
    </section>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
