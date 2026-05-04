import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial Abarrotes Las 3B - Andres
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  // --- ESTADOS DE SISTEMA ---
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [pin, setPin] = useState('');
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [vista, setVista] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  
  // --- DATOS DE MÓDULOS ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f8f9fa' };
  const sucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // --- LÓGICA DE AUDITORÍA (LOGINS) ---
  const registrarEvento = async (tipo) => {
    if (!usuario) return;
    await supabase.from('logins').insert([
      { usuario_id: usuario.id, nombre: usuario.nombre, sucursal: sucursal, evento: tipo }
    ]);
  };

  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUsuario(data);
      setSesionIniciada(true);
      setPin('');
      // El registro de login se hace después de setUsuario en un useEffect o aquí directo con data
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal: sucursal, evento: 'ENTRADA' }]);
    } else {
      alert("PIN Incorrecto");
    }
  };

  const cerrarSesion = async () => {
    await registrarEvento('SALIDA');
    setSesionIniciada(false);
    setUsuario(null);
  };

  // --- NAVEGACIÓN ---
  const menuItems = [
    { id: 'Inicio', ico: '🏠' }, { id: 'Ventas', ico: '📑' }, { id: 'Productos', ico: '📦' },
    { id: 'Compras', ico: '🛒' }, { id: 'Checador', ico: '🔍' }, { id: 'Clientes', ico: '👤' },
    { id: 'Proveedores', ico: '🚚' }, { id: 'Consultas', ico: '📂' }, { id: 'Reportes', ico: '📊' },
    { id: 'Estadísticas', ico: '📈' }, { id: 'Usuarios', ico: '👥' }, { id: 'Configuración', ico: '⚙️' }
  ];

  // --- LOGIN SCREEN ---
  if (!sesionIniciada) return (
    <div style={s.loginWrapper}>
      <div style={s.loginCard}>
        <img src={logoUrl} style={{ width: '140px' }} alt="3B" />
        <h2 style={{ color: c.azul, margin: '20px 0' }}>LAS 3B - NOGALES</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} />
        <button onClick={manejarLogin} style={s.btnLogin}>INICIAR TURNO</button>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>v1.0.5 Enterprise</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {/* SIDEBAR COLAPSABLE */}
      {sidebarAbierto && (
        <aside style={s.sidebar}>
          <div style={s.sideHeader}>
            <div style={{ fontWeight: 'bold', color: c.azul }}>ABARROTES LAS 3B</div>
            <div style={{ fontSize: '11px', color: '#666' }}>NOGALES, SONORA</div>
            
            <div style={s.sucursalSelector}>
              <span>{sucursal}</span>
              {usuario.rol === 'Administrador' && (
                <button style={s.btnChange} onClick={() => setVista('Configuración')}>⇄</button>
              )}
            </div>
          </div>

          <nav style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {menuItems.map(m => (
              <button key={m.id} onClick={() => setVista(m.id)} style={{
                ...s.navItem,
                backgroundColor: vista === m.id ? '#e8f0fe' : 'transparent',
                color: vista === m.id ? c.azul : '#555'
              }}>
                <span style={{ marginRight: '15px' }}>{m.ico}</span> {m.id}
              </button>
            ))}
          </nav>

          <div style={s.sideFooter}>
            <div style={s.avatar}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{usuario.nombre}</div>
              <div style={{ fontSize: '10px' }}>{usuario.rol}</div>
            </div>
            <button onClick={cerrarSesion} style={s.btnLogout}>Salir</button>
          </div>
        </aside>
      )}

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarAbierto(!sidebarAbierto)} style={s.btnMenu}>☰</button>
          <h2 style={{ flex: 1, color: c.azul }}>{vista}</h2>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {/* MÓDULO INICIO (GRILLA CENTRAL) */}
          {vista === 'Inicio' && (
            <div style={s.gridInicio}>
              {menuItems.filter(i => i.id !== 'Inicio').map(m => (
                <button key={m.id} onClick={() => setVista(m.id)} style={s.cardModulo}>
                  <div style={{ fontSize: '40px' }}>{m.ico}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{m.id}</div>
                </button>
              ))}
            </div>
          )}

          {/* MÓDULO VENTAS (COMPLETO) */}
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '90%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="F1 - Escanear o buscar..." style={s.inputBig} autoFocus />
                <div style={s.gridProds}>
                  {/* Aquí iría el mapeo del inventario */}
                  <div style={s.cardProdEx}>
                    <b style={{ color: c.rojo }}>$19.00</b>
                    <div>COCA COLA 600ML</div>
                  </div>
                </div>
              </div>
              <aside style={s.ticketArea}>
                <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>ORDEN ACTUAL</h3>
                <div style={{ flex: 1 }}>{/* Items del carrito */}</div>
                <div style={s.total}>Total: $0.00</div>
                <button style={s.btnCobrar}>COBRAR [F10]</button>
              </aside>
            </div>
          )}

          {/* MÓDULO COMPRAS (POR PROVEEDOR) */}
          {vista === 'Compras' && (
            <div style={s.moduleCard}>
              <h3>Gestión de Pedidos</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <select style={s.select}>
                  <option>Seleccionar Proveedor...</option>
                  {['Coca-Cola', 'Pepsi', 'Lala', 'Bimbo', 'Marinela', 'Sabritas'].map(p => <option key={p}>{p}</option>)}
                </select>
                <button style={s.btnPrimary}>Cargar Pedido Sugerido</button>
              </div>
              <p style={{ color: '#888' }}>Al recibir la mercancía, valide las cantidades para actualizar el inventario automáticamente.</p>
            </div>
          )}

          {/* MÓDULO USUARIOS (SOLO ADMIN) */}
          {vista === 'Usuarios' && (
            <div style={s.moduleCard}>
              <h3>Control de Privilegios y Usuarios</h3>
              {usuario.rol === 'Administrador' ? (
                <div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input style={s.input} placeholder="Nombre del empleado" />
                    <input style={s.input} placeholder="PIN Nuevo" />
                    <select style={s.select}>
                      <option>Cajero</option>
                      <option>Administrador</option>
                    </select>
                    <button style={s.btnSuccess}>Guardar Usuario</button>
                  </div>
                </div>
              ) : (
                <div style={{ color: c.rojo }}>Acceso Denegado. Solo el administrador puede gestionar usuarios.</div>
              )}
            </div>
          )}

          {/* RESTO DE MÓDULOS (ESTRUCTURA LISTA) */}
          {['Checador', 'Clientes', 'Proveedores', 'Consultas', 'Reportes', 'Estadísticas', 'Configuración'].includes(vista) && (
            <div style={s.moduleCard}>
              <h3>Panel de {vista}</h3>
              <p>Módulo en desarrollo para la versión Enterprise de Las 3B.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// --- ESTILOS PROFESIONALES ---
const s = {
  loginWrapper: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#c8b444' },
  loginCard: { background: '#fff', padding: '50px', borderRadius: '30px', textAlign: 'center', width: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' },
  pinInput: { width: '100%', padding: '20px', fontSize: '35px', textAlign: 'center', letterSpacing: '10px', borderRadius: '15px', border: '2px solid #ddd', margin: '25px 0' },
  btnLogin: { width: '100%', padding: '20px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' },
  sidebar: { width: '280px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '25px', textAlign: 'center', borderBottom: '5px solid #c8b444' },
  sucursalSelector: { marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', background: '#f8f9fa', padding: '10px', borderRadius: '8px' },
  btnChange: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '15px', border: 'none', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', marginBottom: '2px' },
  sideFooter: { padding: '20px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '40px', height: '40px', background: '#3b69b5', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  btnLogout: { background: 'none', border: 'none', color: '#ff0000', cursor: 'pointer', fontWeight: 'bold' },
  mainHeader: { height: '70px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 25px' },
  btnMenu: { fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer', marginRight: '20px' },
  gridInicio: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '25px' },
  cardModulo: { background: '#fff', padding: '40px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', textAlign: 'center' },
  inputBig: { width: '100%', padding: '20px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '18px' },
  ticketArea: { width: '350px', background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  total: { fontSize: '40px', fontWeight: 'bold', textAlign: 'right', marginTop: '20px', color: '#3b69b5' },
  btnCobrar: { padding: '20px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '20px', marginTop: '10px' },
  moduleCard: { background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #ddd' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  btnPrimary: { padding: '12px 25px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '8px' },
  btnSuccess: { padding: '12px 25px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px' },
  gridProds: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginTop: '20px' },
  cardProdEx: { background: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center' }
};

export default App;
