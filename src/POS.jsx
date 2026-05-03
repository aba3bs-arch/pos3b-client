import React, { useState, useEffect } from 'react';

const POSPro = () => {
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // Lista de tus sucursales reales
  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // Productos con estética profesional
  const catalogo = [
    { id: 1, nombre: 'Aceite Vegetal 1L', precio: 42, color: '#e74c3c' },
    { id: 2, nombre: 'Arroz Extra 1kg', precio: 22, color: '#f1c40f' },
    { id: 3, nombre: 'Huevo Blanco 30pz', precio: 85, color: '#ecf0f1' },
    { id: 4, nombre: 'Leche Entera 1L', precio: 26, color: '#3498db' },
  ];

  const agregarItem = (p) => {
    setCarrito([...carrito, { ...p, uniqueId: Date.now() }]);
    setTotal(prev => prev + p.precio);
  };

  const finalizarCobro = async () => {
    if (carrito.length === 0) return;
    
    const venta = {
      sucursal_id: sucursal,
      total: total,
      detalles: carrito
    };

    try {
      // Aquí conectamos con tu servidor de Render
      const res = await fetch('https://pos3b.onrender.com/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta)
      });
      
      if (res.ok) {
        alert(`Venta exitosa en ${sucursal}`);
        setCarrito([]);
        setTotal(0);
      }
    } catch (e) {
      alert("Error de conexión con la nube");
    }
  };

  return (
    <div style={styles.container}>
      {/* BARRA SUPERIOR PROFESIONAL */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Abarrotes Las 3B 🚀</h2>
        <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.select}>
          {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={styles.main}>
        {/* GRILLA DE PRODUCTOS */}
        <div style={styles.grid}>
          {catalogo.map(p => (
            <button key={p.id} onClick={() => agregarItem(p)} style={styles.productCard}>
              <div style={{ ...styles.colorBar, backgroundColor: p.color }}></div>
              <span style={styles.prodName}>{p.nombre}</span>
              <span style={styles.prodPrice}>${p.precio}.00</span>
            </button>
          ))}
        </div>

        {/* TICKET DE VENTA LATERAL */}
        <div style={styles.sidebar}>
          <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Detalle de Venta</h3>
          <div style={styles.ticketList}>
            {carrito.map(item => (
              <div key={item.uniqueId} style={styles.ticketItem}>
                <span>{item.nombre}</span>
                <strong>${item.precio}</strong>
              </div>
            ))}
          </div>
          <div style={styles.totalBox}>
            <span>TOTAL A COBRAR</span>
            <h1 style={{ margin: 0, fontSize: '48px' }}>${total}</h1>
          </div>
          <button onClick={finalizarCobro} style={styles.btnCobrar}>FINALIZAR VENTA</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'Segoe UI, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#2d2d2d', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  select: { padding: '10px', borderRadius: '8px', backgroundColor: '#444', color: 'white', border: 'none', fontSize: '16px' },
  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  grid: { flex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', padding: '20px', overflowY: 'auto' },
  productCard: { backgroundColor: '#333', border: 'none', borderRadius: '12px', padding: '0', cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.1s', color: 'white' },
  colorBar: { height: '8px', width: '100%' },
  prodName: { padding: '15px 10px 5px', fontSize: '16px', fontWeight: 'bold' },
  prodPrice: { padding: '0 10px 15px', fontSize: '20px', color: '#2ecc71' },
  sidebar: { width: '350px', backgroundColor: '#262626', padding: '20px', display: 'flex', flexDirection: 'column' },
  ticketList: { flex: 1, overflowY: 'auto', marginBottom: '20px' },
  ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #444' },
  totalBox: { textAlign: 'center', backgroundColor: '#333', padding: '20px', borderRadius: '12px', marginBottom: '15px' },
  btnCobrar: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '20px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }
};

export default POSPro;

