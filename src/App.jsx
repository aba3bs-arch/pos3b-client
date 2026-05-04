import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Conexión
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
  
  // --- DATOS DE NEGOCIO ---
  const [sucursal, setSucursal] = useState('3B2');
  const [sucursales, setSucursales] = useState(['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion']);
  const [inventario, setInventario] = useState([]);
  const [proveedores, setProveedores] = useState([
    'Coca-Cola', 'Pepsi', 'Lala', 'Peñafiel', 'Big C Fruits', 'Bimbo', 'Marinela', 
    'Sabritas', 'Tostitos', 'Barcel', 'Blunwraps', 'Farmacia', 'Tabaco', 'Gamesa', 
    'Panadería', 'Mondelez', 'Snacky Party', 'Telefonía', 'Tortillería', 'Galletas'
  ]);

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f8f9fa' };

  // --- LOG LÓGICA DE ACCESO ---
  const registrarLogin = async (usr) => {
    await supabase.from('logins').insert([
      { usuario_id: usr.id, nombre: usr.nombre, sucursal: sucursal, evento: 'ENTRADA' }
    ]);
  };

  const manejarLogin = async () => {
    const { data, error } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUsuario(data);
      setSesionIniciada(true);
      registrarLogin(data);
      setPin('');
    } else {
      alert("PIN Incorrecto");
    }
  };

  const manejarCerrarSesion = async () => {
    await supabase.from('logins').insert([
      { usuario_id: usuario.id, nombre: usuario.nombre, sucursal: sucursal, evento: 'SALIDA' }
    ]);
    setSesionIniciada(false);
  };

  // --- COMPONENTES DE MÓDULOS ---
  const menuItems = [
    { id: 'Inicio', ico: '🏠' }, { id: 'Ventas', ico: '📑' }, { id: 'Productos', ico: '📦' },
    { id: 'Compras', ico: '🛒' }, { id: 'Precios', ico: '🔍' }, { id: 'Clientes', ico: '👤' },
    { id: 'Proveedores', ico: '🚚' }, { id: 'Consultas', ico: '📂' }, { id: 'Reportes', ico: '📊' },
    { id: 'Estadísticas', ico: '📈' }, { id: 'Usuarios', ico: '👥' }, { id: 'Configuración', ico: '⚙️' }
  ];

  if (!sesionIniciada) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        <img src={logoUrl} style={{ width: '150px' }} />
        <h2 style={{ color: c.azul, margin: '20px 0' }}>PUNTO DE VENTA 3B</h2>
        <input type="password" placeholder="PIN DE ACCESO" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={{ width: '100%', padding: '20px', textAlign: 'center', fontSize: '30px', borderRadius: '15px', border: '2px solid #ddd', marginBottom: '20px' }} />
        <button onClick={manejarLogin} style={{ width: '100%', padding: '18px', backgroundColor: c.azul, color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>ENTRAR AL TURNO</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo, overflow: 'hidden' }}>
      {/* SIDEBAR COLAPSABLE */}
      {sidebarAbierto && (
        <aside style={{ width: '280px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', transition: '0.3s' }}>
          <div style={{ padding: '25px', textAlign: 'center', borderBottom: `5px solid ${c.ocre}` }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: c.azul }}>ABARROTES LAS 3B</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
              <span style={{ fontSize: '14px' }}>Sucursal: {sucursal}</span>
              {usuario.rol === 'Administrador' && (
                <button onClick={() => setVista('Configuración')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🔄</button>
              )}
            </div>
          </div>
          
          <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {menuItems.map(m => (
              <button key={m.id} onClick={() => setVista(m.id)} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '14px', border: 'none', background: vista === m.id ? '#e8f0fe' : 'transparent', color: vista === m.id ? c.azul : '#444', borderRadius: '10px', marginBottom: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                <span style={{ marginRight: '15px', fontSize: '20px' }}>{m.ico}</span> {m.id}
              </button>
            ))}
            <button onClick={manejarCerrarSesion} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '14px', border: 'none', background: 'transparent', color: c.rojo, borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
              <span style={{ marginRight: '15px', fontSize: '20px' }}>🚪</span> Salir
            </button>
          </nav>

          <div style={{ padding: '20px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: c.azul, color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{usuario.nombre[0]}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{usuario.nombre}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>v1.0.4 - Las 3B Nogales</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ÁREA DE CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 25px', borderBottom: '1px solid #ddd' }}>
          <button onClick={() => setSidebarAbierto(!sidebarAbierto)} style={{ fontSize: '24px', border: 'none', background: 'none', cursor: 'pointer', marginRight: '20px' }}>☰</button>
          <h2 style={{ color: c.azul, margin: 0, flex: 1 }}>{vista}</h2>
        </header>

        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          {/* VISTA INICIO (MENU CENTRAL) */}
          {vista === 'Inicio' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '25px' }}>
              {menuItems.filter(i => i.id !== 'Inicio').map(m => (
                <button key={m.id} onClick={() => setVista(m.id)} style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', textAlign: 'center', transition: '0.2s' }}>
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{m.ico}</div>
                  <div style={{ fontWeight: 'bold' }}>{m.id}</div>
                </button>
              ))}
            </div>
          )}

          {/* MÓDULO COMPRAS (PROVEEDORES) */}
          {vista === 'Compras' && (
            <div>
              <h3>Nueva Orden de Compra</h3>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <select style={{ padding: '12px', borderRadius: '10px', flex: 1 }}>
                  <option>Seleccionar Proveedor...</option>
                  {proveedores.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button style={{ backgroundColor: c.azul, color: '#fff', padding: '0 25px', borderRadius: '10px', border: 'none' }}>Iniciar Pedido</button>
              </div>
              <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #ddd' }}>
                <p style={{ color: '#888', textAlign: 'center' }}>Seleccione un proveedor para gestionar el inventario de marcas como {proveedores[0]}, {proveedores[2]} o {proveedores[5]}.</p>
              </div>
            </div>
          )}

          {/* VISTA USUARIOS (ADMIN PRIVILEGIOS) */}
          {vista === 'Usuarios' && usuario.rol === 'Administrador' && (
            <div style={{ background: '#fff', padding: '25px', borderRadius: '20px' }}>
              <h3>Control de Personal y Privilegios</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="Nombre" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <input type="password" placeholder="PIN" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <option>Cajero</option>
                  <option>Administrador</option>
                  <option>Soporte</option>
                </select>
                <button style={{ backgroundColor: '#1e8e3e', color: '#fff', padding: '0 20px', borderRadius: '8px', border: 'none' }}>Crear Usuario</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
