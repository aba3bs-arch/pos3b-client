// ... (Mantén tus importaciones y cliente de supabase arriba)

const App = () => {
  // --- NUEVOS ESTADOS PARA COBRO ---
  const [pagoCon, setPagoCon] = useState('');
  const [cambio, setCambio] = useState(0);
  const [mostrarCobro, setMostrarCobro] = useState(false);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');

  // --- LÓGICA DE CÁLCULO ---
  const totalVenta = useMemo(() => carrito.reduce((a, b) => a + b.precio, 0), [carrito]);

  useEffect(() => {
    const numPago = parseFloat(pagoCon) || 0;
    setCambio(numPago > totalVenta ? numPago - totalVenta : 0);
  }, [pagoCon, totalVenta]);

  // --- FINALIZAR VENTA REAL ---
  const finalizarVenta = async () => {
    if (parseFloat(pagoCon) < totalVenta && metodoPago === 'EFECTIVO') {
      alert("Monto insuficiente");
      return;
    }

    const { data, error } = await supabase.from('ventas').insert([{
      vendedor: usuario.nombre,
      total: totalVenta,
      sucursal: sucursal,
      articulos: carrito,
      metodo_pago: metodoPago
    }]);

    if (!error) {
      // Registrar movimiento en caja para el Corte
      await supabase.from('caja_movimientos').insert([{
        sucursal_id: sucursal,
        usuario_id: usuario.id,
        tipo: 'VENTA',
        monto: totalVenta,
        metodo_pago: metodoPago
      }]);

      alert(`Venta exitosa. Cambio: $${cambio}`);
      setCarrito([]);
      setMostrarCobro(false);
      setPagoCon('');
    }
  };

  // --- RENDERIZADO DEL MÓDULO DE VENTAS COMPLETO ---
  return (
    // ... (Estructura de sidebar anterior)
    <main>
      {vista === 'Ventas' && (
        <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
          <div style={{ flex: 1 }}>
            <input type="text" placeholder="F1 - Escanear..." style={s.inputBusqueda} />
            {/* Grilla de favoritos aquí */}
          </div>

          <aside style={s.posPanel}>
            <h3>TICKET #001</h3>
            <div style={{flex: 1, overflowY: 'auto'}}>
               {carrito.map((it, i) => (
                 <div key={i} style={{display:'flex', justifyContent:'space-between'}}>
                   <span>{it.nombre}</span><b>${it.precio}</b>
                 </div>
               ))}
            </div>
            
            <div style={s.totalArea}>TOTAL: ${totalVenta}.00</div>
            
            {!mostrarCobro ? (
              <button onClick={() => setMostrarCobro(true)} style={s.btnCobrar}>COBRAR [F10]</button>
            ) : (
              <div style={s.panelCobro}>
                <label>Método:</label>
                <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={s.select}>
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="TARJETA">TARJETA</option>
                  <option value="CREDITO">FIADO / CRÉDITO</option>
                </select>
                
                <label>Pagó con:</label>
                <input type="number" value={pagoCon} onChange={e => setPagoCon(e.target.value)} style={s.inputPago} autoFocus />
                
                <div style={s.cambioArea}>CAMBIO: ${cambio.toFixed(2)}</div>
                
                <button onClick={finalizarVenta} style={s.btnConfirmar}>ACEPTAR VENTA</button>
                <button onClick={() => setMostrarCobro(false)} style={s.btnCancelar}>CANCELAR</button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* MÓDULO CORTE DE CAJA (Persistencia real) */}
      {vista === 'Reportes' && (
        <div style={s.modView}>
          <h3>Corte de Caja - Turno Actual</h3>
          <button onClick={async () => {
            const { data } = await supabase.from('caja_movimientos').select('monto').eq('sucursal_id', sucursal);
            const totalCaja = data.reduce((a, b) => a + parseFloat(b.monto), 0);
            alert(`Efectivo esperado en caja: $${totalCaja}`);
          }} style={s.btnIn}>Calcular Efectivo en Caja</button>
        </div>
      )}
    </main>
  );
};

const s = {
  // ... (Estilos anteriores)
  panelCobro: { background: '#f8f9fa', padding: '15px', borderRadius: '15px', marginTop: '10px', border: '1px solid #ddd' },
  inputPago: { width: '100%', padding: '10px', fontSize: '20px', borderRadius: '8px', border: '1px solid #3b69b5' },
  cambioArea: { fontSize: '24px', fontWeight: 'bold', color: '#1e8e3e', margin: '10px 0', textAlign: 'center' },
  btnConfirmar: { width: '100%', padding: '12px', background: '#1e8e3e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  btnCancelar: { width: '100%', padding: '8px', background: '#ff0000', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '5px' },
  select: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px' }
};
