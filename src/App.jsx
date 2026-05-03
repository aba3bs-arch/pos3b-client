import React, { useState, useMemo } from 'react';

const POS_Andres_Completo = () => {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // Definición de módulos
  const menuOpciones = [
    { nombre: 'Inicio', icono: '🏠', color: '#1a73e8' },
    { nombre: 'Ventas', icono: '📑', color: '#1e8e3e' },
    { nombre: 'Cotizaciones', icono: '📄', color: '#f9ab00' },
    { nombre: 'Compras', icono: '🛒', color: '#d93025' },
    { nombre: 'Productos', icono: '📦', color: '#8e24aa' },
    { nombre: 'Clientes', icono: '👤', color: '#00acc1' },
    { nombre: 'Usuarios', icono: '👥', color: '#5f6368' },
    { nombre: 'Proveedores', icono: '🚛', color: '#fb8c00' },
    { nombre: 'Consultas', icono: '📁', color: '#455a64' },
  ];

  // Base de datos de productos (Inventario)
  const inventario = [
    { id: '7501030409854', unidad: 'PZA', nombre: 'NITO DUO 124G', precio: 30, stock: 3, img: 'https://via.placeholder.com/60?text=Nito', cat: 'BOTANAS' },
    { id: '7501055305704', unidad: 'CAJA', nombre: 'COCA COLA LIGHT 500ML', precio: 20, stock: 6, img: 'https://via.placeholder.com/60?text=Coke', cat: 'BEBIDAS' },
    { id: '64', unidad: 'PZA', nombre: 'Apotex Omeprazol 2 pcs', precio: 10, stock: 11, img: 'https://via.placeholder.com/60?text=Med', cat: 'ABARROTES' },
  ];

  // Lógica de búsqueda y carrito
  const filtrados = useMemo(() => {
    return inventario.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.id.includes(busqueda));
  }, [busqueda]);

  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

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
      {/* SIDEBAR FIJO */}
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
            <button key={op.nombre} onClick={() => {setVistaActual(op.nombre); setBusqueda('');}} style={{...styles.navItem, backgroundColor: vistaActual === op.nombre ? '#e8f0fe' : 'transparent', color: vistaActual === op.nombre ? '#1a73e8' : '#5f6368'}}>
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

      {/* ÁREA DE TRABAJO VARIABLE */}
      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <h2 style={styles.viewTitle}>{vistaActual}</h2>
          <div style={styles.topBarActions}>
            <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.selectTop}>
              {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </header>

        <div style={styles.workspace}>
          {/* MÓDULO: INICIO */}
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

          {/* MÓDULO: VENTAS */}
          {vistaActual === 'Ventas' && (
            <div style={styles.flexLayout}>
              <div style={styles.prodVentaArea}>
                <input type="text" placeholder="F1 - Buscar producto..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
                <div style={styles.gridVenta}>
                  {filtrados.map(p => (
                    <div key={p.id} style={styles.cardVenta} onClick={() => agregarAlCarrito(p)}>
                      <img src={p.img} style={styles.imgVenta} />
                      <b>${p.precio}</b>
                      <p>{p.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={styles.ticketArea}>
                <div style={styles.ticketHeader}>TICKET DE VENTA</div>
                <div style={styles.ticketScroll}>
                  {carrito.map(item => (
                    <div key={item.id} style={styles.ticketRow}>
                      <span>{item.nombre} x{item.cantidad}</span>
                      <span>${item.precio * item.cantidad}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.ticketTotal}>
                  <span>TOTAL:</span>
                  <span>${totalVenta}.00</span>
                </div>
                <button style={styles.btnPagar}>COBRAR [F10]</button>
              </aside>
            </div>
          )}

          {/* MÓDULO: PRODUCTOS */}
          {vistaActual === 'Productos' && (
            <div style={styles.productosLayout}>
              <div style={styles.searchHeader}>
                <input type="text" placeholder="Buscar por nombre o código..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
                <button style={styles.addBtn}>+</button>
              </div>
              <div style={styles.prodLista}>
                {filtrados.map(p => (
                  <div key={p.id} style={styles.rowProd}>
                    <img src={p.img} style={styles.imgLista} />
                    <div style={{flex:1}}>
                      <div style={styles.metaProd}>{p.unidad} | {p.id}</div>
                      <div style={styles.nombreProd}>{p.nombre}</div>
                      <div style={styles.stockProd}>Stock: {p.stock}</div>
                    </div>
                    <div style={styles.precioProd}>${p.precio.toFixed(2)}</div>
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
  navIcon: { marginRight: '10px', fontSize: '18px' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #f1f3f4' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '30px', height: '30px', backgroundColor: '#1a73e8', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  userName: { fontSize: '13px', fontWeight: 'bold' },
  userRole: { fontSize: '11px', color: '#70757a' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  viewTitle: { fontSize: '18px', color: '#1a73e8', fontWeight: 'bold' },
  selectTop: { padding: '5px', borderRadius: '4px', border: '1px solid #dadce0' },
  workspace: { flex: 1, overflow: 'hidden' },
  // ESTILOS INICIO
  inicioGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', padding: '60px', maxWidth: '1200px', margin: '0 auto' },
  moduloCard: { backgroundColor: 'white', borderRadius: '16px', padding: '40px 20px', border: '1px solid #dadce0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  moduloIcon: { fontSize: '48px' },
  moduloNombre: { fontWeight: 'bold', fontSize: '16px', color: '#3c4043' },
  // ESTILOS VENTAS
  flexLayout: { display: 'flex', height: '100%' },
  prodVentaArea: { flex: 1, padding: '20px', overflowY: 'auto' },
  gridVenta: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginTop: '15px' },
  cardVenta: { backgroundColor: '#fff', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid #dadce0', cursor: 'pointer' },
  imgVenta: { width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  ticketArea: { width: '350px', backgroundColor: '#fff', borderLeft: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  ticketHeader: { padding: '15px', fontWeight: 'bold', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dadce0' },
  ticketScroll: { flex: 1, padding: '15px', overflowY: 'auto' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
  ticketTotal: { padding: '20px', borderTop: '2px solid #1a73e8', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '24px' },
  btnPagar: { margin: '15px', padding: '15px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  // ESTILOS PRODUCTOS
  productosLayout: { padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' },
  searchHeader: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #dadce0' },
  addBtn: { width: '50px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '24px', cursor: 'pointer' },
  prodLista: { flex: 1, overflowY: 'auto' },
  rowProd: { display: 'flex', gap: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #dadce0', marginBottom: '10px', alignItems: 'center' },
  imgLista: { width: '60px', height: '60px', borderRadius: '8px' },
  metaProd: { fontSize: '11px', color: '#70757a' },
  nombreProd: { fontWeight: 'bold', color: '#202124' },
  stockProd: { fontSize: '12px', color: '#1a73e8' },
  precioProd: { fontSize: '18px', fontWeight: 'bold' }
};

export default POS_Andres_Completo;
