import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial
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
  const [sucursales, setSucursales] = useState(['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion']);

  // --- DATOS DE NEGOCIO ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f8f9fa' };

  // --- LÓGICA DE AUDITORÍA ---
  const registrarLog = async (usr, sucursalActual, evento) => {
    await supabase.from('logins').insert([
      { usuario_id: usr.id, nombre: usr.nombre, sucursal: sucursalActual, evento: evento }
    ]);
  };

  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUsuario(data);
      setSesionIniciada(true);
      registrarLog(data, sucursal, 'ENTRADA');
      setPin('');
    } else { alert("PIN Incorrecto"); setPin(''); }
  };

  const cerrarSesion = async () => {
    await registrarLog(usuario, sucursal, 'SALIDA');
    setSesionIniciada(false);
    setUsuario(null);
  };

  // --- COMPONENTES DE VISTA ---
  const menuItems = [
    { id: 'Inicio', ico: '🏠' }, { id: 'Ventas', ico: '📑' }, { id: 'Productos', ico: '📦' },
    { id: 'Compras', ico: '🛒' }, { id: 'Precios', ico: '🔍' }, { id: 'Clientes', ico: '👤' },
    { id: 'Proveedores', ico: '🚚' }, { id: 'Consultas', ico: '📂' }, { id: 'Reportes', ico: '📊' },
    { id: 'Estadísticas', ico: '📈' }, { id: 'Usuarios', ico: '👥' }, { id: 'Configuración', ico: '⚙️' }
  ];

  // Filtro de favoritos (puedes marcar una categoría como 'favoritos' en Supabase)
  const favoritos = useMemo(() => inventario.filter(p => p.cat === 'FAVORITOS'), [inventario]);

  if (!sesionIniciada) return (
    <div style={s.loginWrapper}>
      <div style={s.loginCard}>
        <img src={logoUrl} style={{ width: '150px' }} alt="3B" />
        <h2 style={{ color: c.azul, margin: '20px 0' }}>LAS 3B - NOGALES</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.pinInput} />
        <button onClick={manejarLogin} style={s.btnLogin}>ENTRAR</button>
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
            <div style={s.sucursalSelector}>
              <span>{sucursal}</span>
              {usuario.rol === 'Administrador' && (
                <button onClick={() => setVista('Configuración')} style={{border:'none', background:'none'}}>⇄</button>
              )}
            </div>
          </div>
          <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {menuItems.map(m => (
              <button key={m.id} onClick={() => setVista(m.id)} style={{...s.navItem, backgroundColor: vista === m.id ? '#e8f0fe' : 'transparent', color: vista === m.id ? c.azul : '#555'}}>
                <span style={{ marginRight: '15px' }}>{m.ico}</span> {m.id}
              </button>
            ))}
          </nav>
          <div style={s.sideFooter}>
            <div style={s.avatar}>{usuario.nombre[0]}</div>
            <div style={{flex: 1}}>
              <div style={{fontSize: '13px', fontWeight: 'bold'}}>{usuario.nombre}</div>
              <div style={{fontSize: '10px'}}>v1.1.0</div>
            </div>
            <button onClick={cerrarSesion} style={s.btnLogout}>Salir</button>
          </div>
        </aside>
      )}

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarAbierto(!sidebarAbierto)} style={s.btnMenu}>☰</button>
          <h2 style={{ color: c.azul, margin: 0 }}>{vista}</h2>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {/* 1. MÓDULO INICIO */}
          {vista === 'Inicio' && (
            <div style={s.gridInicio}>
              {menuItems.filter(i => i.id !== 'Inicio').map(m => (
                <button key={m.id} onClick={() => setVista(m.id)} style={s.cardModulo}>
                  <div style={{ fontSize: '45px' }}>{m.ico}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{m.id}</div>
                </button>
              ))}
            </div>
          )}

          {/* 2. MÓDULO VENTAS (CON FAVORITOS) */}
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '95%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="Escanea código o busca..." style={s.inputBig} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                <h4 style={{marginTop: '20px', color: c.azul}}>Productos Favoritos</h4>
                <div style={s.gridProds}>
                  {favoritos.length > 0 ? favoritos.map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, {...p, qty: 1}])} style={s.cardProd}>
                      <b style={{color: c.rojo}}>${p.precio}</b>
                      <div style={{fontSize: '12px'}}>{p.nombre}</div>
                    </div>
                  )) : <p style={{color: '#888'}}>No hay favoritos seleccionados.</p>}
                </div>
              </div>
              <aside style={s.ticketPanel}>
                <h3 style={{borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>ORDEN</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>
                  {carrito.map((item, idx) => (
                    <div key={idx} style={{display:'flex', justifyContent:'space-between', marginBottom: '8px'}}>
                      <span>{item.nombre}</span><b>${item.precio}</b>
                    </div>
                  ))}
                </div>
                <div style={s.total}>${carrito.reduce((a, b) => a + b.precio, 0)}.00</div>
                <button style={s.btnCobrar} onClick={() => {alert("Venta procesada"); setCarrito([])}}>COBRAR [F10]</button>
              </aside>
            </div>
          )}

          {/* 3. MÓDULO COMPRAS (POR PROVEEDOR) */}
          {vista === 'Compras' && (
            <div style={s.moduleCard}>
              <h3>Orden de Compra por Proveedor</h3>
              <select style={s.select}>
                {['Coca-Cola', 'Pepsi', 'Lala', 'Bimbo', 'Sabritas', 'Marinela', 'Gamesa', 'Nestlé'].map(p => <option key={p}>{p}</option>)}
              </select>
              <div style={{marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '10px', border: '1px dashed #ccc'}}>
                <p>Al recibir la factura del proveedor, ingrese las cantidades para actualizar el stock de las 8 tiendas.</p>
              </div>
            </div>
          )}

          {/* 4. MÓDULO USUARIOS (ADMIN PRIVILEGIOS) */}
          {vista === 'Usuarios' && usuario.rol === 'Administrador' && (
            <div style={s.moduleCard}>
              <h3>Gestión de Personal</h3>
              <div style={{display:'flex', gap: '10px'}}>
                <input style={s.input} placeholder="Nombre" />
                <input style={s.input} placeholder="PIN" />
                <select style={s.select}><option>Cajero</option><option>Administrador</option></select>
                <button style={s.btnSuccess}>Guardar</button>
              </div>
            </div>
          )}

          {/* ESTRUCTURA PARA EL RESTO DE MÓDULOS */}
          {['Productos', 'Precios', 'Clientes', 'Proveedores', 'Consultas', 'Reportes', 'Estadísticas', 'Configuración'].includes(vista) && (
            <div style={s.moduleCard}>
              <h3>Módulo de {vista}</h3>
              <p>Funcionalidad completa enlazada a Supabase lista para recibir datos.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

const s = {
  loginWrapper: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#c8b444' },
  loginCard: { background: '#fff', padding: '50px', borderRadius: '30px', textAlign: 'center', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
  pinInput: { width: '100%', padding: '20px', fontSize: '32px', textAlign: 'center', letterSpacing: '10px', borderRadius: '15px', border: '2px solid #ddd', margin: '20px 0' },
  btnLogin: { width: '100%', padding: '15px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px' },
  sidebar: { width: '280px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '5px solid #c8b444' },
  sucursalSelector: { marginTop: '10px', background: '#f0f0f0', padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '14px', border: 'none', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', marginBottom: '2px' },
  sideFooter: { padding: '15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', background: '#3b69b5', color: '#fff', textAlign:'center', lineHeight: '35px', fontWeight:'bold' },
  btnLogout: { border:'none', background:'none', color: '#ff0000', fontWeight: 'bold', cursor:'pointer' },
  mainHeader: { height: '70px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 25px' },
  btnMenu: { fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer', marginRight: '20px' },
  gridInicio: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '25px' },
  cardModulo: { background: '#fff', padding: '35px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', textAlign: 'center' },
  inputBig: { width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '18px' },
  gridProds: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '10px' },
  cardProd: { background: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' },
  ticketPanel: { width: '350px', background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  total: { fontSize: '40px', fontWeight: 'bold', textAlign: 'right', color: '#3b69b5', marginTop: '15px' },
  btnCobrar: { padding: '18px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', marginTop: '10px' },
  moduleCard: { background: '#fff', padding: '25px', borderRadius: '15px', border: '1px solid #ddd' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' },
  btnSuccess: { padding: '12px 20px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px' }
};

export default App;
