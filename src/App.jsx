import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión Oficial - Abarrotes Las 3B
const supabaseUrl = 'https://bablzxlaospziombkpdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmx6eGxhb3NwemlvbWJrcGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODk3OTUsImV4cCI6MjA5MzI2NTc5NX0.GOWpyIBGK8FdobF5_g3oRlW2_X_WOFk-ao8CQQVKkhg';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [sesion, setSesion] = useState(false);
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState('');
  const [vista, setVista] = useState('Inicio');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sucursal, setSucursal] = useState('3B2');

  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [pagoCon, setPagoCon] = useState('');
  const [metodo, setMetodo] = useState('EFECTIVO');
  const [mostrarCobro, setMostrarCobro] = useState(false);

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444', rojo: '#ff0000', verde: '#1e8e3e', fondo: '#f8f9fa' };

  useEffect(() => {
    if (sesion) cargarInventario();
  }, [sesion]);

  const cargarInventario = async () => {
    try {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) throw error;
      setInventario(data || []);
    } catch (err) {
      console.error("Error cargando inventario:", err.message);
    }
  };

  const manejarLogin = async () => {
    try {
      const { data, error } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
      if (error || !data) {
        alert("PIN Incorrecto o usuario no encontrado");
        setPin('');
        return;
      }
      setUser(data);
      setSesion(true);
      setPin('');
      await supabase.from('logins').insert([{ usuario_id: data.id, nombre: data.nombre, sucursal, evento: 'ENTRADA' }]);
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const totalVenta = useMemo(() => carrito.reduce((acc, p) => acc + (p.precio || 0), 0), [carrito]);
  const cambio = useMemo(() => (parseFloat(pagoCon) || 0) - totalVenta, [pagoCon, totalVenta]);

  const finalizarVenta = async () => {
    if (metodo === 'EFECTIVO' && cambio < 0) return alert("Monto insuficiente");
    
    const { error } = await supabase.from('ventas').insert([{
      vendedor: user?.nombre || 'Desconocido',
      sucursal_id: sucursal,
      total: totalVenta,
      metodo_pago: metodo,
      articulos: carrito
    }]);

    if (!error) {
      alert("Venta procesada");
      setCarrito([]);
      setMostrarCobro(false);
      setPagoCon('');
      cargarInventario();
    }
  };

  // --- RENDERIZADO CONDICIONAL ---
  if (!sesion) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' }}>
          <img src={logo} style={{ width: '130px' }} alt="Las 3B" />
          <h2 style={{ color: c.azul }}>LAS 3B - NOGALES</h2>
          <input 
            type="password" 
            placeholder="PIN" 
            value={pin} 
            onChange={e => setPin(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && manejarLogin()} 
            style={{ width: '100%', padding: '15px', fontSize: '28px', textAlign: 'center', borderRadius: '12px', border: '1px solid #ddd', margin: '20px 0' }} 
          />
          <button onClick={manejarLogin} style={{ width: '100%', padding: '15px', background: c.azul, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ENTRAR</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo }}>
      {sidebarOpen && (
        <aside style={{ width: '250px', background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', textAlign: 'center', borderBottom: '4px solid #c8b444' }}>
            <b style={{ color: c.azul }}>ABARROTES LAS 3B</b>
            <div style={{ background: '#f0f0f0', padding: '5px', borderRadius: '5px', fontSize: '12px', marginTop: '5px' }}>{sucursal}</div>
          </div>
          <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
            {['Inicio', 'Ventas', 'Productos', 'Compras', 'Reportes', 'Usuarios'].map(m => (
              <button 
                key={m} 
                onClick={() => setVista(m)} 
                style={{ display: 'block', width: '100%', padding: '12px', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', borderRadius: '8px', backgroundColor: vista === m ? '#e8f0fe' : 'transparent', color: vista === m ? c.azul : '#555' }}
              >
                {m}
              </button>
            ))}
          </nav>
          <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
            <b>{user?.nombre}</b><br/>
            <span style={{ fontSize: '10px' }}>v2.1.1</span>
          </div>
        </aside>
      )}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '65px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ fontSize: '22px', border: 'none', background: 'none', cursor: 'pointer' }}>☰</button>
          <h2 style={{ marginLeft: '15px', color: c.azul }}>{vista}</h2>
        </header>

        <div style={{ flex: 1, padding: '25px' }}>
          {vista === 'Ventas' ? (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <input type="text" placeholder="F1 - Buscar..." style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px', marginTop: '20px' }}>
                  {inventario.filter(p => p.cat === 'FAVORITOS').map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, p])} style={{ background: '#fff', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' }}>
                      <b style={{ color: c.rojo }}>${p.precio}</b><br/>{p.nombre}
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{ width: '320px', background: '#fff', padding: '20px', borderLeft: '1px solid #ddd' }}>
                <h3>TICKET</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: c.azul }}>TOTAL: ${totalVenta}.00</div>
                <button onClick={() => setMostrarCobro(true)} style={{ width: '100%', padding: '18px', background: c.verde, color: '#fff', border: 'none', borderRadius: '12px', marginTop: '15px', fontWeight: 'bold' }}>COBRAR</button>
              </aside>
            </div>
          ) : (
            <div style={{ background: '#fff', padding: '30px', borderRadius: '20px' }}>
              <h3>Módulo {vista}</h3>
              <p>Funcionalidad lista para operar en Nogales.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
