import React, { useState, useMemo } from 'react';

const POS_Las3B_Oficial = () => {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Configuración de Identidad Visual
  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693"; 
  const colores = {
    fondo: '#c8b444', // Amarillo Ocre del fondo del logo
    acentos: '#ff0000', // Rojo del marco
    botones: '#3b69b5', // Azul del listón "24 HRS"
    textoLogo: '#000000', // Negro de las "B"
    blanco: '#ffffff'
  };

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  const [inventario] = useState([
    { id: '7501055300075', unidad: 'PZA', nombre: 'COCA COLA ORIGINAL 600ML', precio: 19, stock: 24, cat: 'BEBIDAS' },
    { id: '7501020515311', unidad: 'PZA', nombre: 'LECHE LALA ENTERA 1L', precio: 28, stock: 30, cat: 'LACTEOS' },
    { id: '7501025400032', unidad: 'PZA', nombre: 'PANDITAS RICOLINO 45G', precio: 15, stock: 20, cat: 'CONFITERIA' },
  ]);

  const menuOpciones = [
    { nombre: 'Inicio', icono: '🏠' },
    { nombre: 'Ventas', icono: '📑' },
    { nombre: 'Productos', icono: '📦' },
    { nombre: 'Clientes', icono: '👤' },
    { nombre: 'Compras', icono: '🛒' },
  ];

  const filtrados = useMemo(() => {
    return inventario.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.id.includes(busqueda));
  }, [busqueda, inventario]);

  return (
    <div style={{...styles.appContainer, backgroundColor: colores.fondo}}>
      {/* SIDEBAR PERSONALIZADO */}
      <aside style={styles.sidebar}>
        <div style={{...styles.sidebarHeader, borderBottom: `2px solid ${colores.acentos}`}}>
          <img src={logoUrl} alt="Logo 3B" style={styles.logoImg} />
          <div>
            <div style={{...styles.sucursalNombre, color: colores.textoLogo}}>{sucursal}</div>
            <div style={styles.sucursalUbicacion}>NOGALES, SONORA</div>
          </div>
        </div>
        <nav style={styles.sidebarNav}>
          {menuOpciones.map((op) => (
            <button 
              key={op.nombre} 
              onClick={() => setVistaActual(op.nombre)} 
              style={{
                ...styles.navItem, 
                backgroundColor: vistaActual === op.nombre ? colores.botones : 'transparent', 
                color: vistaActual === op.nombre ? colores.blanco : colores.textoLogo
              }}
            >
              <span style={styles.navIcon}>{op.icono}</span> {op.nombre}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={{...styles.userAvatar, backgroundColor: colores.botones}}>A</div>
            <div>
              <div style={styles.userName}>Andres</div>
              <div style={styles.userRole}>Administrador</div>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.mainContent}>
        <header style={{...styles.topBar, borderBottom: `3px solid ${colores.botones}`}}>
          <h2 style={{...styles.viewTitle, color: colores.botones}}>{vistaActual}</h2>
          <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.selectTop}>
            {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </header>

        <div style={styles.workspace}>
          {/* MÓDULO INICIO CON BOTONES INSTITUCIONALES */}
          {vistaActual === 'Inicio' && (
            <div style={styles.inicioGrid}>
              {menuOpciones.filter(o => o.nombre !== 'Inicio').map(op => (
                <button key={op.nombre} style={styles.moduloCard} onClick={() => setVistaActual(op.nombre)}>
                  <div style={{...styles.moduloIcon, color: colores.botones}}>{op.icono}</div>
                  <div style={{...styles.moduloNombre, color: colores.textoLogo}}>{op.nombre}</div>
                </button>
              ))}
            </div>
          )}

          {/* MÓDULO VENTAS */}
          {vistaActual === 'Ventas' && (
            <div style={styles.flexLayout}>
              <div style={styles.prodVentaArea}>
                <input type="text" placeholder="F1 - Buscar producto..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
                <div style={styles.gridVenta}>
                  {filtrados.map(p => (
                    <div key={p.id} style={styles.cardVenta} onClick={() => setCarrito([...carrito, {...p, cantidad: 1}])}>
                      <b style={{color: colores.acentos}}>${p.precio}</b>
                      <p style={{fontSize:'12px', fontWeight: 'bold'}}>{p.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{...styles.ticketArea, borderLeft: `4px solid ${colores.botones}`}}>
                <div style={{...styles.ticketHeader, backgroundColor: colores.botones, color: colores.blanco}}>TICKET</div>
                <div style={styles.ticketScroll}>
                  {carrito.map((item, idx) => (
                    <div key={idx} style={styles.ticketRow}>
                      <span>{item.nombre}</span>
                      <strong>${item.precio}</strong>
                    </div>
                  ))}
                </div>
                <div style={{...styles.ticketTotal, color: colores.acentos}}>${carrito.reduce((a,b)=>a+b.precio, 0)}.00</div>
                <button style={{...styles.btnPagar, backgroundColor: colores.botones}}>COBRAR [F10]</button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  appContainer: { display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '20px', display: 'flex', gap: '10px', alignItems: 'center' },
  logoImg: { width: '60px', height: '60px', objectFit: 'contain' },
  sucursalNombre: { fontWeight: 'bold', fontSize: '15px' },
  sucursalUbicacion: { fontSize: '10px', color: '#70757a' },
  sidebarNav: { flex: 1, padding: '15px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', marginBottom: '8px', fontWeight: 'bold' },
  navIcon: { marginRight: '12px', fontSize: '20px' },
  sidebarFooter: { padding: '20px', backgroundColor: '#f8f9fa' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '35px', height: '35px', borderRadius: '50%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  userName: { fontSize: '14px', fontWeight: 'bold' },
  userRole: { fontSize: '11px', color: '#70757a' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.8)' },
  topBar: { height: '65px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px' },
  viewTitle: { fontSize: '20px', fontWeight: 'bold' },
  selectTop: { padding: '8px', borderRadius: '6px', border: '1px solid #dadce0' },
  workspace: { flex: 1, overflow: 'hidden' },
  inicioGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', padding: '50px' },
  moduloCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '40px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  moduloIcon: { fontSize: '50px', marginBottom: '15px' },
  moduloNombre: { fontWeight: 'bold', fontSize: '18px' },
  flexLayout: { display: 'flex', height: '100%' },
  prodVentaArea: { flex: 1, padding: '25px', overflowY: 'auto' },
  searchInput: { width: '100%', padding: '15px', borderRadius: '10px', border: '2px solid #3b69b5', fontSize: '16px' },
  gridVenta: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginTop: '20px' },
  cardVenta: { backgroundColor: '#fff', borderRadius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'pointer' },
  ticketArea: { width: '350px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' },
  ticketHeader: { padding: '20px', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' },
  ticketScroll: { flex: 1, padding: '20px', overflowY: 'auto' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' },
  ticketTotal: { padding: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '40px' },
  btnPagar: { margin: '20px', padding: '20px', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }
};

export default POS_Las3B_Oficial;
