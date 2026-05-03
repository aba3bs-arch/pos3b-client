import React, { useState, useMemo } from 'react';

const POS_Andres_Final = () => {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693"; // ID de la imagen del logo proporcionado
  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

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

  const inventario = [
    { id: '7501030409854', unidad: 'PZA', nombre: 'NITO DUO 124G', precio: 30, costo: 22, stock: 3, cat: 'BOTANAS', img: 'https://via.placeholder.com/60?text=Nito' },
    { id: '7501055305704', unidad: 'CAJA', nombre: 'COCA COLA LIGHT 500ML', precio: 20, costo: 15, stock: 6, cat: 'BEBIDAS', img: 'https://via.placeholder.com/60?text=Coke' },
    { id: '64', unidad: 'PZA', nombre: 'Apotex Omeprazol 2 pcs', precio: 10, costo: 6, stock: 11, cat: 'ABARROTES', img: 'https://via.placeholder.com/60?text=Med' },
  ];

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
      {/* SIDEBAR CON LOGO OFICIAL */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img src={logoUrl} alt="Logo 3B" style={styles.logoImg} />
          <div>
            <div style={styles.sucursalNombre}>{sucursal}</div>
            <div style={styles.sucursalUbicacion}>NOGALES, SONORA</div>
          </div>
        </div>
        <nav style={styles.sidebarNav}>
          {menuOpciones.map((op) => (
            <button key={op.nombre} onClick={() => {setVistaActual(op.nombre); setBusqueda(''); setProductoSeleccionado(null);}} style={{...styles.navItem, backgroundColor: vistaActual === op.nombre ? '#e8f0fe' : 'transparent', color: vistaActual === op.nombre ? '#1a73e8' : '#5f6368'}}>
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

      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <h2 style={styles.viewTitle}>{vistaActual}</h2>
          <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.selectTop}>
            {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </header>

        <div style={styles.workspace}>
          {/* MÓDULO INICIO */}
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

          {/* MÓDULO VENTAS */}
          {vistaActual === 'Ventas' && (
            <div style={styles.flexLayout}>
              <div style={styles.prodVentaArea}>
                <input type="text" placeholder="Buscar producto para vender..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
                <div style={styles.gridVenta}>
                  {filtrados.map(p => (
                    <div key={p.id} style={styles.cardVenta} onClick={() => agregarAlCarrito(p)}>
                      <img src={p.img} style={styles.imgVenta} alt={p.nombre}/>
                      <b>${p.precio}</b>
                      <p style={{fontSize:'12px'}}>{p.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={styles.ticketArea}>
                <div style={styles.ticketHeader}>TICKET</div>
                <div style={styles.ticketScroll}>
                  {carrito.map(item => (
                    <div key={item.id} style={styles.ticketRow}>
                      <span>{item.nombre} x{item.cantidad}</span>
                      <span>${item.precio * item.cantidad}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.ticketTotal}>${totalVenta}.00</div>
                <button style={styles.btnPagar}>COBRAR</button>
              </aside>
            </div>
          )}

          {/* MÓDULO PRODUCTOS CON DETALLES */}
          {vistaActual === 'Productos' && (
            <div style={styles.flexLayout}>
              <div style={{...styles.prodListaArea, flex: productoSeleccionado ? 1.5 : 3}}>
                <div style={styles.searchHeader}>
                  <input type="text" placeholder="Buscar en inventario..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
                  <button style={styles.addBtn}>+</button>
                </div>
                <div style={styles.prodLista}>
                  {filtrados.map(p => (
                    <div key={p.id} onClick={() => setProductoSeleccionado(p)} style={{...styles.rowProd, border: productoSeleccionado?.id === p.id ? '2px solid #1a73e8' : '1px solid #dadce0'}}>
                      <img src={p.img} style={styles.imgLista} alt={p.nombre}/>
                      <div style={{flex:1}}>
                        <div style={styles.metaProd}>{p.unidad} | {p.id}</div>
                        <div style={styles.nombreProd}>{p.nombre}</div>
                        <div style={styles.stockProd}>En existencia: {p.stock}</div>
                      </div>
                      <div style={styles.precioProd}>${p.precio.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* PANEL DE PROPIEDADES (ESTILO SICAR) */}
              {productoSeleccionado && (
                <aside style={styles.detallesPanel}>
                  <div style={styles.detallesHeader}>
                    <span>Propiedades del Producto</span>
                    <button onClick={()=>setProductoSeleccionado(null)} style={styles.closeBtn}>✕</button>
                  </div>
                  <div style={styles.detallesContent}>
                    <img src={productoSeleccionado.img} style={styles.detallesImg} alt="preview"/>
                    <div style={styles.datoGrupo}>
                      <label>Descripción</label>
                      <input readOnly value={productoSeleccionado.nombre} style={styles.detallesInput} />
                    </div>
                    <div style={styles.datoGrupo}>
                      <label>Código de Barras</label>
                      <input readOnly value={productoSeleccionado.id} style={styles.detallesInput} />
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                      <div style={styles.datoGrupo}>
                        <label>Costo</label>
                        <input readOnly value={`$${productoSeleccionado.costo}`} style={{...styles.detallesInput, color:'#d93025'}} />
                      </div>
                      <div style={styles.datoGrupo}>
                        <label>Precio Venta</label>
                        <input readOnly value={`$${productoSeleccionado.precio}`} style={{...styles.detallesInput, color:'#1e8e3e'}} />
                      </div>
                    </div>
                    <div style={styles.datoGrupo}>
                      <label>Departamento / Categoría</label>
                      <input readOnly value={productoSeleccionado.cat} style={styles.detallesInput} />
                    </div>
                    <div style={styles.datoGrupo}>
                      <label>Unidad de Medida</label>
                      <input readOnly value={productoSeleccionado.unidad} style={styles.detallesInput} />
                    </div>
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

const styles = {
  appContainer: { display: 'flex', height: '100vh', backgroundColor: '#f1f3f4', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#fff', borderRight: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '20px', borderBottom: '1px solid #f1f3f4', display: 'flex', gap: '15px', alignItems: 'center' },
  logoImg: { width: '50px', height: '50px', borderRadius: '8px', objectFit: 'contain' },
  sucursalNombre: { fontWeight: 'bold', fontSize: '15px' },
  sucursalUbicacion: { fontSize: '10px', color: '#70757a' },
  sidebarNav: { flex: 1, padding: '10px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', marginBottom: '5px', fontSize: '14px' },
  navIcon: { marginRight: '10px', fontSize: '18px' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #f1f3f4' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '35px', height: '35px', backgroundColor: '#1a73e8', color: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  userName: { fontSize: '14px', fontWeight: 'bold' },
  userRole: { fontSize: '11px', color: '#70757a' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  viewTitle: { fontSize: '18px', color: '#1a73e8', fontWeight: 'bold' },
  selectTop: { padding: '5px', borderRadius: '4px', border: '1px solid #dadce0' },
  workspace: { flex: 1, overflow: 'hidden' },
  flexLayout: { display: 'flex', height: '100%' },
  // INICIO
  inicioGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', padding: '50px' },
  moduloCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #dadce0', cursor: 'pointer', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  moduloIcon: { fontSize: '40px', marginBottom: '10px' },
  moduloNombre: { fontWeight: 'bold' },
  // PRODUCTOS
  prodListaArea: { padding: '20px', overflowY: 'auto', borderRight: '1px solid #dadce0' },
  searchHeader: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #dadce0' },
  addBtn: { width: '50px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '24px', cursor: 'pointer' },
  prodLista: { display: 'flex', flexDirection: 'column', gap: '10px' },
  rowProd: { display: 'flex', gap: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', alignItems: 'center', cursor: 'pointer' },
  imgLista: { width: '50px', height: '50px', borderRadius: '8px' },
  metaProd: { fontSize: '11px', color: '#70757a' },
  nombreProd: { fontWeight: 'bold' },
  stockProd: { fontSize: '12px', color: '#1a73e8' },
  precioProd: { fontSize: '18px', fontWeight: 'bold' },
  // PANEL DETALLES
  detallesPanel: { width: '400px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #dadce0' },
  detallesHeader: { padding: '15px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  detallesContent: { padding: '20px', overflowY: 'auto' },
  detallesImg: { width: '120px', height: '120px', borderRadius: '8px', margin: '0 auto 20px auto', display: 'block', border: '1px solid #eee' },
  datoGrupo: { marginBottom: '15px', flex: 1 },
  detallesInput: { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', outline: 'none' },
  // VENTAS
  prodVentaArea: { flex: 1, padding: '20px', overflowY: 'auto' },
  gridVenta: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px', marginTop: '15px' },
  cardVenta: { backgroundColor: '#fff', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid #dadce0', cursor: 'pointer' },
  imgVenta: { width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  ticketArea: { width: '320px', backgroundColor: '#fff', borderLeft: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  ticketHeader: { padding: '15px', fontWeight: 'bold', borderBottom: '1px solid #dadce0' },
  ticketScroll: { flex: 1, padding: '15px', overflowY: 'auto' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' },
  ticketTotal: { padding: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '32px', color: '#1a73e8' },
  btnPagar: { margin: '15px', padding: '15px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default POS_Andres_Final;
