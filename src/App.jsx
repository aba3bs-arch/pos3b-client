// --- LÓGICA DEL MÓDULO DE COMPRAS ---
const ModuloCompras = ({ sucursal, usuario, inventario, alActualizarInventario }) => {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [listaProveedores, setListaProveedores] = useState([]);
  const [carritoCompra, setCarritoCompra] = useState([]);
  const [busquedaProd, setBusquedaProd] = useState('');
  const [cargando, setCargando] = useState(false);

  // Colores institucionales de Las 3B
  const c = { azul: '#3b69b5', verde: '#1e8e3e', rojo: '#ff0000' };

  useEffect(() => {
    const obtenerProveedores = async () => {
      const { data } = await supabase.from('proveedores').select('*').eq('activo', true);
      setListaProveedores(data || []);
    };
    obtenerProveedores();
  }, []);

  // Agregar producto al pedido
  const agregarAlPedido = (prod) => {
    const existe = carritoCompra.find(item => item.id === prod.id);
    if (existe) {
      setCarritoCompra(carritoCompra.map(item => 
        item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarritoCompra([...carritoCompra, { ...prod, cantidad: 1, costo_nuevo: prod.costo }]);
    }
  };

  // PROCESAR ENTRADA DE MERCANCÍA (La magia del inventario)
  const finalizarCompra = async () => {
    if (!proveedorSeleccionado || carritoCompra.length === 0) return alert("Selecciona proveedor y productos");
    
    setCargando(true);
    try {
      // 1. Registrar la Compra en el Historial
      const total = carritoCompra.reduce((acc, cur) => acc + (cur.costo_nuevo * cur.cantidad), 0);
      await supabase.from('compras').insert([{
        proveedor_id: proveedorSeleccionado,
        vendedor_id: usuario.id,
        sucursal: sucursal,
        total_compra: total,
        articulos: carritoCompra
      }]);

      // 2. Actualizar Stock y Costos en la tabla Productos uno por uno
      for (const item of carritoCompra) {
        const { data: prodActual } = await supabase.from('productos').select('stock').eq('id', item.id).single();
        const nuevoStock = (prodActual?.stock || 0) + parseInt(item.cantidad);
        
        await supabase.from('productos').update({ 
          stock: nuevoStock,
          costo: item.costo_nuevo 
        }).eq('id', item.id);
      }

      alert("¡Inventario actualizado correctamente para " + sucursal + "!");
      setCarritoCompra([]);
      alActualizarInventario(); // Recarga el inventario en el estado global
    } catch (err) {
      console.error(err);
      alert("Error al procesar la compra");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #ddd' }}>
      <header style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Seleccionar Proveedor:</label>
          <select 
            value={proveedorSeleccionado} 
            onChange={(e) => setProveedorSeleccionado(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}
          >
            <option value="">-- Elige un proveedor (Coca, Lala, Bimbo...) --</option>
            {listaProveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Buscar Producto para Ingresar:</label>
          <input 
            type="text" 
            placeholder="Escanea o escribe nombre..." 
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}
            value={busquedaProd}
            onChange={(e) => setBusquedaProd(e.target.value)}
          />
        </div>
      </header>

      {/* Lista de productos filtrados para agregar */}
      {busquedaProd && (
        <div style={{ marginBottom: '20px', maxHeight: '150px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '10px' }}>
          {inventario.filter(p => p.nombre.toLowerCase().includes(busquedaProd.toLowerCase())).map(p => (
            <div key={p.id} onClick={() => { agregarAlPedido(p); setBusquedaProd(''); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
              {p.nombre} - <small>Stock actual: {p.stock}</small>
            </div>
          ))}
        </div>
      )}

      {/* Tabla de Recepción de Mercancía */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Producto</th>
            <th>Cant. Recibida</th>
            <th>Costo Unit.</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {carritoCompra.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{item.nombre}</td>
              <td>
                <input 
                  type="number" 
                  value={item.cantidad} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCarritoCompra(carritoCompra.map(c => c.id === item.id ? { ...c, cantidad: val } : c));
                  }}
                  style={{ width: '60px', padding: '5px' }}
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.costo_nuevo} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCarritoCompra(carritoCompra.map(c => c.id === item.id ? { ...c, costo_nuevo: val } : c));
                  }}
                  style={{ width: '80px', padding: '5px' }}
                />
              </td>
              <td style={{ fontWeight: 'bold' }}>${(item.cantidad * item.costo_nuevo).toFixed(2)}</td>
              <td><button onClick={() => setCarritoCompra(carritoCompra.filter(c => c.id !== item.id))} style={{ color: c.rojo, border: 'none', background: 'none', cursor: 'pointer' }}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
          TOTAL PEDIDO: ${carritoCompra.reduce((a, b) => a + (b.cantidad * b.costo_nuevo), 0).toFixed(2)}
        </div>
        <button 
          onClick={finalizarCompra} 
          disabled={cargando}
          style={{ 
            backgroundColor: cargando ? '#ccc' : c.verde, 
            color: '#fff', 
            padding: '15px 40px', 
            borderRadius: '12px', 
            border: 'none', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          {cargando ? 'ACTUALIZANDO STOCK...' : 'VALIDAR Y RECIBIR MERCANCÍA'}
        </button>
      </footer>
    </div>
  );
};
