import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Abarrotes Las 3B
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  // --- ESTADOS DE NAVEGACIÓN Y SESIÓN ---
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Inicio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sucursal, setSucursal] = useState('3B2');

  // --- ESTADOS DE DATOS ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pagoCon, setPagoCon] = useState('');
  const [metodo, setMetodo] = useState('EFECTIVO');
  const [mostrarCobro, setMostrarCobro] = useState(false);
  const [proveedores, setProveedores] = useState([]);

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', verde: '#1e8e3e', rojo: '#ff0000', fondo: '#f8f9fa' };

  // --- CARGA INICIAL ---
  useEffect(() => {
    if (sesion) {
      cargarInventario();
      cargarProveedores();
    }
  }, [sesion]);

  const cargarInventario = async () => {
    const { data } = await supabase.from('productos').select('*');
    setInventario(data || []);
  };

  const cargarProveedores = async () => {
    const { data } = await supabase.from('proveedores').select('*');
    setProveedores(data || []);
  };

  // --- LÓGICA DE LOGIN ---
  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUser(data);
      setSesion(true);
      setPin('');
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal, evento: 'ENTRADA' }]);
    } else {
      alert("PIN Incorrecto");
      setPin('');
    }
  };

  // --- LÓGICA DE VENTAS ---
  const totalVenta = useMemo(() => carrito.reduce((acc, p) => acc + (p.precio || 0), 0), [carrito]);
  const cambio = useMemo(() => (parseFloat(pagoCon) || 0) - totalVenta, [pagoCon, totalVenta]);

  const finalizarVenta = async () => {
    if (metodo === 'EFECTIVO' && cambio < 0) return alert("Monto insuficiente");
    
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user.nombre,
      sucursal_id: sucursal,
      total: totalVenta,
      metodo_pago: metodo,
      articulos: carrito
    }]);

    if (!error) {
      alert(`Venta guardada. Cambio: $${cambio > 0 ? cambio : 0}`);
      setCarrito([]);
      setMostrarCobro(false);
      setPagoCon('');
      cargarInventario();
    }
  };

  // --- LÓGICA DE ASISTENCIA (CHECADOR) ---
  const marcarAsistencia = async (tipo) => {
    const { error } = await supabase.from('asistencia').insert([{
      usuario_id: user.id,
      nombre: user.nombre,
      sucursal: sucursal,
      tipo: tipo
    }]);
    if (!error) alert(`Asistencia registrada: ${tipo}`);
  };

  // --- PANTALLA DE ACCESO ---
  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={s.loginCard}>
        <img src={logo} style={{ width: '130px' }} alt="Las 3B" />
        <h2 style={{ color: c.azul }}>SISTEMA LAS 3B</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} />
        <button onClick={manejarLogin} style={s.btnLogin}>ENTRAR AL PANEL</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {/* SIDEBAR COLAPSABLE */}
      {sidebarOpen && (
        <aside style={s.sidebar}>
          <div style={s.sideHeader}>
            <b style={{color: c.azul}}>ABARROTES LAS 3B</b>
            <div style={s.tagSuc}>{sucursal}</div>
          </div>
          <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {['Inicio', 'Ventas', 'Productos', 'Compras', 'Checador', 'Clientes', 'Proveedores', 'Reportes', 'Usuarios', 'Configuración'].map(m => (
              <button key={m} onClick={() => setVista(m)} style={{...s.navBtn, backgroundColor: vista === m ? '#e8f0fe' : 'transparent', color: vista === m ? c.azul : '#555'}}>
                {m}
              </button>
            ))}
          </nav>
          <div style={s.sideFooter}>
            <b>{user.nombre}</b><br/>
            <span style={{fontSize: '10px'}}>v2.5.0 Enterprise</span>
          </div>
        </aside>
      )}

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.btnToggle}>☰</button>
          <h2 style={{ color: c.azul, margin: 0 }}>{vista}</h2>
          <button onClick={() => setSesion(false)} style={s.btnSalir}>SALIR</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {/* VISTA VENTAS */}
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="F1 - Buscar producto..." style={s.inputBig} />
                <h4 style={{color: c.azul, marginTop: '20px'}}>⭐ Productos Favoritos</h4>
                <div style={s.gridFavs}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={s.favCard}>
                      <b style={{color: c.rojo}}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={s.panelTicket}>
                <h3>TICKET</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>
                  {carrito.map((it, i) => <div key={i} style={s.lineaTicket}><span>{it.nombre}</span><b>${it.precio}</b></div>)}
                </div>
                <div style={s.totalArea}>TOTAL: ${totalVenta}.00</div>
                {mostrarCobro ? (
                  <div style={s.panelPagar}>
                    <select value={metodo} onChange={e => setMetodo(e.target.value)} style={s.select}>
                      <option value="EFECTIVO">EFECTIVO</option>
                      <option value="TARJETA">TARJETA</option>
                    </select>
                    <input type="number" placeholder="Pagó con..." value={pagoCon} onChange={e => setPagoCon(e.target.value)} style={s.inputPago} autoFocus />
                    <div style={{fontSize: '22px', fontWeight: 'bold', color: c.verde}}>CAMBIO: ${cambio >= 0 ? cambio.toFixed(2) : 0}</div>
                    <button onClick={finalizarVenta} style={s.btnFinalizar}>REGISTRAR VENTA</button>
                    <button onClick={() => setMostrarCobro(false)} style={s.btnCan}>CANCELAR</button>
                  </div>
                ) : (
                  <button onClick={() => setMostrarCobro(true)} style={s.btnCobrar}>COBRAR [F10]</button>
                )}
              </aside>
            </div>
          )}

          {/* VISTA CHECADOR */}
          {vista === 'Checador' && (
            <div style={s.cardSimple}>
              <h3>Registro de Asistencia - {user.nombre}</h3>
              <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                <button onClick={() => marcarAsistencia('ENTRADA_TURNO')} style={s.btnPrimary}>ENTRADA TURNO</button>
                <button onClick={() => marcarAsistencia('INICIO_COMIDA')} style={s.btnOcre}>SALIDA A COMER</button>
                <button onClick={() => marcarAsistencia('SALIDA_TURNO')} style={s.btnRojo}>SALIDA TURNO</button>
              </div>
            </div>
          )}

          {/* VISTA COMPRAS */}
          {vista === 'Compras' && (
            <div style={s.cardSimple}>
              <h3>Entrada de Mercancía</h3>
              <select style={s.select}>
                <option>Seleccione Proveedor...</option>
                {proveedores.map(p => <option key={p.id}>{p.nombre}</option>)}
              </select>
              <p style={{marginTop: '20px', color: '#666'}}>Use este módulo para cargar facturas de Coca-Cola, Lala, etc. El stock se sumará automáticamente al validar.</p>
            </div>
          )}

          {/* OTRAS VISTAS (ESTRUCTURA) */}
          {['Inicio', 'Productos', 'Clientes', 'Proveedores', 'Reportes', 'Usuarios', 'Configuración', 'Consultas', 'Estadísticas'].includes(vista) && (
            <div style={s.cardSimple}>
              <h3>Módulo de {vista}</h3>
              <p>Conectado a la base de datos de Nogales.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- ESTILOS PROFESIONALES ---
const s = {
  loginCard: { background: '#fff', padding: '45px', borderRadius: '30px', textAlign: 'center', width: '380px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' },
  pinInput: { width: '100%', padding: '18px', fontSize: '30px', textAlign: 'center', letterSpacing: '10px', borderRadius: '15px', border: '2px solid #ddd', margin: '25px 0' },
  btnLogin: { width: '100%', padding: '18px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' },
  sidebar: { width: '250px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '5px solid #c8b444' },
  tagSuc: { background: '#f0f0f0', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', marginTop: '8px', display: 'inline-block' },
  navBtn: { display: 'block', width: '100%', padding: '12px 20px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '10px', marginBottom: '2px' },
  sideFooter: { padding: '15px', borderTop: '1px solid #eee' },
  mainHeader: { height: '70px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 25px' },
  btnToggle: { fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer', marginRight: '15px' },
  btnSalir: { marginLeft: 'auto', background: '#ff0000', color: '#fff', padding: '8px 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  inputBig: { width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '18px' },
  gridFavs: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px', marginTop: '15px' },
  favCard: { background: '#fff', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  panelTicket: { width: '340px', background: '#fff', borderLeft: '1px solid #ddd', padding: '25px', display: 'flex', flexDirection: 'column' },
  lineaTicket: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' },
  totalArea: { fontSize: '35px', fontWeight: 'bold', color: '#3b69b5', borderTop: '3px solid #3b69b5', marginTop: '20px', paddingTop: '15px', textAlign: 'right' },
  btnCobrar: { width: '100%', padding: '20px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '15px', marginTop: '15px', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' },
  panelPagar: { background: '#f9f9f9', padding: '20px', borderRadius: '20px', marginTop: '10px', border: '1px solid #eee' },
  select: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px' },
  inputPago: { width: '100%', padding: '12px', fontSize: '22px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #3b69b5' },
  btnFinalizar: { width: '100%', padding: '15px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  btnCan: { width: '100%', padding: '5px', background: 'none', border: 'none', color: '#888', marginTop: '8px', cursor: 'pointer' },
  cardSimple: { background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #ddd' },
  btnPrimary: { padding: '15px 25px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  btnOcre: { padding: '15px 25px', background: '#c8b444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  btnRojo: { padding: '15px 25px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default App;
