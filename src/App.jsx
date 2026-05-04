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
  const [sucursal, setSucursal] = useState('3B2');
  const [inventario, setInventario] = useState([]);

  const logo = "https://lh3.googleusercontent.com/d/1592398516086884693";
  const c = { azul: '#3b69b5', ocre: '#c8b444' };

  const manejarLogin = async () => {
    try {
      const { data, error } = await supabase.from('usuarios').select('*').eq('pin', pin).single();
      if (data) {
        setUser(data);
        setSesion(true);
        setPin('');
      } else {
        alert("PIN Incorrecto");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  if (!sesion) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: c.ocre }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '350px' }}>
          <img src={logo} style={{ width: '130px' }} alt="Las 3B" />
          <h2>ACCESO 3B</h2>
          <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyPress={e => e.key === 'Enter' && manejarLogin()} style={{ width: '100%', padding: '15px', fontSize: '24px', textAlign: 'center', margin: '20px 0' }} />
          <button onClick={manejarLogin} style={{ width: '100%', padding: '15px', background: c.azul, color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>ENTRAR</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: c.azul }}>Bienvenido, {user?.nombre}</h1>
      <p>Sucursal activa: {sucursal}</p>
    </div>
  );
}

export default App; // CRÍTICO: Debe estar aquí para que Vite no falle
