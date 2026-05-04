import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Andres Las 3B
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  // --- ESTADOS CORE ---
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vista, setVista] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  
  // --- DATOS ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', rojo: '#ff0000', verde: '#1e8e3e', fondo: '#f4f6f8' };

  // --- LÓGICA DE INICIO DE SESIÓN ---
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

  const cerrarTurno = async () => {
    await supabase.from('logins').insert([{ usuario_id: user.id, nombre: user.nombre, sucursal, evento: 'SALIDA' }]);
    setSesion(false);
  };

  // --- COMPONENTES DE MÓDULOS ---
  const modulos = [
    { n: 'Inicio', i: '🏠' }, { n: 'Ventas', i: '📑' }, { n: 'Productos', i: '📦' },
    { n: 'Compras', i: '🛒' }, { n: 'Checador', i: '🔍' }, { n: 'Clientes', i: '👤' },
    { n: 'Proveedores', i: '🚚' }, { n: 'Consultas', i: '📂' }, { n: 'Reportes', i: '📊' },
    { n: 'Estadísticas', i: '📈' }, { n: 'Usuarios', i: '👥' }, { n: 'Configuración', i: '⚙️' }
  ];

  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={s.loginCard}>
        <img src={logo} style={{ width: '150px' }} alt="3B" />
        <h2 style={{ color: c.azul }}>ABARROTES LAS 3B</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} />
        <button onClick={manejarLogin} style={s.btnLogin}>INICIAR TURNO</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {/* SIDEBAR COLAPSABLE */}
      {sidebarOpen && (
        <aside style={s.sidebar}>
          <div style={s.sideHeader}>
            <div style={{fontWeight:'bold', color: c.azul}}>LAS 3B NOGALES</div>
            <div style={s.sucursalLabel}>
              {sucursal} 
              {user.rol === 'Administrador' && <button onClick={() => setVista('Configuración')} style={s.btnSuc}>⇄</button>}
            </div>
          </div>
          <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {modulos.map(m => (
              <button key={m.n} onClick={() => setVista(m.n)} style={{...s.navItem, backgroundColor: vista === m.n ? '#e8f0fe' : 'transparent', color: vista === m.n ? c.azul : '#555'}}>
                <span style={{marginRight:'12px'}}>{m.i}</span> {m.n}
              </button>
            ))}
          </nav>
          <div style={s.sideFooter}>
            <div style={s.avatar}>{user.nombre[0]}</div>
            <div style={{flex: 1}}>
              <div style={{fontSize: '13px', fontWeight: 'bold'}}>{user.nombre}</div>
              <div style={{fontSize: '10px'}}>v1.5.0 Enterprise</div>
            </div>
          </div>
        </aside>
      )}

      {/* ÁREA DE CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={s.btnMenu}>☰</button>
          <h2 style={{ color: c.azul, margin: 0 }}>{vista}</h2>
          <button onClick={cerrarTurno} style={s.btnSalir}>SALIR</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {vista === 'Inicio' && (
            <div style={s.gridInicio}>
              {modulos.filter(x => x.n !== 'Inicio').map(m => (
                <button key={m.n} onClick={() => setVista(m.n)} style={s.cardMod}>
                  <div style={{fontSize: '40px'}}>{m.i}</div>
                  <div style={{fontWeight: 'bold', marginTop: '10px'}}>{m.n}</div>
                </button>
              ))}
            </div>
          )}

          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="F1 - Buscar producto o Escanear..." style={s.inputBusqueda} />
                <h4 style={{color: c.azul, marginTop: '20px'}}>⭐ Productos Favoritos</h4>
                <div style={s.gridFavoritos}>
                  {/* Ejemplo de Favoritos */}
                  <div style={s.favCard} onClick={() => setCarrito([...carrito, {n: 'Coca Cola 600ml', p: 18}])}>
                    <b style={{color: c.rojo}}>$18.00</b><br/>Coca Cola 600ml
                  </div>
                </div>
              </div>
              <aside style={s.posPanel}>
                <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '10px'}}>TICKET</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>
                  {carrito.map((item, i) => <div key={i} style={s.ticketLine}><span>{item.n}</span><b>${item.p}</b></div>)}
                </div>
                <div style={s.totalArea}>Total: ${carrito.reduce((a, b) => a + b.p, 0)}.00</div>
                <button style={s.btnCobrar} onClick={() => {alert("Venta Guardada"); setCarrito([]);}}>COBRAR [F10]</button>
              </aside>
            </div>
          )}

          {/* Módulos en construcción profunda */}
          {['Compras', 'Usuarios', 'Reportes', 'Configuración'].includes(vista) && (
            <div style={s.modView}>
              <h3>Panel de Control - {vista}</h3>
              <p>Este módulo está conectado a Supabase para gestionar {vista.toLowerCase()} de las 8 sucursales.</p>
              {vista === 'Usuarios' && user.rol === 'Administrador' && <button style={s.btnIn}>+ Nuevo Usuario</button>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const s = {
  loginCard: { background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '360px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' },
  pinInput: { width: '100%', padding: '18px', fontSize: '30px', textAlign: 'center', letterSpacing: '10px', borderRadius: '12px', border: '2px solid #ddd', margin: '20px 0' },
  btnLogin: { width: '100%', padding: '15px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' },
  sidebar: { width: '260px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '5px solid #c8b444' },
  sucursalLabel: { marginTop: '10px', background: '#f8f9fa', padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
  btnSuc: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '14px 20px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '10px', marginBottom: '2px' },
  sideFooter: { padding: '15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', background: '#3b69b5', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  mainHeader: { height: '70px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 25px' },
  btnMenu: { fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer', marginRight: '20px' },
  btnSalir: { marginLeft: 'auto', background: 'none', border: '1px solid #ff0000', color: '#ff0000', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  gridInicio: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' },
  cardMod: { background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  inputBusqueda: { width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '16px' },
  gridFavoritos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginTop: '15px' },
  favCard: { background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' },
  posPanel: { width: '340px', background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  ticketLine: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' },
  totalArea: { fontSize: '32px', fontWeight: 'bold', textAlign: 'right', marginTop: '15px', color: '#3b69b5', borderTop: '2px solid #3b69b5', paddingTop: '10px' },
  btnCobrar: { width: '100%', padding: '18px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '20px', marginTop: '15px', cursor: 'pointer' },
  modView: { background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #ddd' },
  btnIn: { padding: '10px 20px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer' }
};

export default App;
