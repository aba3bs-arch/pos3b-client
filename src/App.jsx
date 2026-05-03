import React, { useState } from 'react';

const POSProfesional = () => {
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  const catalogo = [
    { id: 1, nombre: 'Aceite 1L', precio: 42, color: '#ff7675' },
    { id: 2, nombre: 'Arroz 1kg', precio: 22, color: '#74b9ff' },
    { id: 3, nombre: 'Huevo 30pz', precio: 85, color: '#ffeaa7' },
    { id: 4, nombre: 'Leche 1L', precio: 26, color: '#55efc4' }
  ];

  const agregarAlCarrito = (p) => {
    setCarrito([...carrito, { ...p, uniqueId: Date.now() }]);
    setTotal(prev => prev + p.precio);
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) return;
    setCargando(true);
    try {
      const res = await fetch('https://pos3b.onrender.com/api/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sucursal_id: sucursal, total: total, detalles: carrito })
      });
      if (res.ok) {
        alert("✅ Venta Guardada");
        setCarrito([]); setTotal(0);
      }
    } catch (e) { alert("❌ Error de conexión"); }
    finally { setCargando(false); }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', backgroundColor: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Abarrotes Las 3B 🏪</h2>
        <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={{ padding: '10px', borderRadius: '5px' }}>
          {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </header>
      <main style={{ display: 'flex', padding: '20px', gap: '20px' }}>
        <div style={{ flex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {catalogo.map(p => (
            <button key={p.id} onClick={() => agregarAlCarrito(p)} style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#1e293b', color: 'white', border: `2px solid ${p.color}`, cursor: 'pointer' }}>
              {p.nombre} <br/> <strong>${p.precio}</strong>
            </button>
          ))}
        </div>
        <aside style={{ flex: 1, backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px' }}>
          <h3>Ticket</h3>
          {carrito.map(item => <div key={item.uniqueId} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}><span>{item.nombre}</span><span>${item.precio}</span></div>)}
          <hr/>
          <h2 style={{ textAlign: 'right' }}>Total: ${total}</h2>
          <button onClick={finalizarVenta} disabled={cargando || carrito.length === 0} style={{ width: '100%', padding: '15px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            {cargando ? 'PROCESANDO...' : 'COBRAR'}
          </button>
        </aside>
      </main>
    </div>
  );
};

export default POSProfesional;
