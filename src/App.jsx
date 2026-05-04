import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Andres Las 3B
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  // --- ESTADOS DE SESIÓN Y NAVEGACIÓN ---
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Inicio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sucursal, setSucursal] = useState('3B2'); // Basado en Nogales, Sonora

  // --- ESTADOS DE DATOS ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pagoCon, setPagoCon] = useState('');
  const [metodo, setMetodo] = useState('EFECTIVO');
  const [mostrarCobro, setMostrarCobro] = useState(false);
  
  // --- ESTADO PARA NUEVO PRODUCTO ---
  const [nuevoProd, setNuevoProd] = useState({ 
    id: '', nombre: '', precio: 0, costo: 0, stock: 0, cat: 'GENERAL' 
  });

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', verde: '#1e8e3e', rojo: '#ff0000', fondo: '#f8f9fa' };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (sesion) cargarInventario();
  }, [sesion]);

  const cargarInventario = async () => {
    const { data } = await supabase.from('productos').select('*');
    setInventario(data || []);
  };

  // --- LÓGICA DE LOGIN ---
  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUser(data);
      setSesion(true);
      setPin('');
    } else {
      alert("PIN Incorrecto");
      setPin('');
    }
  };

  // --- LÓGICA DE VENTAS ---
  const totalVenta = useMemo(() => carrito.reduce((acc, p) => acc + (p.precio || 0), 0), [carrito]);
  const cambio = useMemo(() => (parseFloat(pagoCon) || 0) - totalVenta, [pagoCon, totalVenta]);

  const finalizarVenta = async () => {
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user.nombre,
      sucursal_id: sucursal,
      total: totalVenta,
      metodo_pago: metodo,
      articulos: carrito
    }]);

    if (!error) {
      alert("Venta Exitosa");
      setCarrito([]);
      setMostrarCobro(false);
      setPagoCon('');
      cargarInventario();
    }
  };

  // --- INTERFAZ DE LOGIN ---
  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' }}>
        <img src={logo} style={{ width: '130px' }} alt="3B" />
        <h2 style={{ color: c.azul }}>LAS 3B - NOGALES</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={{ width: '100%', padding: '15px', fontSize: '28px', textAlign: 'center', borderRadius: '12px', border: '1px solid #ddd', margin: '20px 0' }} />
        <button onClick={manejarLogin} style={{ width: '100%', padding: '15px', background: c.azul, color: '#fff', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside style={{ width: '250px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', textAlign: 'center', borderBottom: '5px solid #c8b444' }}>
            <b style={{color: c.azul}}>ABARROTES LAS 3B</b>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>{sucursal}</div>
          </div>
          <nav style={{ flex: 1, padding: '10px' }}>
            {['Inicio', 'Ventas', 'Productos', 'Compras', 'Reportes', 'Usuarios'].map(m => (
              <button key={m} onClick={() => setVista(m)} style={{ display: 'block', width: '100%', padding: '12px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', marginBottom: '2px', backgroundColor: vista === m ? '#e8f0fe' : 'transparent', color: vista === m ? c.azul : '#555' }}>
                {m}
              </button>
            ))}
          </nav>
          <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
            <b>{user.nombre}</b><br/><span style={{fontSize: '10px'}}>v2.6.0</span>
          </div>
        </aside>
      )}

      {/* CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '65px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ fontSize: '22px', border: 'none', background: 'none', cursor: 'pointer' }}>☰</button>
          <h2 style={{ marginLeft: '15px', color: c.azul }}>{vista}</h2>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {/* MÓDULO PRODUCTOS (ALTA DE MARINELA / OTROS) */}
          {vista === 'Productos' && (
            <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #ddd', maxWidth: '700px' }}>
              <h3>Registrar Producto Nuevo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                <input placeholder="Código de Barras" value={nuevoProd.id} onChange={e => setNuevoProd({...nuevoProd, id: e.target.value})} style={s_inp} />
                <input placeholder="Nombre (Ej: Gansito)" value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} style={s_inp} />
                <input type="number" placeholder="Precio Venta" value={nuevoProd.precio} onChange={e => setNuevoProd({...nuevoProd, precio: parseFloat(e.target.value)})} style={s_inp} />
                <input type="number" placeholder="Stock Inicial" value={nuevoProd.stock} onChange={e => setNuevoProd({...nuevoProd, stock: parseInt(e.target.value)})} style={s_inp} />
                <select value={nuevoProd.cat} onChange={e => setNuevoProd({...nuevoProd, cat: e.target.value})} style={{ gridColumn: 'span 2', ...s_inp }}>
                  <option value="GENERAL">Inventario General</option>
                  <option value="FAVORITOS">⭐ Aparecer en Ventas (Favorito)</option>
                </select>
              </div>
              <button onClick={async () => {
                const { error } = await supabase.from('productos').upsert([nuevoProd]);
                if (!error) {
                  alert("Guardado con éxito");
                  setNuevoProd({ id: '', nombre: '', precio: 0, costo: 0, stock: 0, cat: 'GENERAL' });
                  cargarInventario();
                }
              }} style={{ width: '100%', padding: '15px', background: c.verde, color: '#fff', border: 'none', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                GUARDAR EN INVENTARIO
              </button>
            </div>
          )}

          {/* MÓDULO VENTAS */}
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={{ background: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', cursor: 'pointer', textAlign: 'center' }}>
                      <b style={{ color: c.rojo }}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{ width: '300px', background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #ddd' }}>
                <h3>TICKET</h3>
                <div style={{ flex: 1, overflowY: 'auto', margin: '10px 0' }}>
                  {carrito.map((it, i) => <div key={i} style={{fontSize: '12px', display: 'flex', justifyContent: 'space-between'}}><span>{it.nombre}</span><b>${it.precio}</b></div>)}
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', color: c.azul, borderTop: '2px solid #eee', paddingTop: '10px' }}>TOTAL: ${totalVenta}</div>
                <button onClick={() => setMostrarCobro(true)} style={{ width: '100%', padding: '15px', background: c.verde, color: '#fff', border: 'none', borderRadius: '10px', marginTop: '10px', fontWeight: 'bold', cursor: 'pointer' }}>COBRAR</button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const s_inp = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' };

export default App;
