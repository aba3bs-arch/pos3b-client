import React, { useState } from 'react';

const POSSistem = () => {
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  const productos = [
    { id: 1, nombre: 'ACEITE VEGETAL 1L', precio: 42, color: '#2c3e50' },
    { id: 2, nombre: 'ARROZ BLANCO 1KG', precio: 22, color: '#2c3e50' },
    { id: 3, nombre: 'HUEVO BLANCO 30PZ', precio: 85, color: '#2c3e50' },
    { id: 4, nombre: 'LECHE ENTERA 1L', precio: 26, color: '#2c3e50' },
    { id: 5, nombre: 'FRIJOL MAYOBA 1KG', precio: 35, color: '#2c3e50' },
    { id: 6, nombre: 'AZUCAR ESTANDAR 1KG', precio: 28, color: '#2c3e50' },
  ];

  const agregarItem = (p) => {
    setCarrito([...carrito, { ...p, uid: Date.now() }]);
    setTotal(t => t + p.precio);
  };

  const procesarPago = async () => {
    if (carrito.length === 0) return;
    setCargando(true);
    try {
      const res = await fetch('https://pos3b.onrender.com/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sucursal_id: sucursal, total, detalles: carrito })
      });
      if (res.ok) {
        alert("TRANSACCIÓN FINALIZADA");
        setCarrito([]); setTotal(0);
      }
    } catch (e) { alert("ERROR DE COMUNICACIÓN"); }
    finally { setCargando(false); }
  };

  return (
    <div style={styles.posContainer}>
      {/* BARRA DE ESTADO SUPERIOR */}
      <div style={styles.statusBar}>
        <div style={styles.brandInfo}>
          <span style={styles.brandMain}>ABARROTES LAS 3B</span>
          <span style={styles.brandSub}>SISTEMA DE GESTIÓN RETAIL</span>
        </div>
        <div style={styles.sysInfo}>
          <span>ESTADO: <b style={{color: '#00ff00'}}>CONECTADO</b></span>
          <div style={styles.sucursalBadge}>SUCURSAL: {sucursal}</div>
        </div>
      </div>

      <div style={styles.layout}>
        {/* PANEL DE PRODUCTOS (IZQUIERDA) */}
        <div style={styles.productPanel}>
          <div style={styles.gridHeader}>SELECCIÓN DE MERCANCÍA</div>
          <div style={styles.productGrid}>
            {productos.map(p => (
              <button key={p.id} onClick={() => agregarItem(p)} style={styles.posButton}>
                <div style={styles.btnPrice}>${p.precio}</div>
                <div style={styles.btnLabel}>{p.nombre}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DE TICKET (DERECHA) */}
        <div style={styles.receiptPanel}>
          <div style={styles.receiptHeader}>REGISTRO DE VENTA</div>
          
          <div style={styles.configArea}>
            <label>CAMBIAR SUCURSAL:</label>
            <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.posSelect}>
              {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={styles.itemsList}>
            {carrito.map(i => (
              <div key={i.uid} style={styles.receiptItem}>
                <span>{i.nombre}</span>
                <span>${i.precio}.00</span>
              </div>
            ))}
          </div>

          <div style={styles.summaryArea}>
            <div style={styles.totalRow}>
              <span>TOTAL MXN</span>
              <span style={styles.grandTotal}>${total}.00</span>
            </div>
            <button 
              onClick={procesarPago} 
              disabled={cargando || carrito.length === 0} 
              style={styles.payButton}
            >
              {cargando ? 'PROCESANDO...' : 'FINALIZAR VENTA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  posContainer: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#e0e0e0', color: '#1a1a1a', fontFamily: 'monospace' },
  statusBar: { backgroundColor: '#1a1a1a', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #d35400' },
  brandMain: { fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' },
  brandSub: { fontSize: '10px', marginLeft: '10px', color: '#95a5a6' },
  sysInfo: { display: 'flex', gap: '20px', alignItems: 'center' },
  sucursalBadge: { backgroundColor: '#d35400', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' },
  layout: { display: 'flex', flex: 1, overflow: 'hidden' },
  productPanel: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' },
  gridHeader: { backgroundColor: '#7f8c8d', color: 'white', padding: '8px', fontWeight: 'bold', marginBottom: '15px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' },
  posButton: { height: '120px', backgroundColor: 'white', border: '2px solid #bdc3c7', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '2px 2px 0 rgba(0,0,0,0.1)' },
  btnPrice: { backgroundColor: '#2c3e50', color: 'white', padding: '5px', fontSize: '18px', fontWeight: 'bold' },
  btnLabel: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' },
  receiptPanel: { width: '400px', backgroundColor: '#ecf0f1', borderLeft: '4px solid #7f8c8d', display: 'flex', flexDirection: 'column' },
  receiptHeader: { backgroundColor: '#2c3e50', color: 'white', padding: '15px', fontWeight: 'bold', textAlign: 'center' },
  configArea: { padding: '15px', borderBottom: '2px solid #bdc3c7', fontSize: '12px' },
  posSelect: { width: '100%', marginTop: '5px', padding: '8px', backgroundColor: 'white', border: '2px solid #2c3e50' },
  itemsList: { flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#fff', margin: '15px', border: '1px solid #bdc3c7' },
  receiptItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #bdc3c7', fontSize: '14px' },
  summaryArea: { padding: '20px', backgroundColor: '#dcdde1' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  grandTotal: { fontSize: '48px', fontWeight: 'bold', color: '#c0392b' },
  payButton: { width: '100%', padding: '20px', backgroundColor: '#27ae60', color: 'white', border: 'none', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 #1e8449' }
};

export default POSSistem;
