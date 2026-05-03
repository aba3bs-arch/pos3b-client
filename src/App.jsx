import React, { useState, useEffect } from 'react';

const POSProfesional = () => {
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // Catálogo extendido y categorizado
  const catalogo = [
    { id: 1, nombre: 'Aceite 1L', precio: 42, cat: 'Abarrotes', color: '#ff7675' },
    { id: 2, nombre: 'Arroz 1kg', precio: 22, cat: 'Abarrotes', color: '#74b9ff' },
    { id: 3, nombre: 'Huevo 30pz', precio: 85, cat: 'Lácteos', color: '#ffeaa7' },
    { id: 4, nombre: 'Leche 1L', precio: 26, cat: 'Lácteos', color: '#55efc4' },
    { id: 5, nombre: 'Frijol 1kg', precio: 35, cat: 'Abarrotes', color: '#fab1a0' },
    { id: 6, nombre: 'Azúcar 1kg', precio: 28, cat: 'Abarrotes', color: '#a29bfe' },
    { id: 7, nombre: 'Jabón Barra', precio: 18, cat: 'Limpieza', color: '#81ecec' },
    { id: 8, nombre: 'Papel Higiénico', precio: 45, cat: 'Limpieza', color: '#fd79a8' },
  ];

  const productosFiltrados = catalogo.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    setTotal(prev => prev + producto.precio);
  };

  const eliminarDelCarrito = (id, precio, cant) => {
    setCarrito(carrito.filter(item => item.id !== id));
    setTotal(prev => prev - (precio * cant));
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) return;
    setCargando(true);
    
    try {
      const respuesta = await fetch('https://pos3b.onrender.com/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sucursal_id: sucursal,
          total: total,
          detalles: carrito,
          fecha: new Date().toISOString()
        })
      });
      
      if (respuesta.ok) {
        alert(`⭐ Venta Exitosa en sucursal ${sucursal}`);
        setCarrito([]);
        setTotal(0);
      } else {
        alert("⚠️ Error en el servidor de Render");
      }
    } catch (e) {
      alert("📡 Error de conexión. Revisa el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.app}>
      {/* HEADER SUPERIOR */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.logoIcon}>🏪</span>
          <div>
            <h1 style={styles.title}>Abarrotes Las 3B</h1>
            <span style={styles.status}>🟢 Sistema en Línea</span>
          </div>
        </div>
        
        <div style={styles.headerActions}>
          <div style={styles.searchBox}>
            🔍 <input 
              type="text" 
              placeholder="Buscar producto..." 
              style={styles.searchInput}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select 
            value={sucursal} 
            onChange={(e) => setSucursal(e.target.value)} 
            style={styles.sucursalSelect}
          >
            {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      <main style={styles.main}>
        {/* CUADRÍCULA DE PRODUCTOS */}
        <section style={styles.catalogSection}>
          <div style={styles.grid}>
            {productosFiltrados.map(p => (
              <div key={p.id} onClick={() => agregarAlCarrito(p)} style={styles.card}>
                <div style={{ ...styles.cardTag, backgroundColor: p.color }}>{p.cat}</div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardName}>{p.nombre}</h3>
                  <span style={styles.cardPrice}>${p.precio}.00</span>
                </div>
                <div style={styles.cardAdd}>+</div>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL LATERAL DE TICKET */}
        <aside style={styles.sidebar}>
          <div style={styles.ticketHeader}>
            <h3>Detalle de Venta</h3>
            <span style={styles.itemCount}>{carrito.length} productos</span>
          </div>
          
          <div style={styles.itemList}>
            {carrito.map(item => (
              <div key={item.id} style={styles.item}>
                <div>
                  <div style={styles.itemName}>{item.nombre}</div>
                  <div style={styles.itemSub}>${item.precio} x {item.cantidad}</div>
                </div>
                <div style={styles.itemRight}>
                  <span>${item.precio * item.cantidad}</span>
                  <button 
                    onClick={() => eliminarDelCarrito(item.id, item.precio, item.cantidad)}
                    style={styles.btnDelete}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Total a Pagar</span>
              <span style={styles.totalAmount}>${total}.00</span>
            </div>
            <button 
              onClick={finalizarVenta} 
              disabled={cargando || carrito.length === 0} 
              style={{ ...styles.btnPay, opacity: (cargando || carrito.length === 0) ? 0.6 : 1 }}
            >
              {cargando ? 'REGISTRANDO...' : 'COBRAR AHORA (F10)'}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

// ESTILOS DE ALTO IMPACTO
const styles = {
  app: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { fontSize: '2rem' },
  title: { margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#f1f5f9' },
  status: { fontSize: '0.75rem', color: '#4ade80' },
  headerActions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  searchBox: { backgroundColor: '#334155', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', gap: '10px' },
  searchInput: { background: 'none', border: 'none', color: 'white', outline: 'none', width: '200px' },
  sucursalSelect: { padding: '0.6rem', borderRadius: '8px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  catalogSection: { flex: 1, padding: '2rem', overflowY: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' },
  card: { backgroundColor: '#1e293b', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'transform 0.1s', border: '1px solid #334155' },
  cardTag: { fontSize: '0.7rem', padding: '4px 8px', color: '#000', fontWeight: 'bold' },
  cardBody: { padding: '1.2rem' },
  cardName: { margin: '0 0 0.5rem 0', fontSize: '1rem' },
  cardPrice: { fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' },
  cardAdd: { position: 'absolute', bottom: '10px', right: '10px', backgroundColor: '#3b82f6', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  sidebar: { width: '400px', backgroundColor: '#1e293b', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column' },
  ticketHeader: { padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemCount: { fontSize: '0.8rem', color: '#94a3b8' },
  itemList: { flex: 1, overflowY: 'auto', padding: '1rem' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#334155', borderRadius: '8px', marginBottom: '0.75rem' },
  itemName: { fontWeight: 'bold', fontSize: '0.9rem' },
  itemSub: { fontSize: '0.8rem', color: '#cbd5e1' },
  itemRight: { textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' },
  btnDelete: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' },
  footer: { padding: '1.5rem', backgroundColor: '#0f172a', borderTop: '1px solid #334155' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  totalAmount: { fontSize: '2.5rem', fontWeight: 'bold', color: '#4ade80' },
  btnPay: { width: '100%', padding: '1.2rem', borderRadius: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.3)' }
};

export default POSProfesional;
