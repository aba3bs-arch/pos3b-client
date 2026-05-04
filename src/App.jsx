import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Identidad y Seguridad
const supabase = createClient('TU_SUPABASE_URL', 'TU_SUPABASE_ANON_KEY');

const POS_Las3B_Andres = () => {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [pin, setPin] = useState('');
  const [vistaActual, setVistaActual] = useState('Inicio');
  const [inventario, setInventario] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const logoUrl = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', rojo: '#ff0000', ocre: '#c8b444', fondo: '#f4f4f4' };

  // Validación de Acceso por Turno
  const acceder = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('pin', pin)
      .single();

    if (data) {
      setUsuarioActual(data);
      setSesionIniciada(true);
      setPin('');
    } else {
      alert("PIN Incorrecto. Verifique sus credenciales.");
      setPin('');
    }
  };

  // Pantalla de Inicio de Sesión
  if (!sesionIniciada) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '350px' }}>
          <img src={logoUrl} alt="Las 3B" style={{ width: '120px' }} />
          <h2 style={{ color: c.azul }}>SISTEMA LAS 3B</h2>
          <input 
            type="password" 
            placeholder="PIN DE ACCESO" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            style={{ width: '100%', padding: '15px', textAlign: 'center', fontSize: '24px', borderRadius: '10px', margin: '20px 0' }}
            onKeyPress={(e) => e.key === 'Enter' && acceder()}
          />
          <button onClick={acceder} style={{ width: '100%', padding: '15px', backgroundColor: c.azul, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
            INICIAR TURNO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: c.fondo, fontFamily: 'sans-serif' }}>
      {/* Sidebar con tu perfil: Andres */}
      <aside style={{ width: '260px', backgroundColor: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: `4px solid ${c.ocre}` }}>
          <img src={logoUrl} style={{ width: '70px' }} />
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>SUCURSAL: {usuarioActual.sucursal_asignada}</div>
        </div>
        
        <nav style={{ flex: 1, padding: '15px' }}>
          {['Inicio', 'Ventas', 'Productos', 'Usuarios', 'Corte'].map(m => (
            <button key={m} onClick={() => setVistaActual(m)} style={{ display: 'block', width: '100%', padding: '12px', border: 'none', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', backgroundColor: vistaActual === m ? c.azul : 'transparent', color: vistaActual === m ? '#fff' : '#555', marginBottom: '5px' }}>
              {m}
            </button>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', backgroundColor: c.azul, color: '#fff', borderRadius: '50%', textAlign: 'center', lineHeight: '35px' }}>A</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Andres</div>
            <div style={{ fontSize: '11px', color: '#888' }}>{usuarioActual.rol}</div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '30px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ color: c.azul, margin: 0 }}>{vistaActual}</h1>
          <button onClick={() => setSesionIniciada(false)} style={{ color: c.rojo, background: 'none', border: 'none', cursor: 'pointer' }}>Cerrar Turno</button>
        </header>
        <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '30px', borderRadius: '15px', height: '80%' }}>
          {/* Contenido de los módulos */}
          <h3>Bienvenido al panel de control, Andres.</h3>
          <p>Módulo de {vistaActual} listo para operar.</p>
        </div>
      </main>
    </div>
  );
};

export default POS_Las3B_Andres;
