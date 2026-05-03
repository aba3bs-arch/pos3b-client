import React, { useState } from 'react';

// --- DISEÑO PROFESIONAL DE LA INTERFAZ ---
const POSPro = () => {
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  // Tus sucursales reales de Abarrotes Las 3B
  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // Catálogo inicial (puedes ampliarlo después desde la base de datos)
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
    
    const venta = {
      sucursal_id: sucursal,
      total: total,
      detalles: carrito
    };

    try {
      // CONEXIÓN DIRECTA A TU RENDER LIVE
      const res = await fetch('https://pos3b.onrender.com/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta)
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Sucursal:</span>
          <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.select}>
            {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.grid}>
          {catalogo.map(p => (
            <button key={p.id} onClick={() => agregarItem(p)} style={styles.productCard}>
              <div style={{ ...styles.colorBar, backgroundColor: p.color }}></div>
              <div style={{ padding: '15px' }}>
                <div style={styles.prodName}>{p.nombre}</div>
                <div style={styles.prodPrice}>${p.precio}.00</div>
              </div>
            </button>
          ))}
        </div>

        <div style={styles.sidebar}>
          <h3 style={{ borderBottom: '2px solid #444', paddingBottom: '10px' }}>Ticket de Venta</h3>
          <div style={styles.ticketList}>
            {carrito.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>Carrito vacío</p>}
            {carrito.map(item => (
              <div key={item.uniqueId} style={styles.ticketItem}>
                <span>{item.nombre}</span>
                <strong>${item.precio}</strong>
              </div>
            ))}
          </div>
          <div style={styles.totalBox}>
            <span style={{ fontSize: '14px', color: '#aaa' }}>TOTAL</span>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>${total}</div>
          </div>
          <button 
            onClick={finalizarCobro} 
            disabled={cargando || carrito.length === 0} 
            style={{ ...styles.btnCobrar, opacity: (cargando || carrito.length === 0) ? 0.5 : 1 }}
          >
            {cargando ? 'PROCESANDO...' : 'FINALIZAR VENTA'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ESTILOS "DE CACHÉ" ---
const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#121212', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: '#1e1e1e', borderBottom: '1px solid #333' },
  select: { padding: '8px 12px', borderRadius: '6px', backgroundColor: '#333', color: 'white', border: '1px solid #444', cursor: 'pointer' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  grid: { flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', padding: '25px', overflowY: 'auto' },
  productCard: { backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', color: 'white', transition: 'all 0.2s' },
  colorBar: { height: '6px', width: '100%', borderRadius: '12px 12px 0 0' },
  prodName: { fontSize: '15px', marginBottom: '5px' },
  prodPrice: { fontSize: '22px', fontWeight: 'bold', color: '#4ade80' },
  sidebar: { width: '380px', backgroundColor: '#181818', padding: '20px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #333' },
  ticketList: { flex: 1, overflowY: 'auto', marginBottom: '20px' },
  ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222' },
  totalBox: { textAlign: 'right', padding: '20px', borderTop: '2px solid #333' },
  btnCobrar: { backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '18px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }
};

// --- COMPONENTE PRINCIPAL ---
function App() {
  return (
    <div className="App">
      <POSPro />
    </div>
  );
}

export default App;
