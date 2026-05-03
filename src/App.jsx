import React, { useState, useMemo } from 'react';

const POS_Elite = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('FAVORITOS');
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [sucursal, setSucursal] = useState('3B2');

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];
  const categorias = ['FAVORITOS', 'ABARROTES', 'BEBIDAS', 'BOTANAS', 'CIGARROS'];

  // Base de datos de productos con imágenes y stock
  const productos = [
    { id: 1, nombre: 'Gomitas', precio: 20, cat: 'FAVORITOS', img: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?w=200', stock: 12 },
    { id: 2, nombre: 'Mazapan Original', precio: 12, cat: 'FAVORITOS', img: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=200', stock: 504 },
    { id: 3, nombre: 'Salsa Valentina', precio: 2, cat: 'FAVORITOS', img: 'https://images.unsplash.com/photo-1626078297492-b7ca55294561?w=200', stock: 106 },
    { id: 4, nombre: 'Agua Grande 1L', precio: 16, cat: 'BEBIDAS', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200', stock: 20 },
    { id: 5, nombre: 'Marlboro Rojo', precio: 80, cat: 'CIGARROS', img: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=200', stock: 15 },
    { id: 6, nombre: 'Duritos Navarro', precio: 17, cat: 'BOTANAS', img: 'https://images.unsplash.com/photo-1621447509323-5705b2df6f9b?w=200', stock: 60 },
  ];

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => 
      (categoriaActiva === 'FAVORITOS' || p.cat === categoriaActiva) &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [categoriaActiva, busqueda]);

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const agregarAlCarrito = (p) => {
    const existe = carrito.find(i => i.id === p.id);
    if (existe) {
      setCarrito(carrito.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setCarrito([...carrito, { ...p, cantidad: 1 }]);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SUPERIOR ESTILO SICAR */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBadge}>AM</div>
          <h2 style={styles.headerTitle}>Ventas - Abarrotes Las 3B</h2>
        </div>
        <div style={styles.headerRight}>
          <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.sucursalSelect}>
            {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={styles.userBadge}>VENTA: DEFAULT</div>
        </div>
      </header>

      {/* BARRA DE CATEGORÍAS */}
      <nav style={styles.navBar}>
        {categorias.map(cat => (
          <button 
            key={cat} 
            onClick={() => setCategoriaActiva(cat)}
            style={{...styles.navBtn, borderBottom: categoriaActiva === cat ? '3px solid #1a73e8' : 'none', color: categoriaActiva === cat ? '#1a73e8' : '#5f6368'}}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div style={styles.mainContent}>
        {/* LADO IZQUIERDO: PRODUCTOS */}
        <section style={styles.productArea}>
          <div style={styles.searchBar}>
            <input 
              type="text" 
              placeholder="🔍 Buscar producto..." 
              style={styles.searchInput}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div style={styles.grid}>
            {productosFiltrados.map(p => (
              <div key={p.id} onClick={() => agregarAlCarrito(p)} style={styles.card}>
                <img src={p.img} alt={p.nombre} style={styles.cardImg} />
                <div style={styles.cardInfo}>
                  <span style={styles.cardPrice}>${p.precio}.00</span>
                  <span style={styles.cardName}>{p.nombre}</span>
                  <span style={styles.cardStock}>{p.stock} piezas</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LADO DERECHO: CARRITO */}
        <aside style={styles.cartArea}>
          <div style={styles.cartHeader}>🛒 Carrito de Ventas</div>
          <div style={styles.cartItems}>
            {carrito.length === 0 ? (
              <div style={styles.emptyCart}>Agregar productos a tu carrito</div>
            ) : (
              carrito.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <strong>${item.precio * item.cantidad}.00</strong>
                </div>
              ))
            )}
          </div>
          <div style={styles.cartFooter}>
            <div style={styles.totalBox}>
              <span>TOTAL MXN</span>
              <span style={styles.totalText}>${total}.00</span>
            </div>
            <button style={styles.payBtn} disabled={carrito.length === 0}>
              FINALIZAR VENTA [F10]
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f3f4', fontFamily: 'Segoe UI, Roboto, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', alignItems: 'center' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  logoBadge: { backgroundColor: '#fff', color: '#1a73e8', padding: '5px 10px', borderRadius: '50%', fontWeight: 'bold' },
  headerTitle: { fontSize: '18px', margin: 0 },
  headerRight: { display: 'flex', gap: '15px', alignItems: 'center' },
  sucursalSelect: { padding: '5px', borderRadius: '4px', border: 'none' },
  userBadge: { backgroundColor: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' },
  navBar: { display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid #dadce0', padding: '0 10px' },
  navBtn: { padding: '15px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  mainContent: { display: 'flex', flex: 1, overflow: 'hidden' },
  productArea: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  searchBar: { marginBottom: '20px' },
  searchInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' },
  card: { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dadce0', cursor: 'pointer', overflow: 'hidden', textAlign: 'center', transition: 'box-shadow 0.2s' },
  cardImg: { width: '100%', height: '120px', objectFit: 'cover' },
  cardInfo: { padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' },
  cardPrice: { fontWeight: 'bold', fontSize: '18px', color: '#202124' },
  cardName: { fontSize: '13px', color: '#5f6368' },
  cardStock: { fontSize: '11px', color: '#1a73e8', fontWeight: 'bold' },
  cartArea: { width: '350px', backgroundColor: '#fff', borderLeft: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  cartHeader: { padding: '20px', borderBottom: '1px solid #dadce0', fontWeight: 'bold', color: '#1a73e8' },
  cartItems: { flex: 1, padding: '15px', overflowY: 'auto' },
  cartItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #f1f3f4', paddingBottom: '5px' },
  emptyCart: { textAlign: 'center', color: '#9aa0a6', marginTop: '50px' },
  cartFooter: { padding: '20px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dadce0' },
  totalBox: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  totalText: { fontSize: '28px', fontWeight: 'bold', color: '#1a73e8' },
  payBtn: { width: '100%', padding: '15px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }
};

export default POS_Elite;
