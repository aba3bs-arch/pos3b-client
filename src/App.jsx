import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conector oficial de Supabase para Abarrotes Las 3B
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const POS_Andres_Conectado = () => {
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [sucursal, setSucursal] = useState('3B2');
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f8f9fa' };

  // 1. CARGAR PRODUCTOS DESDE LA BASE DE DATOS
  useEffect(() => {
    async function obtenerProductos() {
      const { data, error } = await supabase.from('productos').select('*');
      if (error) console.error("Error cargando productos:", error);
      else setInventario(data);
      setCargando(false);
    }
    obtenerProductos();
  }, []);

  // 2. FUNCIÓN PARA REGISTRAR VENTA REAL
  const finalizarVenta = async () => {
    if (carrito.length === 0) return;
    
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    const { error } = await supabase.from('ventas').insert([
      { 
        sucursal: sucursal, 
        total: total, 
        articulos: carrito,
        vendedor: 'Andres',
        creado_at: new Date() 
      }
    ]);

    if (!error) {
      alert("✅ VENTA REGISTRADA EN NUBE");
      setCarrito([]);
    } else {
      alert("❌ ERROR AL CONECTAR CON NUBE");
    }
  };

  const filtrados = useMemo(() => {
    return inventario.filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.id?.includes(busqueda));
  }, [busqueda, inventario]);

  if (cargando) return <div style={{padding: '50px', textAlign: 'center'}}>Conectando a la base de datos de Las 3B...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo, fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: `4px solid ${c.ocre}` }}>
          <img src={logoUrl} alt="Logo 3B" style={{ width: '80px' }} />
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{sucursal}</div>
        </div>
        <nav style={{ flex: 1, padding: '10px' }}>
          {['Inicio', 'Ventas', 'Productos', 'Clientes'].map(op => (
            <button key={op} onClick={() => setVistaActual(op)} 
              style={{ display: 'flex', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '5px', backgroundColor: vistaActual === op ? c.azul : 'transparent', color: vistaActual === op ? '#fff' : '#555' }}>
              {op}
            </button>
          ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #eee', fontWeight: 'bold' }}>Admin: Andres</div>
      </aside>

      {/* ÁREA DE TRABAJO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '60px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', borderBottom: '1px solid #ddd' }}>
          <h2 style={{ color: c.azul }}>{vistaActual}</h2>
          <div style={{color: '#1e8e3e', fontWeight: 'bold'}}>SISTEMA EN LÍNEA</div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {vistaActual === 'Ventas' && (
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 2 }}>
                <input type="text" placeholder="Escanea o busca..." style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd' }} value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', marginTop: '20px' }}>
                  {filtrados.map(p => (
                    <div key={p.id} onClick={() => setCarrito([...carrito, {...p, cantidad: 1}])} style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' }}>
                      <b style={{color: c.rojo}}>${p.precio}</b>
                      <p style={{fontSize: '12px'}}>{p.nombre}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{ width: '300px', background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
                <h3>TICKET</h3>
                <div style={{ flex: 1 }}>
                  {carrito.map((i, idx) => <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}><span>{i.nombre}</span><span>${i.precio}</span></div>)}
                </div>
                <div style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'right', borderTop: `2px solid ${c.azul}` }}>
                  ${carrito.reduce((a, b) => a + b.precio, 0)}.00
                </div>
                <button onClick={finalizarVenta} style={{ width: '100%', padding: '15px', background: c.azul, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px' }}>COBRAR</button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default POS_Andres_Conectado;
