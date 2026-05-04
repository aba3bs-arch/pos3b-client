import React, { useState, useMemo } from 'react';

const POS_Andres_Mexico = () => {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProd, setNuevoProd] = useState({ id: '', nombre: '', precio: '', costo: '', stock: '', unidad: 'PZA', cat: 'ABARROTES' });

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693"; 
  const misSucursales = ['3B2', '3B3', '3B5', '3B6', '3B7', '3B9', '3B10', 'Fusion'];

  // Base de datos de productos populares en México
  const [inventario, setInventario] = useState([
    { id: '7501055300075', unidad: 'PZA', nombre: 'COCA COLA ORIGINAL 600ML', precio: 19, costo: 15, stock: 24, cat: 'BEBIDAS', img: 'https://via.placeholder.com/60?text=Coca' },
    { id: '7501031311309', unidad: 'PZA', nombre: 'PEPSI COLA 600ML', precio: 17, costo: 13, stock: 12, cat: 'BEBIDAS', img: 'https://via.placeholder.com/60?text=Pepsi' },
    { id: '7501020515311', unidad: 'PZA', nombre: 'LECHE LALA ENTERA 1L', precio: 28, costo: 24, stock: 30, cat: 'LACTEOS', img: 'https://via.placeholder.com/60?text=Lala' },
    { id: '7501011131018', unidad: 'PZA', nombre: 'PENAFIEL MINERAL 600ML', precio: 16, costo: 12, stock: 15, cat: 'BEBIDAS', img: 'https://via.placeholder.com/60?text=Mineral' },
    { id: '7501025400032', unidad: 'PZA', nombre: 'PANDITAS RICOLINO 45G', precio: 15, costo: 11, stock: 20, cat: 'CONFITERIA', img: 'https://via.placeholder.com/60?text=Pandas' },
    { id: '7501030409854', unidad: 'PZA', nombre: 'NITO DUO 124G', precio: 30, costo: 22, stock: 10, cat: 'PAN DULCE', img: 'https://via.placeholder.com/60?text=Nito' },
    { id: '7501000153101', unidad: 'PZA', nombre: 'ACEITE CAPULLO 1L', precio: 45, costo: 38, stock: 12, cat: 'ABARROTES', img: 'https://via.placeholder.com/60?text=Aceite' }
  ]);

  const menuOpciones = [
    { nombre: 'Inicio', icono: '🏠', color: '#1a73e8' },
    { nombre: 'Ventas', icono: '📑', color: '#1e8e3e' },
    { nombre: 'Productos', icono: '📦', color: '#8e24aa' },
    { nombre: 'Clientes', icono: '👤', color: '#00acc1' },
    { nombre: 'Compras', icono: '🛒', color: '#d93025' },
  ];

  const filtrados = useMemo(() => {
    return inventario.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.id.includes(busqueda));
  }, [busqueda, inventario]);

  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const guardarProducto = (e) => {
    e.preventDefault();
    setInventario([...inventario, { ...nuevoProd, precio: parseFloat(nuevoProd.precio), costo: parseFloat(nuevoProd.costo), stock: parseInt(nuevoProd.stock), img: 'https://via.placeholder.com/60?text=Nuevo' }]);
    setMostrarModal(false);
    setNuevoProd({ id: '', nombre: '', precio: '', costo: '', stock: '', unidad: 'PZA', cat: 'ABARROTES' });
  };

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

      <main style={styles.mainContent}>
        <header style={styles.topBar}>
          <h2 style={styles.viewTitle}>{vistaActual}</h2>
          <select value={sucursal} onChange={(e) => setSucursal(e.target.value)} style={styles.selectTop}>
            {misSucursales.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </header>

        <div style={styles.workspace}>
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

          {vistaActual === 'Ventas' && (
            <div style={styles.flexLayout}>
              <div style={styles.prodVentaArea}>
                <input type="text" placeholder="Escanea código o busca nombre..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} autoFocus />
                <div style={styles.gridVenta}>
                  {filtrados.map(p => (
                    <div key={p.id} style={styles.cardVenta} onClick={() => agregarAlCarrito(p)}>
                      <img src={p.img} style={styles.imgVenta} />
                      <b>${p.precio}</b>
                      <p style={{fontSize:'11px'}}>{p.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={styles.ticketArea}>
                <div style={styles.ticketHeader}>LISTA DE COBRO</div>
                <div style={styles.ticketScroll}>
                  {carrito.map(item => (
                    <div key={item.id} style={styles.ticketRow}>
                      <span>{item.nombre} x{item.cantidad}</span>
                      <span>${item.precio * item.cantidad}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.ticketTotal}>${totalVenta}.00</div>
                <button style={styles.btnPagar}>PAGAR [F10]</button>
              </aside>
            </div>
          )}

          {vistaActual === 'Productos' && (
            <div style={styles.flexLayout}>
              <div style={styles.prodListaArea}>
                <div style={styles.searchHeader}>
                  <input type="text" placeholder="Filtrar inventario..." style={styles.searchInput} value={busqueda} onChange={(e)=>setBusqueda(e.target.value)} />
                  <button onClick={() => setMostrarModal(true)} style={styles.addBtn}>+</button>
                </div>
                <div style={styles.prodLista}>
                  {filtrados.map(p => (
                    <div key={p.id} onClick={() => setProductoSeleccionado(p)} style={styles.rowProd}>
                      <img src={p.img} style={styles.imgLista} />
                      <div style={{flex:1}}>
                        <div style={styles.metaProd}>{p.unidad} | {p.id}</div>
                        <div style={styles.nombreProd}>{p.nombre}</div>
                        <div style={styles.stockProd}>Disp: {p.stock}</div>
                      </div>
                      <div style={styles.precioProd}>${p.precio.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {mostrarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Nuevo Producto</h3>
            <form onSubmit={guardarProducto} style={styles.modalForm}>
              <input placeholder="Código de Barras" required value={nuevoProd.id} onChange={e => setNuevoProd({...nuevoProd, id: e.target.value})} style={styles.formInput} />
              <input placeholder="Nombre del Producto" required value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} style={styles.formInput} />
              <div style={{display:'flex', gap:'10px'}}>
                <input placeholder="Costo" type="number" required value={nuevoProd.costo} onChange={e => setNuevoProd({...nuevoProd, costo: e.target.value})} style={styles.formInput} />
                <input placeholder="Precio" type="number" required value={nuevoProd.precio} onChange={e => setNuevoProd({...nuevoProd, precio: e.target.value})} style={styles.formInput} />
              </div>
              <input placeholder="Stock Inicial" type="number" required value={nuevoProd.stock} onChange={e => setNuevoProd({...nuevoProd, stock: e.target.value})} style={styles.formInput} />
              <button type="submit" style={styles.saveBtn}>Guardar en Inventario</button>
              <button type="button" onClick={() => setMostrarModal(false)} style={styles.cancelBtn}>Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  appContainer: { display: 'flex', height: '100vh', backgroundColor: '#f1f3f4', fontFamily: 'Segoe UI, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#fff', borderRight: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '20px', borderBottom: '1px solid #f1f3f4', display: 'flex', gap: '15px', alignItems: 'center' },
  logoImg: { width: '50px', height: '50px', objectFit: 'contain' },
  sucursalNombre: { fontWeight: 'bold' },
  sucursalUbicacion: { fontSize: '10px', color: '#70757a' },
  sidebarNav: { flex: 1, padding: '10px' },
  navItem: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', marginBottom: '5px' },
  navIcon: { marginRight: '10px' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #f1f3f4' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: { width: '30px', height: '30px', backgroundColor: '#1a73e8', color: '#fff', borderRadius: '50%', textAlign:'center', lineHeight:'30px', fontWeight:'bold' },
  userName: { fontSize: '14px', fontWeight: 'bold' },
  userRole: { fontSize: '11px', color: '#70757a' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  topBar: { height: '60px', backgroundColor: '#fff', borderBottom: '1px solid #dadce0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  viewTitle: { fontSize: '18px', color: '#1a73e8', fontWeight: 'bold' },
  selectTop: { padding: '5px', borderRadius: '4px' },
  workspace: { flex: 1, overflow: 'hidden' },
  flexLayout: { display: 'flex', height: '100%' },
  inicioGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', padding: '50px' },
  moduloCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', border: '1px solid #dadce0', cursor: 'pointer', textAlign: 'center' },
  moduloIcon: { fontSize: '40px', marginBottom: '10px' },
  moduloNombre: { fontWeight: 'bold' },
  prodVentaArea: { flex: 1, padding: '20px', overflowY: 'auto' },
  gridVenta: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '15px' },
  cardVenta: { backgroundColor: '#fff', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid #dadce0', cursor: 'pointer' },
  imgVenta: { width: '100%', height: '70px', objectFit: 'cover', borderRadius: '4px' },
  ticketArea: { width: '300px', backgroundColor: '#fff', borderLeft: '1px solid #dadce0', display: 'flex', flexDirection: 'column' },
  ticketHeader: { padding: '15px', fontWeight: 'bold', borderBottom: '1px solid #dadce0' },
  ticketScroll: { flex: 1, padding: '15px', overflowY: 'auto' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' },
  ticketTotal: { padding: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '28px', color: '#1a73e8' },
  btnPagar: { margin: '15px', padding: '15px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  prodListaArea: { flex: 1, padding: '20px', overflowY: 'auto' },
  searchHeader: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #dadce0' },
  addBtn: { width: '50px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '24px' },
  prodLista: { display: 'flex', flexDirection: 'column', gap: '8px' },
  rowProd: { display: 'flex', gap: '15px', backgroundColor: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #dadce0', alignItems:'center' },
  imgLista: { width: '45px', height: '45px', borderRadius: '6px' },
  metaProd: { fontSize: '10px', color: '#70757a' },
  nombreProd: { fontWeight: 'bold', fontSize:'14px' },
  stockProd: { fontSize: '11px', color: '#1a73e8' },
  precioProd: { fontSize: '16px', fontWeight: 'bold' },
  modalOverlay: { position: 'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modalContent: { backgroundColor:'#fff', width:'400px', borderRadius:'12px', padding:'25px' },
  modalForm: { display:'flex', flexDirection:'column', gap:'15px' },
  formInput: { padding: '10px', borderRadius: '6px', border: '1px solid #dadce0' },
  saveBtn: { padding: '12px', backgroundColor: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' },
  cancelBtn: { padding: '8px', backgroundColor: '#eee', border: 'none', borderRadius: '6px' }
};

export default POS_Andres_Mexico;
