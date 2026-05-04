import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial Abarrotes Las 3B - Andres
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

const POS_Las3B_Andres = () => {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [pin, setPin] = useState('');
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f1f3f4' };

  useEffect(() => { if (sesionIniciada) cargarInventario(); }, [sesionIniciada]);

  const cargarInventario = async () => {
    const { data } = await supabase.from('productos').select('*');
    if (data) setInventario(data);
  };

  const acceder = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).eq('activo', true).single();
    if (data) { setUsuarioActual(data); setSesionIniciada(true); setPin(''); } 
    else { alert("PIN Incorrecto"); setPin(''); }
  };

  const filtrados = useMemo(() => {
    return inventario.filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.id?.includes(busqueda));
  }, [busqueda, inventario]);

  if (!sesionIniciada) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <img src={logoUrl} alt="Las 3B" style={{ width: '120px' }} />
        <h2 style={{ color: c.azul }}>SISTEMA LAS 3B</h2>
        <input type="password" placeholder="PIN DE ACCESO" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && acceder()} style={{ width: '100%', padding: '15px', textAlign: 'center', fontSize: '24px', borderRadius: '10px', border: '1px solid #ddd', margin: '20px 0' }} />
        <button onClick={acceder} style={{ width: '100%', padding: '15px', backgroundColor: c.azul, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>INICIAR TURNO</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo, fontFamily: 'Segoe UI, sans-serif' }}>
      <aside style={{ width: '260px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: `4px solid ${c.ocre}` }}>
          <img src={logoUrl} style={{ width: '70px' }} />
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{usuarioActual.sucursal_asignada}</div>
        </div>
        <nav style={{ flex: 1, padding: '15px' }}>
          {['Inicio', 'Ventas', 'Productos', 'Usuarios', 'Corte'].map(m => (
            <button key={m} onClick={() => setVistaActual(m)} style={{ display: 'block', width: '100%', padding: '12px', border: 'none', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', backgroundColor: vistaActual === m ? c.azul : 'transparent', color: vistaActual === m ? '#fff' : '#555', marginBottom: '5px', fontWeight: 'bold' }}>{m}</button>
          ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', backgroundColor: c.azul, color: '#fff', borderRadius: '50%', textAlign: 'center', lineHeight: '35px', fontWeight: 'bold' }}>{usuarioActual.nombre[0]}</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{usuarioActual.nombre}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>{usuarioActual.rol}</div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '65px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', borderBottom: '1px solid #ddd' }}>
          <h2 style={{ color: c.azul, margin: 0 }}>{vistaActual}</h2>
          <div style={{ color: '#1e8e3e', fontWeight: 'bold', fontSize: '12px' }}>● TERMINAL OPERATIVA</div>
        </header>
        <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
          {vistaActual === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="Escanee o busque..." style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} autoFocus />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginTop: '20px' }}>
                  {filtrados.map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, { ...p, cantidad: 1 }])} style={{ background: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' }}>
                      <b style={{ color: c.rojo }}>${p.precio}</b>
                      <p style={{ fontSize: '12px', margin: '5px 0' }}>{p.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{ width: '320px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: 0 }}>TICKET</h3>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {carrito.map((it, x) => <div key={x} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}><span>{it.nombre}</span><b>${it.precio}</b></div>)}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', textAlign: 'right', borderTop: `2px solid ${c.azul}` }}>${carrito.reduce((a, b) => a + b.precio, 0)}.00</div>
                <button onClick={() => { alert("Venta Realizada"); setCarrito([]); }} style={{ width: '100%', padding: '15px', background: c.azul, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>COBRAR</button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default POS_Las3B_Andres;
