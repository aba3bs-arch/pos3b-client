import React, { useState } from 'react';

const POS_Corporativo = () => {
  const [vistaActual, setVistaActual] = useState('Ventas');
  const [carrito, setCarrito] = useState([]);
  const [sucursal, setSucursal] = useState('3B2');

  const menuOpciones = [
    { nombre: 'Inicio', icono: '🏠' },
    { nombre: 'Ventas', icono: '📑' },
    { nombre: 'Cotizaciones', icono: '📄' },
    { nombre: 'Compras', icono: '🛒' },
    { nombre: 'Productos', icono: '📦' },
    { nombre: 'Clientes', icono: '👤' },
    { nombre: 'Usuarios', icono: '👥' },
    { nombre: 'Proveedores', icono: '🚛' },
    { nombre: 'Consultas', icono: '📁' },
  ];

  const productos = [
    { id: 1, nombre: 'Gomitas', precio: 20, img: 'https://images.unsplash.com/photo-1582050041567-9cfdd330d545?w=100' },
    { id: 2, nombre: 'Mazapan Original', precio: 12, img: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=100' },
    { id: 3, nombre: 'Salsa Valentina', precio: 7, img: 'https://images.unsplash.com/photo-1626078297492-b7ca55294561?w=100' },
  ];

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const agregarAlCarrito = (p) => {
    const existe = carrito.find(i => i.id === p.id);
    if (existe) {
      setCarrito(carrito.map(i => i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setCarrito([...carrito, { ...p, cantidad: 1 }]);
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* MENU LATERAL (SIDEBAR) */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoCircle}>3B</div>
          <div>
            <div style={styles.sucursalNombre}>{sucursal}</div>
            <div style={styles.sucursalUbicacion}>NOGALES, SONORA</div>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          {menuOpciones.map((opcion) => (
            <button
              key={opcion.nombre}
              onClick={() => setVistaActual(opcion.nombre)}
              style={{
                ...styles.navItem,
                backgroundColor: vistaActual === opcion.nombre ? '#e8f0fe' : 'transparent',
                color: vistaActual === opcion.nombre ? '#1a73e8' : '#5f6368',
                fontWeight: vistaActual === opcion.nombre ? 'bold' : 'normal',
              }}
            >
              <span style={styles.navIcon}>{opcion.icono}</span>
              {opcion.nombre}
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.btnLogout}>🚪 Cerrar Sesión</button>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>M</div>
            <div>
              <div style={styles.userName}>Misael</div>
              <div style={styles.userRole}>Administrador</div>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <h2 style={styles.viewTitle}>{vistaActual}</h2>
          <div style={styles.topBarActions}>
            <div style={styles.statusOnline}>🟢 Sistema Operativo</div>
          </div>
        </header>

        <div style={styles.workspace}>
          {vistaActual === 'Ventas' ? (
            <div style={styles.ventasLayout}>
              <section style={styles.productSection}>
                <div style={styles.grid}>
                  {productos.map(p => (
                    <div key={p.id} onClick={() => agregarAlCarrito(p)} style={styles.productCard}>
                      <img src={p.img} alt={p.nombre} style={styles.productImg} />
                      <div style={styles.productInfo}>
                        <div style={styles.productPrice}>${p.precio}.00</div>
                        <div style={styles.productName}>{p.nombre}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside style={styles.ticketSection}>
                <div style={styles.ticketHeader}>DETALLE DE VENTA</div>
                <div style={styles.ticketItems}>
                  {carrito.map(item => (
                    <div key={item.id} style={styles.ticketItem}>
                      <span>{item.nombre} x{item.cantidad}</span>
                      <strong>${item.precio * item.cantidad}</strong>
                    </div>
                  ))}
                </div>
                <div style={styles.ticketFooter}>
                  <div style={styles.totalRow}>
                    <span>TOTAL</span>
                    <span style={styles.totalValue}>${total}.00</span>
                  </div>
                  <button style={styles.btnCobrar} disabled={carrito.length === 0}>
                    COBRAR AHORA
                  </button>
                </div>
              </aside>
            </div>
          ) : (
            <div style={styles.placeholderView}>
              <h3>Módulo de {vistaActual}</h3>
              <p>Esta sección está en desarrollo para la próxima actualización.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  appContainer: { display: 'flex', height: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '25px 20px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', gap: '12px' },
  logoCircle: { width: '45px', height: '45px', backgroundColor: '#1a73e8', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' },
  sucursalNombre: { fontWeight: 'bold', color: '#202124', fontSize: '15px' },
  sucursalUbicacion: { fontSize: '11px', color: '#70757a' },
  sidebarNav: { flex: 1, padding: '10px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', marginBottom: '4px', fontSize: '14px', transition: '0.2s' },
  navIcon: { marginRight: '12px', fontSize: '18px' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #f1f3f4' },
  btnLogout: { width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #dadce0', borderRadius: '6px', cursor: 'pointer', color: '#d93025', fontWeight: 'bold', marginBottom: '15px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '35px', height: '35px', backgroundColor: '#e8f0fe', color: '#1a73e8', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  userName: { fontSize: '13px', fontWeight: 'bold', color: '#202124' },
  userRole: { fontSize: '11px', color: '#70757a' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px' },
  viewTitle: { fontSize: '20px', margin: 0, color: '#1a73e8' },
  statusOnline: { fontSize: '12px', color: '#1e8e3e', fontWeight: 'bold' },
  workspace: { flex: 1, overflow: 'hidden' },
  ventasLayout: { display: 'flex', height: '100%' },
  productSection: { flex: 1, padding: '25px', overflowY: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' },
  productCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #dadce0', cursor: 'pointer', overflow: 'hidden', textAlign: 'center', transition: '0.2s' },
  productImg: { width: '100%', height: '110px', objectFit: 'cover' },
  productInfo: { padding: '12px' },
  productPrice: { fontWeight: 'bold', fontSize: '18px', color: '#202124' },
  productName: { fontSize: '12px', color: '#5f6368', marginTop: '4px' },
  ticketSection: { width: '380px', backgroundColor: '#ffffff', borderLeft: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  ticketHeader: { padding: '20px', fontWeight: 'bold', borderBottom: '1px solid #f1f3f4', color: '#1a73e8', letterSpacing: '1px' },
  ticketItems: { flex: 1, padding: '20px', overflowY: 'auto' },
  ticketItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8f9fa' },
  ticketFooter: { padding: '25px', backgroundColor: '#f8f9fa' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  totalValue: { fontSize: '32px', fontWeight: 'bold', color: '#1a73e8' },
  btnCobrar: { width: '100%', padding: '18px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)' },
  placeholderView: { padding: '50px', textAlign: 'center', color: '#70757a' }
};

export default POS_Corporativo;
