import React, { useState } from 'react';

const POSPro = () => {
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  const catalogo = [
    { id: 1, nombre: 'Aceite 1L', precio: 42, color: '#e74c3c' },
    { id: 2, nombre: 'Arroz 1kg', precio: 22, color: '#f1c40f' },
    { id: 3, nombre: 'Huevo 30pz', precio: 85, color: '#ecf0f1' },
    { id: 4, nombre: 'Leche 1L', precio: 26, color: '#3498db' },
  ];

  const agregarItem = (p) => {
    setCarrito([...carrito, { ...p, uniqueId: Date.now() }]);
    setTotal(prev => prev + p.precio);
  };

  const finalizarCobro = async () => {
    if (carrito.length === 0) return;
    setCargando(true);
    
    try {
      const res = await fetch('https://pos3b.onrender.com/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sucursal_id: sucursal, total: total, detalles: carrito })
      });
      
      if (res.ok) {
        alert(`✅ Venta registrada en ${sucursal}`);
        setCarrito([]);
        setTotal(0);
      } else {
        alert("❌ Error al guardar la venta");
      }
    } catch (e) {
      alert("❌ Sin conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Abarrotes Las 3B 🚀</h2>
        <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.select}>
          {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={styles.main}>
        <div style={styles.grid}>
          {catalogo.map(p => (
            <button key={p.id} onClick={() => agregarItem(p)} style={styles.productCard}>
              <div style={{ ...styles.colorBar, backgroundColor: p.color }}></div>
              <div style={{ padding: '15px' }}>
                <div>{p.nombre}</div>
                <div style={styles.prodPrice}>${p.precio}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={styles.sidebar}>
          <h3>Ticket</h3>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {carrito.map(item => (
              <div key={item.uniqueId} style={styles.ticketItem}>
                <span>{item.nombre}</span>
                <strong>${item.precio}</strong>
              </div>
            ))}
          </div>
          <div style={styles.totalBox}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>${total}</div>
          </div>
          <button onClick={finalizarCobro} disabled={cargando} style={styles.btnCobrar}>
            {cargando ? 'PROCESANDO...' : 'FINALIZAR VENTA'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: 'white', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#1e1e1e' },
  select: { padding: '8px', borderRadius: '6px', backgroundColor: '#333', color: 'white' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  grid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', padding: '20px', overflowY: 'auto' },
  productCard: { backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer', color: 'white' },
  colorBar: { height: '4px', width: '100%', borderRadius: '8px 8px 0 0' },
  prodPrice: { fontSize: '20px', fontWeight: 'bold', color: '#4ade80' },
  sidebar: { width: '300px', backgroundColor: '#181818', padding: '20px', display: 'flex', flexDirection: 'column' },
  ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222' },
  totalBox: { padding: '20px 0', borderTop: '2px solid #333', textAlign: 'right' },
  btnCobrar: { backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default function App() { return <POSPro />; }
