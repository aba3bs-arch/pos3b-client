import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Conexión - Abarrotes Las 3B
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  // --- ESTADOS DE SISTEMA ---
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- ESTADOS DE DATOS ---
  const [inventario, setInventario] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pagoCon, setPagoCon] = useState('');
  const [metodo, setMetodo] = useState('EFECTIVO');
  const [mostrarCobro, setMostrarCobro] = useState(false);

  // --- ESTADO PARA NUEVOS PRODUCTOS (MARINELA/OTROS) ---
  const [nuevoProd, setNuevoProd] = useState({ id: '', nombre: '', precio: 0, costo: 0, stock: 0, cat: 'GENERAL' });

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', verde: '#1e8e3e', rojo: '#ff0000', gris: '#f4f7f6' };

  useEffect(() => {
    if (sesion) {
      cargarInventario();
      cargarProveedores();
    }
  }, [sesion]);

  const cargarInventario = async () => {
    const { data } = await supabase.from('productos').select('*').order('nombre');
    setInventario(data || []);
  };

  const cargarProveedores = async () => {
    const { data } = await supabase.from('proveedores').select('*');
    setProveedores(data || []);
  };

  // --- LÓGICA DE SEGURIDAD ---
  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUser(data);
      setSesion(true);
      setPin('');
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal, evento: 'ENTRADA' }]);
    } else { alert("Acceso Denegado"); setPin(''); }
  };

  // --- LÓGICA DE VENTAS ---
  const totalVenta = useMemo(() => carrito.reduce((acc, p) => acc + (p.precio || 0), 0), [carrito]);
  const cambio = useMemo(() => (parseFloat(pagoCon) || 0) - totalVenta, [pagoCon, totalVenta]);

  const finalizarVenta = async () => {
    if (metodo === 'EFECTIVO' && cambio < 0) return alert("Monto insuficiente");
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user.nombre, sucursal_id: sucursal, total: totalVenta, metodo_pago: metodo, articulos: carrito
    }]);
    if (!error) {
      alert("Venta registrada con éxito");
      setCarrito([]); setMostrarCobro(false); setPagoCon(''); cargarInventario();
    }
  };

  // --- PANTALLA DE LOGIN ---
  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={s.loginCard}>
        <img src={logo} style={{ width: '140px' }} alt="Las 3B" />
        <h2 style={{ color: c.azul, margin: '20px 0' }}>SISTEMA DE CONTROL 3B</h2>
        <input type="password" placeholder="PIN DE ACCESO" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} autoFocus />
        <button onClick={manejarLogin} style={s.btnLogin}>ACCEDER AL PANEL</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.gris }}>
      {/* NAVEGACIÓN LATERAL */}
      {sidebarOpen && (
        <aside style={s.sidebar}>
          <div style={s.sideHeader}>
            <b style={{color: c.azul}}>ABARROTES LAS 3B</b>
            <div style={s.badge}>{sucursal}</div>
          </div>
          <nav style={{ flex: 1, padding: '10px' }}>
            {['Inicio', 'Ventas', 'Productos', 'Compras', 'Checador', 'Proveedores', 'Reportes', 'Usuarios'].map(m => (
              <button key={m} onClick={() => setVista(m)} style={{...s.navBtn, backgroundColor: vista === m ? '#e8f0fe' : 'transparent', color: vista === m ? c.azul : '#555'}}>
                {m}
              </button>
            ))}
          </nav>
          <div style={s.sideFooter}><b>{user.nombre}</b><br/><small>Administrador 3B</small></div>
        </aside>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.btnGhost}>☰</button>
          <h2 style={{ marginLeft: '15px', color: c.azul, flex: 1 }}>{vista}</h2>
          <button onClick={() => setSesion(false)} style={s.btnExit}>CERRAR TURNO</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {/* MÓDULO VENTAS */}
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="F1 - Buscar o escanear..." style={s.inputBig} />
                <div style={s.gridFavs}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={s.favCard}>
                      <b style={{color: c.rojo}}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={s.ticketPanel}>
                <h3 style={{marginTop: 0}}>DETALLE TICKET</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>
                  {carrito.map((it, i) => <div key={i} style={s.ticketRow}><span>{it.nombre}</span><b>${it.precio}</b></div>)}
                </div>
                <div style={s.totalBox}>TOTAL: ${totalVenta}.00</div>
                {mostrarCobro ? (
                  <div style={s.payPanel}>
                    <select value={metodo} onChange={e => setMetodo(e.target.value)} style={s.input}>
                      <option value="EFECTIVO">EFECTIVO</option>
                      <option value="TARJETA">TARJETA</option>
                    </select>
                    <input type="number" placeholder="¿Con cuánto paga?" value={pagoCon} onChange={e => setPagoCon(e.target.value)} style={s.inputBig} autoFocus />
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: c.verde, margin: '10px 0'}}>CAMBIO: ${cambio >= 0 ? cambio.toFixed(2) : '0.00'}</div>
                    <button onClick={finalizarVenta} style={s.btnSuccess}>FINALIZAR VENTA</button>
                    <button onClick={() => setMostrarCobro(false)} style={s.btnCancel}>VOLVER</button>
                  </div>
                ) : (
                  <button onClick={() => setMostrarCobro(true)} style={s.btnAction}>COBRAR [F10]</button>
                )}
              </aside>
            </div>
          )}

          {/* MÓDULO ALTA PRODUCTOS (MARINELA) */}
          {vista === 'Productos' && (
            <div style={s.card}>
              <h3>Gestión de Catálogo e Inventario</h3>
              <div style={s.formGrid}>
                <input placeholder="Código de Barras" value={nuevoProd.id} onChange={e => setNuevoProd({...nuevoProd, id: e.target.value})} style={s.input} />
                <input placeholder="Nombre (Ej: Gansito Marinela)" value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} style={s.input} />
                <input type="number" placeholder="Precio Venta" value={nuevoProd.precio} onChange={e => setNuevoProd({...nuevoProd, precio: parseFloat(e.target.value)})} style={s.input} />
                <input type="number" placeholder="Costo Compra" value={nuevoProd.costo} onChange={e => setNuevoProd({...nuevoProd, costo: parseFloat(e.target.value)})} style={s.input} />
                <input type="number" placeholder="Stock Inicial" value={nuevoProd.stock} onChange={e => setNuevoProd({...nuevoProd, stock: parseInt(e.target.value)})} style={s.input} />
                <select value={nuevoProd.cat} onChange={e => setNuevoProd({...nuevoProd, cat: e.target.value})} style={s.input}>
                  <option value="GENERAL">Inventario General</option>
                  <option value="FAVORITOS">⭐ Favorito (Pantalla Ventas)</option>
                </select>
              </div>
              <button onClick={async () => {
                const { error } = await supabase.from('productos').upsert([nuevoProd]);
                if (!error) { alert("Sincronizado con Supabase"); setNuevoProd({ id: '', nombre: '', precio: 0, costo: 0, stock: 0, cat: 'GENERAL' }); cargarInventario(); }
              }} style={s.btnSuccess}>GUARDAR EN BASE DE DATOS</button>
            </div>
          )}

          {/* MÓDULO CHECADOR */}
          {vista === 'Checador' && (
            <div style={s.card}>
              <h3>Control de Asistencia Nogales</h3>
              <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                <button onClick={async () => {
                  await supabase.from('asistencia').insert([{ usuario_id: user.id, nombre: user.nombre, sucursal, tipo: 'ENTRADA' }]);
                  alert("Entrada registrada");
                }} style={s.btnPrimary}>REGISTRAR ENTRADA</button>
                <button onClick={async () => {
                  await supabase.from('asistencia').insert([{ usuario_id: user.id, nombre: user.nombre, sucursal, tipo: 'SALIDA' }]);
                  alert("Salida registrada");
                }} style={s.btnExit}>REGISTRAR SALIDA</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// --- SISTEMA DE ESTILOS ---
const s = {
  loginCard: { background: '#fff', padding: '50px', borderRadius: '35px', textAlign: 'center', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
  pinInput: { width: '100%', padding: '20px', fontSize: '35px', textAlign: 'center', letterSpacing: '12px', borderRadius: '15px', border: '2px solid #ddd', margin: '20px 0' },
  btnLogin: { width: '100%', padding: '20px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' },
  sidebar: { width: '260px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '25px', textAlign: 'center', borderBottom: '4px solid #c8b444' },
  badge: { background: '#f0f0f0', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' },
  navBtn: { display: 'block', width: '100%', padding: '14px 20px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '12px', marginBottom: '4px' },
  sideFooter: { padding: '20px', borderTop: '1px solid #eee' },
  mainHeader: { height: '75px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 25px' },
  btnGhost: { fontSize: '25px', border: 'none', background: 'none', cursor: 'pointer' },
  btnExit: { background: '#ff0000', color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  inputBig: { width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '20px' },
  gridFavs: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '20px' },
  favCard: { background: '#fff', padding: '18px', borderRadius: '18px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  ticketPanel: { width: '350px', background: '#fff', borderLeft: '1px solid #ddd', padding: '30px', display: 'flex', flexDirection: 'column' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' },
  totalBox: { fontSize: '38px', fontWeight: 'bold', color: '#3b69b5', borderTop: '3px solid #3b69b5', marginTop: '20px', paddingTop: '15px', textAlign: 'right' },
  btnAction: { width: '100%', padding: '22px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '18px', marginTop: '20px', fontWeight: 'bold', fontSize: '22px' },
  payPanel: { background: '#f9f9f9', padding: '20px', borderRadius: '20px', marginTop: '15px' },
  input: { width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ccc' },
  btnSuccess: { width: '100%', padding: '15px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancel: { width: '100%', padding: '10px', background: 'none', border: 'none', color: '#888', marginTop: '10px', cursor: 'pointer' },
  card: { background: '#fff', padding: '40px', borderRadius: '25px', border: '1px solid #ddd' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '25px 0' },
  btnPrimary: { padding: '15px 30px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }
};

export default App;
