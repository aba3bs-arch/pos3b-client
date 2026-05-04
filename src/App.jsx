import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Abarrotes Las 3B
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
  const [sucursal, setSucursal] = useState('3B2');

  // --- ESTADOS DE DATOS ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagoCon, setPagoCon] = useState('');
  const [metodo, setMetodo] = useState('EFECTIVO');
  const [mostrarCobro, setMostrarCobro] = useState(false);

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', rojo: '#ff0000', verde: '#1e8e3e', fondo: '#f8f9fa' };

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
    const { data, error } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
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

  // --- LÓGICA DE VENTA ---
  const totalVenta = useMemo(() => carrito.reduce((acc, p) => acc + p.precio, 0), [carrito]);
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
      alert("Venta procesada con éxito");
      setCarrito([]);
      setMostrarCobro(false);
      setPagoCon('');
      cargarInventario(); // Recarga para ver el stock actualizado por el trigger
    } else {
      console.error(error);
      alert("Error al guardar venta");
    }
  };

  // --- PANTALLA DE ACCESO ---
  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={s.loginCard}>
        <img src={logo} style={{ width: '130px' }} alt="Las 3B" />
        <h2 style={{ color: c.azul }}>LAS 3B - NOGALES</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} />
        <button onClick={manejarLogin} style={s.btnLogin}>ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {/* SIDEBAR */}
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
            <span style={{fontSize: '10px'}}>v2.1.0 Enterprise</span>
          </div>
        </aside>
      )}

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.btnToggle}>☰</button>
          <h2 style={{ color: c.azul, margin: 0 }}>{vista}</h2>
          <button onClick={() => setSesion(false)} style={s.btnSalir}>CERRAR TURNO</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflow: 'hidden' }}>
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <input type="text" placeholder="F1 - Buscar producto..." style={s.inputBig} />
                <h4 style={{color: c.azul, marginTop: '20px'}}>⭐ Favoritos</h4>
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
                    <div style={{fontSize: '22px', fontWeight: 'bold', color: c.verde}}>CAMBIO: ${cambio >= 0 ? cambio : 0}</div>
                    <button onClick={finalizarVenta} style={s.btnFinalizar}>REGISTRAR VENTA</button>
                    <button onClick={() => setMostrarCobro(false)} style={s.btnCan}>CANCELAR</button>
                  </div>
                ) : (
                  <button onClick={() => setMostrarCobro(true)} style={s.btnCobrar}>COBRAR [F10]</button>
                )}
              </aside>
            </div>
          )}

          {['Inicio', 'Productos', 'Compras', 'Usuarios'].includes(vista) && (
            <div style={s.cardSimple}>
              <h3>Panel de {vista}</h3>
              <p>Módulo operativo conectado a Supabase.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- ESTILOS ---
const s = {
  loginCard: { background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' },
  pinInput: { width: '100%', padding: '15px', fontSize: '28px', textAlign: 'center', letterSpacing: '10px', borderRadius: '12px', border: '1px solid #ddd', margin: '20px 0' },
  btnLogin: { width: '100%', padding: '15px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  sidebar: { width: '250px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '4px solid #c8b444' },
  tagSuc: { background: '#f0f0f0', padding: '5px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold', marginTop: '5px' },
  navBtn: { display: 'block', width: '100%', padding: '12px 20px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', marginBottom: '2px' },
  sideFooter: { padding: '15px', borderTop: '1px solid #eee' },
  mainHeader: { height: '65px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px' },
  btnToggle: { fontSize: '22px', border: 'none', background: 'none', cursor: 'pointer', marginRight: '15px' },
  btnSalir: { marginLeft: 'auto', color: c.rojo, border: `1px solid ${c.rojo}`, background: 'none', padding: '5px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  inputBig: { width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' },
  gridFavs: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px', marginTop: '10px' },
  favCard: { background: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' },
  panelTicket: { width: '320px', background: '#fff', borderLeft: '1px solid #ddd', padding: '20px', display: 'flex', flexDirection: 'column' },
  lineaTicket: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' },
  totalArea: { fontSize: '32px', fontWeight: 'bold', color: '#3b69b5', borderTop: '2px solid #3b69b5', marginTop: '15px', paddingTop: '10px' },
  btnCobrar: { width: '100%', padding: '18px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' },
  panelPagar: { background: '#f9f9f9', padding: '15px', borderRadius: '12px', marginTop: '10px' },
  select: { width: '100%', padding: '10px', marginBottom: '10px' },
  inputPago: { width: '100%', padding: '10px', fontSize: '20px', marginBottom: '10px' },
  btnFinalizar: { width: '100%', padding: '12px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnCan: { width: '100%', padding: '5px', background: 'none', border: 'none', color: '#888', marginTop: '5px', cursor: 'pointer' },
  cardSimple: { background: '#fff', padding: '30px', borderRadius: '20px' }
};

// --- EL EXPORT QUE FALTABA ---
export default App;
