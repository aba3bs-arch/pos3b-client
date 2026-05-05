import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Andres Marrero Ramos
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  // --- ESTADOS DE SISTEMA ---
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Ventas');
  const [sucursal, setSucursal] = useState('3B2');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- CONFIGURACIÓN (TIPO DE CAMBIO) ---
  const [tipoCambio, setTipoCambio] = useState(17.50); // Valor manual ajustable

  // --- ESTADOS DE DATOS ---
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagoCon, setPagoCon] = useState('');
  const [monedaPago, setMonedaPago] = useState('MXN'); // MXN o USD
  const [mostrarCobro, setMostrarCobro] = useState(false);

  // --- ESTADOS PARA NUEVOS REGISTROS ---
  const [nuevoProd, setNuevoProd] = useState({ id: '', nombre: '', precio: 0, stock: 0, cat: 'GENERAL' });
  const [nuevoUser, setNuevoUser] = useState({ nombre: '', pin: '', rol: 'Cajero' });

  // URL de Logo corregida para visualización
  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693=s400?authuser=0";

  useEffect(() => {
    if (sesion) cargarDatos();
  }, [sesion]);

  const cargarDatos = async () => {
    const { data: prods } = await supabase.from('productos').select('*').order('nombre');
    setInventario(prods || []);
  };

  // --- LÓGICA DE COBRO MULTIMONEDA ---
  const totalMXN = useMemo(() => carrito.reduce((acc, p) => acc + (p.precio || 0), 0), [carrito]);
  
  const cambioMXN = useMemo(() => {
    const montoRecibido = parseFloat(pagoCon) || 0;
    if (monedaPago === 'USD') {
      return (montoRecibido * tipoCambio) - totalMXN;
    }
    return montoRecibido - totalMXN;
  }, [pagoCon, monedaPago, totalMXN, tipoCambio]);

  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUser(data);
      setSesion(true);
      setPin('');
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal, evento: 'ENTRADA' }]);
    } else { alert("PIN Incorrecto"); setPin(''); }
  };

  const finalizarVenta = async () => {
    if (cambioMXN < 0) return alert("Monto insuficiente");
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user.nombre,
      sucursal_id: sucursal,
      total: totalMXN,
      metodo_pago: `Efectivo ${monedaPago}`,
      articulos: carrito
    }]);
    if (!error) {
      alert(`Venta exitosa. Cambio: $${cambioMXN.toFixed(2)} MXN`);
      setCarrito([]); setMostrarCobro(false); setPagoCon(''); cargarDatos();
    }
  };

  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#c8b444' }}>
      <div style={s.cardLogin}>
        <img src={logoUrl} style={{ width: '150px', marginBottom: '20px' }} alt="Logo 3B" />
        <h2 style={{ color: '#3b69b5' }}>CONTROL 3B NOGALES</h2>
        <input type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={s.inputPin} />
        <button onClick={manejarLogin} style={s.btnBlue}>ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7f6' }}>
      {sidebarOpen && (
        <aside style={s.sidebar}>
          <div style={s.sideHeader}><b>ABARROTES 3B</b><div style={s.badge}>{sucursal}</div></div>
          <nav style={{ flex: 1, padding: '10px' }}>
            {['Ventas', 'Productos', 'Usuarios', 'Reportes', 'Configuracion'].map(m => (
              <button key={m} onClick={() => setVista(m)} style={{...s.navBtn, backgroundColor: vista === m ? '#e8f0fe' : 'transparent', color: vista === m ? '#3b69b5' : '#555'}}>{m}</button>
            ))}
          </nav>
        </aside>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={s.mainHeader}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{border:'none', background:'none', fontSize:'24px'}}>☰</button>
          <h2 style={{ marginLeft: '15px', color: '#3b69b5', flex: 1 }}>{vista}</h2>
          <div style={{marginRight: '20px'}}><b>T.C. $1 = {tipoCambio} MXN</b></div>
          <button onClick={() => setSesion(false)} style={s.btnRed}>SALIR</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          
          {/* MÓDULO VENTAS FRONTERIZO */}
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="Escanee o busque..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={s.inputBig} />
                <div style={s.gridFavs}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={s.favCard}>
                      <b style={{color: '#ff0000'}}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={s.ticketPanel}>
                <h3>TICKET</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>
                  {carrito.map((it, i) => <div key={i} style={s.ticketRow}><span>{it.nombre}</span><b>${it.precio}</b></div>)}
                </div>
                <div style={s.totalBox}>TOTAL: ${totalMXN} MXN</div>
                {mostrarCobro ? (
                  <div style={s.payPanel}>
                    <select value={monedaPago} onChange={e => setMonedaPago(e.target.value)} style={s.input}>
                      <option value="MXN">Pesos (MXN)</option>
                      <option value="USD">Dólares (USD)</option>
                    </select>
                    <select value={pagoCon} onChange={e => setPagoCon(e.target.value)} style={s.input}>
                      <option value="">Seleccione denominación...</option>
                      {monedaPago === 'MXN' ? 
                        [20,50,100,200,500,1000].map(d => <option key={d} value={d}>${d} Pesos</option>) :
                        [1,5,10,20,50,100].map(d => <option key={d} value={d}>${d} Dólares</option>)
                      }
                    </select>
                    <div style={{color: '#1e8e3e', fontWeight: 'bold'}}>CAMBIO: ${cambioMXN.toFixed(2)} MXN</div>
                    <button onClick={finalizarVenta} style={s.btnGreen}>FINALIZAR</button>
                  </div>
                ) : (
                  <button onClick={() => setMostrarCobro(true)} style={s.btnAction}>COBRAR</button>
                )}
              </aside>
            </div>
          )}

          {/* MÓDULO CONFIGURACIÓN */}
          {vista === 'Configuracion' && (
            <div style={s.card}>
              <h3>Ajustes del Punto de Venta</h3>
              <div style={{marginTop: '20px'}}>
                <label><b>Tipo de Cambio Manual (Dólar):</b></label>
                <input type="number" value={tipoCambio} onChange={e => setTipoCambio(parseFloat(e.target.value))} style={s.input} />
                <p><small>* El cambio siempre se entregará en Pesos (MXN) según este valor.</small></p>
              </div>
              <div style={{marginTop: '20px'}}>
                <label><b>Sucursal Activa:</b></label>
                <select value={sucursal} onChange={e => setSucursal(e.target.value)} style={s.input}>
                  {['3B1','3B2','3B3','3B4','3B5','3B6','3B7','3B8'].map(suc => <option key={suc} value={suc}>Sucursal {suc}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* MÓDULO USUARIOS */}
          {vista === 'Usuarios' && (
            <div style={s.card}>
              <h3>Gestión de Personal</h3>
              <div style={s.formGrid}>
                <input placeholder="Nombre completo" value={nuevoUser.nombre} onChange={e => setNuevoUser({...nuevoUser, nombre: e.target.value})} style={s.input} />
                <input placeholder="PIN (4 dígitos)" value={nuevoUser.pin} onChange={e => setNuevoUser({...nuevoUser, pin: e.target.value})} style={s.input} />
                <select value={nuevoUser.rol} onChange={e => setNuevoUser({...nuevoUser, rol: e.target.value})} style={s.input}>
                  <option value="Cajero">Cajero</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <button onClick={async () => {
                await supabase.from('usuarios').insert([nuevoUser]);
                alert("Usuario creado"); setNuevoUser({nombre:'', pin:'', rol:'Cajero'});
              }} style={s.btnBlue}>AÑADIR EMPLEADO</button>
            </div>
          )}

          {/* MÓDULO PRODUCTOS */}
          {vista === 'Productos' && (
            <div style={s.card}>
              <h3>Alta de Inventario</h3>
              <div style={s.formGrid}>
                <input placeholder="Código Barras" value={nuevoProd.id} onChange={e => setNuevoProd({...nuevoProd, id: e.target.value})} style={s.input} />
                <input placeholder="Nombre" value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} style={s.input} />
                <input type="number" placeholder="Precio" value={nuevoProd.precio} onChange={e => setNuevoProd({...nuevoProd, precio: parseFloat(e.target.value)})} style={s.input} />
                <input type="number" placeholder="Stock" value={nuevoProd.stock} onChange={e => setNuevoProd({...nuevoProd, stock: parseInt(e.target.value)})} style={s.input} />
                <select value={nuevoProd.cat} onChange={e => setNuevoProd({...nuevoProd, cat: e.target.value})} style={s.input}>
                  <option value="GENERAL">General</option>
                  <option value="FAVORITOS">Favorito</option>
                </select>
              </div>
              <button onClick={async () => {
                await supabase.from('productos').upsert([nuevoProd]);
                alert("Guardado"); setNuevoProd({id:'', nombre:'', precio:0, stock:0, cat:'GENERAL'}); cargarDatos();
              }} style={s.btnGreen}>GUARDAR</button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

const s = {
  cardLogin: { background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' },
  inputPin: { width: '100%', padding: '15px', fontSize: '28px', textAlign: 'center', letterSpacing: '10px', borderRadius: '12px', border: '1px solid #ddd', margin: '20px 0' },
  btnBlue: { width: '100%', padding: '15px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  btnRed: { background: '#ff0000', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  btnGreen: { width: '100%', padding: '15px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' },
  sidebar: { width: '250px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' },
  sideHeader: { padding: '20px', textAlign: 'center', borderBottom: '4px solid #c8b444' },
  badge: { background: '#f0f0f0', padding: '5px', borderRadius: '5px', fontSize: '10px', marginTop: '5px' },
  navBtn: { display: 'block', width: '100%', padding: '12px 20px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '10px' },
  mainHeader: { height: '70px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px' },
  inputBig: { width: '100%', padding: '18px', borderRadius: '15px', border: '1px solid #ddd', fontSize: '20px' },
  gridFavs: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px', marginTop: '20px' },
  favCard: { background: '#fff', padding: '15px', borderRadius: '15px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer' },
  ticketPanel: { width: '320px', background: '#fff', borderLeft: '1px solid #ddd', padding: '25px', display: 'flex', flexDirection: 'column' },
  ticketRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' },
  totalBox: { fontSize: '28px', fontWeight: 'bold', color: '#3b69b5', borderTop: '2px solid #3b69b5', marginTop: '15px' },
  btnAction: { width: '100%', padding: '20px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '20px' },
  payPanel: { background: '#f9f9f9', padding: '15px', borderRadius: '15px', marginTop: '10px' },
  input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' },
  card: { background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #ddd' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '20px 0' }
};

export default App;
