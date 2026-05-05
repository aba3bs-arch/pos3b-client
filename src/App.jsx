import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Andres Marrero Ramos
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Ventas');
  const [sucursal, setSucursal] = useState('3B2'); //
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // CONFIGURACIÓN Y MULTIMONEDA
  const [tipoCambio, setTipoCambio] = useState(17.50);
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [pagoCon, setPagoCon] = useState('');
  const [monedaPago, setMonedaPago] = useState('MXN');
  const [mostrarCobro, setMostrarCobro] = useState(false);

  // ESTADOS DE ALTA (PRODUCTOS/USUARIOS)
  const [nuevoProd, setNuevoProd] = useState({ id: '', nombre: '', precio: 0, costo: 0, stock: 0, cat: 'GENERAL' });
  const [nuevoUser, setNuevoUser] = useState({ nombre: '', pin: '', rol: 'Cajero' });

  // Logo estable para Nogales
  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693=s400?authuser=0";

  useEffect(() => { if (sesion) cargarDatos(); }, [sesion]);

  const cargarDatos = async () => {
    const { data } = await supabase.from('productos').select('*').order('nombre');
    setInventario(data || []);
  };

  const totalMXN = useMemo(() => carrito.reduce((acc, p) => acc + (p.precio || 0), 0), [carrito]);
  const cambioMXN = useMemo(() => {
    const monto = parseFloat(pagoCon) || 0;
    return monedaPago === 'USD' ? (monto * tipoCambio) - totalMXN : monto - totalMXN;
  }, [pagoCon, monedaPago, totalMXN, tipoCambio]);

  const manejarLogin = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
    if (data) {
      setUser(data); setSesion(true); setPin('');
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal, evento: 'ENTRADA' }]);
    } else { alert("PIN Incorrecto"); setPin(''); }
  };

  const finalizarVenta = async () => {
    if (cambioMXN < 0) return alert("Monto insuficiente");
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user.nombre, sucursal_id: sucursal, total: totalMXN,
      metodo_pago: `Efectivo ${monedaPago}`, articulos: carrito
    }]);
    if (!error) {
      alert("Venta guardada"); setCarrito([]); setMostrarCobro(false); setPagoCon(''); cargarDatos();
    }
  };

  if (!sesion) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#c8b444' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' }}>
        <img src={logoUrl} style={{ width: '150px' }} alt="3B" />
        <h2 style={{ color: '#3b69b5' }}>ACCESO LAS 3B</h2>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e=>e.key==='Enter' && manejarLogin()} style={{ width: '100%', padding: '15px', fontSize: '28px', textAlign: 'center', margin: '20px 0', borderRadius: '12px' }} />
        <button onClick={manejarLogin} style={{ width: '100%', padding: '15px', background: '#3b69b5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7f6' }}>
      {sidebarOpen && (
        <aside style={{ width: '250px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', textAlign: 'center', borderBottom: '4px solid #c8b444' }}><b>ABARROTES 3B</b></div>
          <nav style={{ flex: 1, padding: '10px' }}>
            {['Ventas', 'Productos', 'Compras', 'Checador', 'Usuarios', 'Reportes', 'Configuracion'].map(m => (
              <button key={m} onClick={() => setVista(m)} style={{ display: 'block', width: '100%', padding: '12px', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '8px', marginBottom: '5px', background: vista === m ? '#e8f0fe' : 'none', color: vista === m ? '#3b69b5' : '#555' }}>{m}</button>
            ))}
          </nav>
        </aside>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #ddd' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{fontSize: '24px', border: 'none', background: 'none'}}>☰</button>
          <h2 style={{ marginLeft: '15px', flex: 1 }}>{vista}</h2>
          <div style={{marginRight: '20px'}}><b>Dólar: ${tipoCambio}</b></div>
          <button onClick={() => setSesion(false)} style={{background: '#ff0000', color: '#fff', padding: '8px 15px', border: 'none', borderRadius: '8px'}}>SALIR</button>
        </header>

        <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
          {vista === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="Escanee producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px', marginTop: '20px' }}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={{ background: '#fff', padding: '15px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer', border: '1px solid #eee' }}>
                      <b style={{color: '#ff0000'}}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{ width: '320px', background: '#fff', padding: '25px', borderRadius: '15px', border: '1px solid #ddd' }}>
                <h3>TICKET</h3>
                <div style={{flex: 1, overflowY: 'auto'}}>{carrito.map((it, i) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}><span>{it.nombre}</span><b>${it.precio}</b></div>)}</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b69b5', marginTop: '15px' }}>TOTAL: ${totalMXN}</div>
                {mostrarCobro ? (
                  <div>
                    <select value={monedaPago} onChange={e => setMonedaPago(e.target.value)} style={{width: '100%', padding: '10px', margin: '10px 0'}}>
                      <option value="MXN">Pesos (MXN)</option><option value="USD">Dólares (USD)</option>
                    </select>
                    <input type="number" placeholder="Paga con..." value={pagoCon} onChange={e => setPagoCon(e.target.value)} style={{width: '100%', padding: '10px'}} />
                    <div style={{color: '#1e8e3e', fontWeight: 'bold', marginTop: '10px'}}>CAMBIO: ${cambioMXN.toFixed(2)} MXN</div>
                    <button onClick={finalizarVenta} style={{width: '100%', padding: '15px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '10px', marginTop: '10px'}}>FINALIZAR</button>
                  </div>
                ) : <button onClick={() => setMostrarCobro(true)} style={{width: '100%', padding: '20px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '15px', fontSize: '20px', marginTop: '15px'}}>COBRAR</button>}
              </aside>
            </div>
          )}

          {/* MÓDULOS DE GESTIÓN (USUARIOS, PRODUCTOS, CONFIG) */}
          {vista === 'Productos' && (
            <div style={{background: '#fff', padding: '30px', borderRadius: '20px'}}>
              <h3>Alta de Productos</h3>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '20px 0'}}>
                <input placeholder="Código" value={nuevoProd.id} onChange={e=>setNuevoProd({...nuevoProd, id: e.target.value})} style={{padding: '12px'}} />
                <input placeholder="Nombre" value={nuevoProd.nombre} onChange={e=>setNuevoProd({...nuevoProd, nombre: e.target.value})} style={{padding: '12px'}} />
                <input type="number" placeholder="Precio" value={nuevoProd.precio} onChange={e=>setNuevoProd({...nuevoProd, precio: parseFloat(e.target.value)})} style={{padding: '12px'}} />
                <input type="number" placeholder="Stock" value={nuevoProd.stock} onChange={e=>setNuevoProd({...nuevoProd, stock: parseInt(e.target.value)})} style={{padding: '12px'}} />
              </div>
              <button onClick={async () => { await supabase.from('productos').upsert([nuevoProd]); alert("Guardado"); cargarDatos(); }} style={{padding: '15px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '10px'}}>GUARDAR</button>
            </div>
          )}

          {vista === 'Configuracion' && (
            <div style={{background: '#fff', padding: '30px', borderRadius: '20px'}}>
              <h3>Configuración del Sistema</h3>
              <label><b>Tipo de Cambio (Manual):</b></label>
              <input type="number" value={tipoCambio} onChange={e => setTipoCambio(parseFloat(e.target.value))} style={{display: 'block', padding: '10px', margin: '10px 0'}} />
              <label><b>Sucursal:</b></label>
              <select value={sucursal} onChange={e => setSucursal(e.target.value)} style={{display: 'block', padding: '10px', margin: '10px 0'}}>
                {['3B1','3B2','3B3','3B4','3B5','3B6','3B7','3B8'].map(s => <option key={s} value={s}>Sucursal {s}</option>)}
              </select>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
