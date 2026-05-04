import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Conexión a Supabase
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const POS_Andres_3B = () => {
  // --- ESTADOS DE SESIÓN Y SEGURIDAD ---
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [pin, setPin] = useState('');
  
  // --- ESTADOS DE NAVEGACIÓN Y DATOS ---
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModalAlta, setMostrarModalAlta] = useState(false);

  // --- CONFIGURACIÓN DE MARCA ---
  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const colores = { 
    azul: '#3b69b5', 
    rojo: '#ff0000', 
    ocre: '#c8b444', 
    fondo: '#f1f3f4', 
    blanco: '#ffffff' 
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (sesionIniciada) {
      obtenerInventario();
    }
  }, [sesionIniciada]);

  const obtenerInventario = async () => {
    const { data, error } = await supabase.from('productos').select('*');
    if (!error) setInventario(data);
  };

  // --- LÓGICA DE ACCESO ---
  const manejarLogin = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('pin', pin)
      .eq('activo', true)
      .single();

    if (data) {
      setUsuarioActual(data);
      setSesionIniciada(true);
      setPin('');
    } else {
      alert("PIN Incorrecto o Usuario Inactivo");
      setPin('');
    }
  };

  // --- LÓGICA DE VENTAS ---
  const filtrados = useMemo(() => {
    return inventario.filter(p => 
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.id?.includes(busqueda)
    );
  }, [busqueda, inventario]);

  const agregarAlCarrito = (p) => {
    const existe = carrito.find(item => item.id === p.id);
    if (existe) {
      setCarrito(carrito.map(item => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCarrito([...carrito, { ...p, cantidad: 1 }]);
    }
  };

  // --- RENDERIZADO DE LOGIN ---
  if (!sesionIniciada) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colores.ocre }}>
        <div style={st.loginCard}>
          <img src={logoUrl} alt="Las 3B" style={{ width: '130px', marginBottom: '20px' }} />
          <h2 style={{ color: colores.azul }}>ACCESO SISTEMA 3B</h2>
          <input 
            type="password" 
            placeholder="PIN DE SEGURIDAD" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && manejarLogin()}
            style={st.pinInput}
          />
          <button onClick={manejarLogin} style={st.btnPrimary}>INICIAR TURNO</button>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: colores.fondo, fontFamily: 'Segoe UI, sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={st.sidebar}>
        <div style={st.sideHeader}>
          <img src={logoUrl} alt="Logo" style={{ width: '60px' }} />
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{sucursal}</div>
        </div>
        <nav style={{ flex: 1, padding: '15px' }}>
          {['Inicio', 'Ventas', 'Productos', 'Usuarios', 'Reportes'].map(m => (
            <button key={m} onClick={() => setVistaActual(m)} 
              style={{
                ...st.navBtn, 
                backgroundColor: vistaActual === m ? colores.azul : 'transparent',
                color: vistaActual === m ? '#fff' : '#555'
              }}>
              {m}
            </button>
          ))}
        </nav>
        <div style={st.sideFooter}>
          <div style={{...st.avatar, backgroundColor: colores.azul}}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Andres</div>
            <div style={{ fontSize: '11px', color: '#777' }}>{usuarioActual.rol}</div>
          </div>
          <button onClick={() => setSesionIniciada(false)} style={{ color: colores.rojo, border: 'none', background: 'none', cursor: 'pointer' }}>Salir</button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={st.topBar}>
          <h2 style={{ color: colores.azul, margin: 0 }}>{vistaActual}</h2>
          <div style={{ color: '#1e8e3e', fontWeight: 'bold', fontSize: '12px' }}>● TERMINAL CONECTADA</div>
        </header>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {vistaActual === 'Ventas' && (
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <input type="text" placeholder="Escanea código o busca nombre..." style={st.searchInput} value={busqueda} onChange={e => setBusqueda(e.target.value)} autoFocus />
                <div style={st.ventaGrid}>
                  {filtrados.map(p => (
                    <div key={p.id} onClick={() => agregarAlCarrito(p)} style={st.ventaCard}>
                      <b style={{ color: colores.rojo }}>${p.precio}</b>
                      <div style={{ fontSize: '12px' }}>{p.nombre}</div>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={st.ticketPanel}>
                <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>TICKET DE VENTA</div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {carrito.map((i, idx) => (
                    <div key={idx} style={st.ticketItem}>
                      <span>{i.nombre} x{i.cantidad}</span>
                      <span>${i.precio * i.cantidad}</span>
                    </div>
                  ))}
                </div>
                <div style={st.ticketTotal}>${carrito.reduce((a, b) => a + (b.precio * b.cantidad), 0)}.00</div>
                <button style={st.btnCobrar}>COBRAR [F10]</button>
              </aside>
            </div>
          )}

          {vistaActual === 'Productos' && (
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input type="text" placeholder="Filtrar inventario..." style={st.searchInput} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                  <button onClick={() => setMostrarModalAlta(true)} style={st.btnAdd}>+</button>
                </div>
                {filtrados.map(p => (
                  <div key={p.id} onClick={() => setProductoSeleccionado(p)} style={st.prodRow}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', color: '#888' }}>{p.unidad} | {p.id}</div>
                      <div style={{ fontWeight: 'bold' }}>{p.nombre}</div>
                      <div style={{ fontSize: '12px', color: colores.azul }}>Stock: {p.stock}</div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>${p.precio.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              {productoSeleccionado && (
                <aside style={st.propiedadesPanel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Propiedades</h3>
                    <button onClick={() => setProductoSeleccionado(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={st.datoGrup}><label>Descripción</label><input readOnly value={productoSeleccionado.nombre} style={st.propInput} /></div>
                  <div style={st.datoGrup}><label>Código</label><input readOnly value={productoSeleccionado.id} style={st.propInput} /></div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={st.datoGrup}><label>Costo</label><input readOnly value={`$${productoSeleccionado.costo}`} style={{...st.propInput, color: colores.rojo}} /></div>
                    <div style={st.datoGrup}><label>Precio</label><input readOnly value={`$${productoSeleccionado.precio}`} style={{...st.propInput, color: '#1e8e3e'}} /></div>
                  </div>
                </aside>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- ESTILOS ---
const st = {
  loginCard: { backgroundColor: '#fff', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center', width: '360px' },
  pinInput: { width: '100%', padding: '15px', textAlign: 'center', fontSize: '28px', letterSpacing: '10px', borderRadius: '12px', border: '2px solid #ddd', margin: '20px 0' },
  btnPrimary: { width: '100%', padding: '15px', backgroundColor: '#3b69b5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  sidebar: { width: '260px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '4px solid #c8b444' },
  navBtn: { display: 'block', width: '100%', padding: '12px 20px', border: 'none', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px', fontWeight: 'bold' },
  sideFooter: { padding: '15px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  topBar: { height: '65px', backgroundColor: '#fff', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' },
  ventaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginTop: '20px' },
  ventaCard: { backgroundColor: '#fff', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' },
  ticketPanel: { width: '320px', backgroundColor: '#fff', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column', padding: '20px' },
  ticketItem: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' },
  ticketTotal: { fontSize: '36px', fontWeight: 'bold', textAlign: 'right', color: '#3b69b5', borderTop: '2px solid #3b69b5', paddingTop: '10px' },
  btnCobrar: { width: '100%', padding: '18px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer' },
  btnAdd: { width: '50px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '24px', cursor: 'pointer' },
  prodRow: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '10px', cursor: 'pointer' },
  propiedadesPanel: { width: '380px', backgroundColor: '#fff', borderLeft: '1px solid #ddd', padding: '25px' },
  datoGrup: { marginBottom: '15px' },
  propInput: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #eee', backgroundColor: '#f9f9f9', marginTop: '5px', fontWeight: 'bold', outline: 'none' }
};

export default POS_Andres_3B;
