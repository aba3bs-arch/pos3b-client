import React, { useState, useMemo } from 'react';

const POS_Andres_Elite = () => {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [busqueda, setBusqueda] = useState('');
  const [sucursal, setSucursal] = useState('3B2');

  const menuOpciones = [
    { nombre: 'Inicio', icono: '🏠', color: '#1a73e8' },
    { nombre: 'Ventas', icono: '📑', color: '#1e8e3e' },
    { nombre: 'Productos', icono: '📦', color: '#8e24aa' },
    { nombre: 'Clientes', icono: '👤', color: '#00acc1' },
    { nombre: 'Compras', icono: '🛒', color: '#d93025' },
  ];

  // Base de datos extendida para el módulo de Productos
  const inventario = [
    { id: 'P1', unidad: 'PZA', nombre: 'plato desechable', precio: 2.00, stock: 0, img: 'https://via.placeholder.com/60?text=Plato' },
    { id: 'v4', unidad: 'PZA', nombre: 'vaso desechable', precio: 2.00, stock: 0, img: 'https://via.placeholder.com/60?text=Vaso' },
    { id: '64', unidad: 'PZA', nombre: 'Apotex Omeprazol 2 pcs', precio: 10.00, stock: 11, img: 'https://via.placeholder.com/60?text=Med' },
    { id: '7500810049181', unidad: 'PZA', nombre: 'gallefut', precio: 10.00, stock: 4, img: 'https://via.placeholder.com/60?text=Galleta' },
    { id: '7501030409854', unidad: 'PZA', nombre: 'NITO DUO 124G', precio: 30.00, stock: 3, img: 'https://via.placeholder.com/60?text=Nito' },
    { id: '7501055305704', unidad: 'CAJA', nombre: 'COCA COLA LIGHT RETORNABLE 500...', precio: 20.00, stock: 6, img: 'https://via.placeholder.com/60?text=Coke' },
  ];

  const productosFiltrados = useMemo(() => {
    return inventario.filter(p => 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      p.id.includes(busqueda)
    );
  }, [busqueda]);

  return (
    <div style={styles.appContainer}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoCircle}>3B</div>
          <div>
            <div style={styles.sucursalNombre}>{sucursal}</div>
            <div style={styles.sucursalUbicacion}>NOGALES, SONORA</div>
          </div>
        </div>
        <nav style={styles.sidebarNav}>
          {menuOpciones.map((op) => (
            <button key={op.nombre} onClick={() => setVistaActual(op.nombre)} style={{...styles.navItem, backgroundColor: vistaActual === op.nombre ? '#e8f0fe' : 'transparent', color: vistaActual === op.nombre ? '#1a73e8' : '#5f6368'}}>
              <span style={styles.navIcon}>{op.icono}</span> {op.nombre}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>A</div>
            <div>
              <div style={styles.userName}>Andres</div>
              <div style={styles.userRole}>Administrador</div>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <h2 style={styles.viewTitle}>{vistaActual}</h2>
          <div style={styles.statusOnline}>🟢 Sistema Activo</div>
        </header>

        <div style={styles.workspace}>
          {/* INICIO */}
          {vistaActual === 'Inicio' && (
            <div style={styles.inicioGrid}>
              {menuOpciones.filter(o => o.nombre !== 'Inicio').map(op => (
                <button key={op.nombre} style={styles.moduloCard} onClick={() => setVistaActual(op.nombre)}>
                  <div style={{...styles.moduloIcon, color: op.color}}>{op.icono}</div>
                  <div style={styles.moduloNombre}>{op.nombre}</div>
                </button>
              ))}
            </div>
          )}

          {/* PRODUCTOS (ESTILO SICAR) */}
          {vistaActual === 'Productos' && (
            <div style={styles.productosContainer}>
              <div style={styles.searchHeader}>
                <div style={styles.searchWrapper}>
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o código..." 
                    style={styles.searchInput}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  <button style={styles.filterBtn}>🧪</button>
                </div>
                <button style={styles.addBtn}>+</button>
              </div>

              <div style={styles.productList}>
                {productosFiltrados.map(p => (
                  <div key={p.id} style={styles.productRow}>
                    <img src={p.img} alt={p.nombre} style={styles.prodImg} />
                    <div style={styles.prodMainInfo}>
                      <div style={styles.prodMeta}>
                        <span style={styles.prodUnidad}>{p.unidad}</span>
                        <span style={styles.prodId}>{p.id}</span>
                      </div>
                      <div style={styles.prodNombre}>{p.nombre}</div>
                      <div style={styles.prodStock}>{p.stock}</div>
                    </div>
                    <div style={styles.prodPrecio}>${p.precio.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  appContainer: { display: 'flex', height: '100vh', backgroundColor: '#f1f3f4', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#fff', borderRight: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '20px', borderBottom: '1px solid #f1f3f4', display: 'flex', gap: '10px', alignItems: 'center' },
  logoCircle: { width: '40px', height: '40px', backgroundColor: '#1a73e8', borderRadius: '50%', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  sucursalNombre: { fontWeight: 'bold', fontSize: '14px' },
  sucursalUbicacion: { fontSize: '10px', color: '#70757a' },
  sidebarNav: { flex: 1, padding: '10px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', marginBottom: '5px' },
  navIcon: { marginRight: '10px' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #f1f3f4' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '30px', height: '30px', backgroundColor: '#1a73e8', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  userName: { fontSize: '13px', fontWeight: 'bold' },
  userRole: { fontSize: '11px', color: '#70757a' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  viewTitle: { fontSize: '18px', color: '#1a73e8' },
  statusOnline: { fontSize: '11px', color: '#1e8e3e', fontWeight: 'bold' },
  workspace: { flex: 1, overflowY: 'auto' },
  inicioGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', padding: '40px' },
  moduloCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #dadce0', cursor: 'pointer', textAlign: 'center' },
  moduloIcon: { fontSize: '40px', marginBottom: '10px' },
  moduloNombre: { fontWeight: 'bold' },
  productosContainer: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  searchHeader: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchWrapper: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #dadce0', padding: '0 10px' },
  searchInput: { flex: 1, padding: '12px', border: 'none', outline: 'none', fontSize: '14px' },
  filterBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  addBtn: { backgroundColor: '#1e8e3e', color: '#fff', border: 'none', width: '45px', borderRadius: '8px', fontSize: '24px', cursor: 'pointer' },
  productList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  productRow: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #dadce0', gap: '15px' },
  prodImg: { width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' },
  prodMainInfo: { flex: 1 },
  prodMeta: { fontSize: '11px', color: '#70757a', marginBottom: '2px' },
  prodUnidad: { fontWeight: 'bold', marginRight: '8px', color: '#202124' },
  prodNombre: { fontSize: '14px', color: '#202124', marginBottom: '2px' },
  prodStock: { fontSize: '12px', color: '#9aa0a6' },
  prodPrecio: { fontSize: '16px', fontWeight: 'bold', color: '#202124' }
};

export default POS_Andres_Elite;
