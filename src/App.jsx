import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Andres Las 3B
const supabase = createClient(
  'https://bablzxlaospziombkpdd.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg'
);

function App() {
  // --- ESTADOS DE SESIÓN Y NAVEGACIÓN ---
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Inicio');
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [sucursal, setSucursal] = useState('3B2');

  // --- ESTADOS DE VENTA Y COBRO ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagoCon, setPagoCon] = useState('');
  const [mostrarModalCobro, setMostrarModalCobro] = useState(false);
  const [metodo, setMetodo] = useState('EFECTIVO');

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', rojo: '#ff0000', verde: '#1e8e3e', fondo: '#f4f7f6' };
  const sucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // --- CARGA INICIAL ---
  useEffect(() => {
    if (sesion) cargarDatos();
  }, [sesion]);

  const cargarDatos = async () => {
    const { data } = await supabase.from('productos').select('*');
    setInventario(data || []);
  };

  // --- LÓGICA DE NEGOCIO ---
  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUser(data);
      setSesion(true);
      setPin('');
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal, evento: 'ENTRADA' }]);
    } else { alert("PIN Incorrecto"); setPin(''); }
  };

  const totalVenta = useMemo(() => carrito.reduce((acc, p) => acc + p.precio, 0), [carrito]);
  const cambio = useMemo(() => (parseFloat(pagoCon) || 0) - totalVenta, [pagoCon, totalVenta]);

  const procesarCobro = async () => {
    if (metodo === 'EFECTIVO' && cambio < 0) return alert("Monto insuficiente");
    
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user.nombre,
      total: totalVenta,
      sucursal: sucursal,
      articulos: carrito,
      metodo_pago: metodo
    }]);

    if (!error) {
      await supabase.from('movimientos_caja').insert([{ sucursal, vendedor: user.nombre, tipo: 'VENTA', monto: totalVenta, metodo }]);
      alert("Venta Exitosa");
      setCarrito([]);
      setMostrarModalCobro(false);
      setPagoCon('');
    }
  };

  // --- RENDERIZADO ---
  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={s.loginCard}>
        <img src={logo} style={{ width: '130px' }} />
        <h2 style={{ color: c.azul }}>LAS 3B - NOGALES</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} />
        <button onClick={manejarLogin} style={s.btnLogin}>ENTRAR AL PANEL</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {menuAbierto && (
        <aside style={s.sidebar}>
          <div style={s.sideHeader}>
            <b style={{color: c.azul}}>ABARROTES LAS 3B</b>
            <div style={s.sucSelector}>
              <span>{sucursal}</span>
              {user.rol === 'Administrador' && (
                <button onClick={() => setVista('Configuración')} style={{border:'none', background:'none', cursor:'pointer'}}>🔄</button>
              )}
            </div>
          </div>
          <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {['Inicio', 'Ventas', 'Productos', 'Compras', 'Checador', 'Clientes', 'Proveedores', 'Consultas', 'Reportes', 'Estadísticas', 'Usuarios', 'Configuración'].map(m => (
              <button key={m} onClick={() => setVista(m)} style={{...s.navItem, backgroundColor: vista === m ? '#e8f0fe' : 'transparent', color: vista === m ? c.azul : '#555'}}>
                {m}
              </button>
            ))}
          </nav>
          <div style={s.sideFooter}>
            <b>{user.nombre}</b><br/><span style={{fontSize:'10px'}}>v2.0.0 Enterprise</span>
          </div>
        </aside>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setMenuAbierto(!menuAbierto)} style={s.btnMenu}>☰</button>
          <h2 style={{ flex: 1, color: c.azul }}>{vista}</h2>
          <button onClick={() => setSesion(false)} style={s.btnSalir}>SALIR</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {vista === 'Inicio' && (
            <div style={s.gridInicio}>
              {['Ventas', 'Productos', 'Compras', 'Checador', 'Clientes', 'Proveedores', 'Consultas', 'Reportes', 'Estadísticas', 'Usuarios', 'Configuración'].map(m => (
                <button key={m} onClick={() => setVista(m)} style={s.cardMod}>
                  <div style={{fontWeight:'bold'}}>{m}</div>
                </button>
              ))}
            </div>
          )}

          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="F1 - Buscar o Escanear..." style={s.inputBig} />
                <h4 style={{color: c.azul, marginTop:'20px'}}>⭐ Productos Favoritos</h4>
                <div style={s.gridFavs}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={s.favCard}>
                      <b style={{color:c.rojo}}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={s.ticketPanel}>
                <h3>TICKET</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>
                  {carrito.map((it, i) => <div key={i} style={s.ticketLine}><span>{it.nombre}</span><b>${it.precio}</b></div>)}
                </div>
                <div style={s.totalArea}>TOTAL: ${totalVenta}.00</div>
                
                {mostrarModalCobro ? (
                  <div style={s.cobroPanel}>
                    <select value={metodo} onChange={e => setMetodo(e.target.value)} style={s.select}>
                      <option value="EFECTIVO">EFECTIVO</option>
                      <option value="TARJETA">TARJETA</option>
                    </select>
                    <input type="number" placeholder="Pagó con..." value={pagoCon} onChange={e => setPagoCon(e.target.value)} style={s.inputPago} autoFocus />
                    <div style={{fontSize:'24px', fontWeight:'bold', color: c.verde}}>CAMBIO: ${cambio >= 0 ? cambio : 0}</div>
                    <button onClick={procesarCobro} style={s.btnAceptar}>ACEPTAR</button>
                    <button onClick={() => setMostrarModalCobro(false)} style={s.btnCan}>CANCELAR</button>
                  </div>
                ) : (
                  <button onClick={() => setMostrarModalCobro(true)} style={s.btnCobrar}>COBRAR [F10]</button>
                )}
              </aside>
            </div>
          )}

          {/* Módulos de gestión (Compras, Usuarios, etc) */}
          {['Compras', 'Usuarios', 'Reportes'].includes(vista) && (
            <div style={s.cardModuloFull}>
              <h3>Gestión de {vista}</h3>
              <p>Módulo conectado a Supabase para las 8 sucursales.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// --- ESTILOS ---
const s = {
  loginCard: { background: '#fff', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '350px' },
  pinInput: { width: '100%', padding: '15px', fontSize: '30px', textAlign: 'center', letterSpacing: '10px', margin: '20px 0', borderRadius: '10px', border: '1px solid #ddd' },
  btnLogin: { width: '100%', padding: '15px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  sidebar: { width: '260px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '4px solid #c8b444' },
  sucSelector: { marginTop: '10px', background: '#f8f9fa', padding: '5px', borderRadius: '5px', fontSize: '12px' },
  navItem: { display: 'block', width: '100%', padding: '12px 20px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', marginBottom: '2px' },
  sideFooter: { padding: '15px', borderTop: '1px solid #eee' },
  mainHeader: { height: '65px', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #ddd' },
  btnMenu: { fontSize: '20px', border: 'none', background: 'none', cursor: 'pointer' },
  btnSalir: { marginLeft: 'auto', color: '#ff0000', border: '1px solid #ff0000', background: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' },
  gridInicio: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' },
  cardMod: { background: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer' },
  inputBig: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd' },
  gridFavs: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' },
  favCard: { background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' },
  ticketPanel: { width: '320px', background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  ticketLine: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' },
  totalArea: { fontSize: '32px', fontWeight: 'bold', color: '#3b69b5', borderTop: '2px solid #3b69b5', marginTop: '15px' },
  btnCobrar: { width: '100%', padding: '15px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '10px', fontWeight: 'bold' },
  cobroPanel: { marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '10px' },
  inputPago: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #3b69b5' },
  btnAceptar: { width: '100%', padding: '10px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '5px' },
  btnCan: { width: '100%', padding: '5px', background: 'none', border: 'none', color: '#888', marginTop: '5px' },
  select: { width: '100%', padding: '10px' },
  cardModuloFull: { background: '#fff', padding: '20px', borderRadius: '15px' }
};

export default App;
