import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Conexión (Reemplaza con tus credenciales de Supabase)
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const POS_Las3B_Sistema_Integral = () => {
  // --- ESTADOS GLOBALES ---
  const [usuarioActivo, setUsuarioActivo] = useState({ nombre: 'Andres', rol: 'Administrador', inicial: 'A' });
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  
  // --- DATOS DEL SISTEMA ---
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Identidad Visual
  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f1f3f4' };

  // --- CARGA INICIAL DE DATOS ---
  useEffect(() => {
    async function inicializarSistema() {
      const { data, error } = await supabase.from('productos').select('*');
      if (!error) setInventario(data || []);
      setCargando(false);
    }
    inicializarSistema();
  }, []);

  // --- LÓGICA DE MÓDULOS ---
  const menuOpciones = [
    { nombre: 'Inicio', icono: '🏠', color: c.azul },
    { nombre: 'Ventas', icono: '📑', color: '#1e8e3e' },
    { nombre: 'Productos', icono: '📦', color: '#8e24aa' },
    { nombre: 'Clientes', icono: '👤', color: '#00acc1' },
    { nombre: 'Usuarios', icono: '👥', color: '#5f6368' }, // Nuevo Módulo solicitado
    { nombre: 'Corte de Caja', icono: '💰', color: c.ocre }
  ];

  const filtrados = useMemo(() => {
    return inventario.filter(p => 
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.id?.includes(busqueda)
    );
  }, [busqueda, inventario]);

  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // --- COMPONENTES DE VISTA ---
  
  if (cargando) return <div style={{padding: '50px', textAlign: 'center'}}>Iniciando Terminal Las 3B...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo, fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* SIDEBAR CON PERFIL DINÁMICO */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logoUrl} alt="Logo 3B" style={styles.logoImg} />
          <div style={{fontWeight: 'bold'}}>{sucursal}</div>
        </div>
        
        <nav style={styles.nav}>
          {menuOpciones.map(op => (
            <button key={op.nombre} onClick={() => setVistaActual(op.nombre)} 
              style={{...styles.navBtn, backgroundColor: vistaActual === op.nombre ? c.azul : 'transparent', color: vistaActual === op.nombre ? '#fff' : '#555'}}>
              {op.icono} {op.nombre}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={{...styles.avatar, backgroundColor: c.azul}}>{usuarioActivo.inicial}</div>
          <div>
            <div style={{fontSize: '14px', fontWeight: 'bold'}}>{usuarioActivo.nombre}</div>
            <div style={{fontSize: '11px', color: '#777'}}>{usuarioActivo.rol}</div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={styles.topBar}>
          <h2 style={{color: c.azul, margin: 0}}>{vistaActual}</h2>
          <div style={{fontSize: '12px', fontWeight: 'bold', color: '#1e8e3e'}}>● TERMINAL OPERATIVA</div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '25px' }}>
          
          {/* VISTA: INICIO */}
          {vistaActual === 'Inicio' && (
            <div style={styles.gridInicio}>
              {menuOpciones.filter(o => o.nombre !== 'Inicio').map(op => (
                <button key={op.nombre} onClick={() => setVistaActual(op.nombre)} style={styles.cardModulo}>
                  <div style={{fontSize: '40px', color: op.color}}>{op.icono}</div>
                  <div style={{fontWeight: 'bold', marginTop: '10px'}}>{op.nombre}</div>
                </button>
              ))}
            </div>
          )}

          {/* VISTA: VENTAS */}
          {vistaActual === 'Ventas' && (
            <div style={{display: 'flex', gap: '20px', height: '100%'}}>
              <div style={{flex: 1}}>
                <input type="text" placeholder="Escanee producto o busque..." style={styles.inputBusqueda} value={busqueda} onChange={e => setBusqueda(e.target.value)} autoFocus />
                <div style={styles.gridProductos}>
                  {filtrados.map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, {...p, cantidad: 1}])} style={styles.cardProducto}>
                      <div style={{color: c.rojo, fontWeight: 'bold'}}>${p.precio}</div>
                      <div style={{fontSize: '12px'}}>{p.nombre}</div>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={styles.carritoPanel}>
                <div style={{fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px'}}>ORDEN ACTUAL</div>
                <div style={{flex: 1, overflowY: 'auto', padding: '10px 0'}}>
                  {carrito.map((item, index) => (
                    <div key={index} style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px'}}>
                      <span>{item.nombre}</span>
                      <span>${item.precio}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.totalVenta}>Total: ${totalVenta}.00</div>
                <button onClick={() => alert("Procesando Pago...")} style={styles.btnCobrar}>FINALIZAR VENTA</button>
              </aside>
            </div>
          )}

          {/* VISTA: USUARIOS (ESTRUCTURA SOLICITADA) */}
          {vistaActual === 'Usuarios' && (
            <div style={styles.moduloContenedor}>
              <h3>Gestión de Personal y Turnos</h3>
              <p>Aquí podrá dar de alta a los cajeros y asignarles un PIN de acceso.</p>
              <table style={{width: '100%', backgroundColor: '#fff', borderRadius: '8px', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{backgroundColor: '#f8f9fa', textAlign: 'left'}}>
                    <th style={{padding: '12px'}}>Nombre</th>
                    <th style={{padding: '12px'}}>Rol</th>
                    <th style={{padding: '12px'}}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{padding: '12px'}}>Andrés</td>
                    <td style={{padding: '12px'}}>Administrador</td>
                    <td style={{padding: '12px'}}>Conectado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  sidebar: { width: '260px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '25px', textAlign: 'center', borderBottom: '4px solid #c8b444' },
  logoImg: { width: '80px', marginBottom: '10px' },
  nav: { flex: 1, padding: '15px' },
  navBtn: { display: 'flex', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px', textAlign: 'left', fontWeight: '600' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  topBar: { height: '65px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', borderBottom: '1px solid #ddd' },
  gridInicio: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', padding: '20px' },
  cardModulo: { backgroundColor: '#fff', padding: '40px', borderRadius: '15px', border: '1px solid #ddd', cursor: 'pointer', textAlign: 'center' },
  inputBusqueda: { width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' },
  gridProductos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginTop: '20px' },
  cardProducto: { background: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' },
  carritoPanel: { width: '320px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  totalVenta: { fontSize: '30px', fontWeight: 'bold', textAlign: 'right', borderTop: '2px solid #3b69b5', marginTop: '10px' },
  btnCobrar: { width: '100%', padding: '15px', backgroundColor: '#3b69b5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' },
  moduloContenedor: { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #ddd' }
};

export default POS_Las3B_Sistema_Integral;
