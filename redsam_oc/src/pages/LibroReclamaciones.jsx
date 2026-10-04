import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LibroReclamaciones() {
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    tipoDoc: '',
    numDoc: '',
    celular: '',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    referencia: '',
    email: '',
    tipoReclamo: '',
    tipoConsumo: '',
    numPedido: '',
    fechaReclamo: new Date().toISOString().split('T')[0],
    proveedor: 'REDSAM',
    montoReclamado: '',
    descripcion: '',
    fechaCompra: '',
    fechaConsumo: '',
    fechaCaducidad: '',
    detalleReclamo: '',
    pedidoCliente: '',
    detalleArticulo: '',
    numeroPedido2: '',
  });

  const [archivos, setArchivos] = useState([]);
  const [errorArchivos, setErrorArchivos] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setErrorArchivos('');

    if (files.length > 5) {
      setErrorArchivos('Puedes adjuntar un máximo de 5 documentos.');
      return;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (totalSize > maxSize) {
      setErrorArchivos('El tamaño total de los documentos no debe superar los 10 Mb.');
      return;
    }

    setArchivos(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    console.log('Files:', archivos);
    alert('Reclamo enviado correctamente.');
  };

  // Clases dinámicas adaptables al tema global
  const inputClass = "w-full border border-fg-line bg-page text-fg rounded p-2 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan outline-none transition-colors";
  const labelClass = "block text-sm font-semibold mb-1 text-fg-strong";

  return (
    <div className="min-h-screen bg-page pt-24 pb-12 transition-colors duration-500">
      {/* Header Section */}
      <div className="bg-surface-soft py-12 px-5 border-b border-fg-line transition-colors duration-500">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-extrabold font-display text-fg-strong">
            <span className="text-accent-cyan">Libro</span> de Reclamaciones
          </h1>
          <div className="mt-4 text-sm font-mono tracking-wider text-fg-muted">
            <Link to="/" className="hover:text-accent-cyan transition-colors">La Cámara</Link>
            <span className="mx-2">/</span>
            <span className="text-accent-magenta">Libro de Reclamaciones</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="mx-auto max-w-5xl px-5 mt-12 bg-surface-soft rounded-xl shadow-sm p-8 border border-fg-line transition-colors duration-500">
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-fg-strong border-b border-fg-line pb-4 mb-6 flex items-baseline gap-2">
              Identificación del consumidor reclamante 
              <span className="text-xs text-accent-magenta font-normal">* Datos requeridos</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Nombre <span className="text-accent-magenta">*</span></label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={inputClass} placeholder="Nombre" />
              </div>
              <div>
                <label className={labelClass}>Primer apellido <span className="text-accent-magenta">*</span></label>
                <input required type="text" name="primerApellido" value={formData.primerApellido} onChange={handleChange} className={inputClass} placeholder="Primer apellido" />
              </div>
              <div>
                <label className={labelClass}>Segundo apellido <span className="text-accent-magenta">*</span></label>
                <input required type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleChange} className={inputClass} placeholder="Segundo apellido" />
              </div>

              <div>
                <label className={labelClass}>Tipo de documentación <span className="text-accent-magenta">*</span></label>
                <select required name="tipoDoc" value={formData.tipoDoc} onChange={handleChange} className={inputClass}>
                  <option value="">Selección de documentación</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de Extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Número de documentación <span className="text-accent-magenta">*</span></label>
                <input required type="text" name="numDoc" value={formData.numDoc} onChange={handleChange} className={inputClass} placeholder="Número de documentación" />
              </div>
              <div>
                <label className={labelClass}>Celular <span className="text-accent-magenta">*</span></label>
                <input required type="tel" name="celular" value={formData.celular} onChange={handleChange} className={inputClass} placeholder="Celular" />
              </div>

              <div>
                <label className={labelClass}>Departamento <span className="text-accent-magenta">*</span></label>
                <select required name="departamento" value={formData.departamento} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar departamento</option>
                  <option value="San Martin">San Martín</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Provincia <span className="text-accent-magenta">*</span></label>
                <select required name="provincia" value={formData.provincia} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar de provincia</option>
                  <option value="San Martin">San Martín</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Distrito <span className="text-accent-magenta">*</span></label>
                <select required name="distrito" value={formData.distrito} onChange={handleChange} className={inputClass}>
                  <option value="">Seleccionar de distrito</option>
                  <option value="Tarapoto">Tarapoto</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Dirección <span className="text-accent-magenta">*</span></label>
                <input required type="text" name="direccion" value={formData.direccion} onChange={handleChange} className={inputClass} placeholder="Dirección" />
              </div>
              <div>
                <label className={labelClass}>Referencia</label>
                <input type="text" name="referencia" value={formData.referencia} onChange={handleChange} className={inputClass} placeholder="Referencia" />
              </div>
              <div>
                <label className={labelClass}>Correo electrónico <span className="text-accent-magenta">*</span></label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="Correo electrónico" />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-fg-strong border-b border-fg-line pb-4 mb-6 flex items-baseline gap-2">
              Detalle del reclamo y orden del consumidor
              <span className="text-xs text-accent-magenta font-normal">* Datos requeridos</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Tipo de reclamo <span className="text-accent-magenta">*</span></label>
                <select required name="tipoReclamo" value={formData.tipoReclamo} onChange={handleChange} className={inputClass}>
                  <option value="">Tipo de reclamo</option>
                  <option value="Reclamo">Reclamo</option>
                  <option value="Queja">Queja</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tipo de consumo <span className="text-accent-magenta">*</span></label>
                <select required name="tipoConsumo" value={formData.tipoConsumo} onChange={handleChange} className={inputClass}>
                  <option value="">Tipo de consumo</option>
                  <option value="Producto">Producto</option>
                  <option value="Servicio">Servicio</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>N° de pedido. <span className="text-accent-magenta">*</span></label>
                <input required type="text" name="numPedido" value={formData.numPedido} onChange={handleChange} className={inputClass} placeholder="N° Pedido" />
              </div>

              <div>
                <label className={labelClass}>Fecha de reclamación / queja</label>
                <input type="date" name="fechaReclamo" value={formData.fechaReclamo} readOnly className={`${inputClass} bg-surface-raised text-fg-muted cursor-not-allowed`} style={{ colorScheme: 'dark light' }} />
              </div>
              <div>
                <label className={labelClass}>Proveedor</label>
                <input type="text" name="proveedor" value={formData.proveedor} readOnly className={`${inputClass} bg-surface-raised text-fg-muted cursor-not-allowed`} />
              </div>
              <div>
                <label className={labelClass}>Monto reclamado (S/.)</label>
                <input type="number" step="0.01" name="montoReclamado" value={formData.montoReclamado} onChange={handleChange} className={inputClass} placeholder="Monto reclamado" />
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>Descripción del producto o servicio <span className="text-accent-magenta">*</span></label>
                <textarea required name="descripcion" value={formData.descripcion} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-y`}></textarea>
              </div>

              <div>
                <label className={labelClass}>Fecha de compra</label>
                <input type="date" name="fechaCompra" value={formData.fechaCompra} onChange={handleChange} className={inputClass} style={{ colorScheme: 'dark light' }} />
              </div>
              <div>
                <label className={labelClass}>Fecha de consumo</label>
                <input type="date" name="fechaConsumo" value={formData.fechaConsumo} onChange={handleChange} className={inputClass} style={{ colorScheme: 'dark light' }} />
              </div>
              <div>
                <label className={labelClass}>Fecha de caducidad</label>
                <input type="date" name="fechaCaducidad" value={formData.fechaCaducidad} onChange={handleChange} className={inputClass} style={{ colorScheme: 'dark light' }} />
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>Detalle de la Reclamación / Queja, según lo indicado por el cliente: <span className="text-accent-magenta">*</span></label>
                <textarea required name="detalleReclamo" value={formData.detalleReclamo} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-y`}></textarea>
              </div>

              <div className="md:col-span-3">
                <label className={labelClass}>Pedido del Cliente: <span className="text-accent-magenta">*</span></label>
                <textarea required name="pedidoCliente" value={formData.pedidoCliente} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-y`}></textarea>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <div>
              <label className={`${labelClass} uppercase`}>Detalle de artículo</label>
              <textarea name="detalleArticulo" value={formData.detalleArticulo} onChange={handleChange} className={`${inputClass} w-full md:w-1/2 min-h-[80px] resize-y`}></textarea>
            </div>
            <div>
              <label className={`${labelClass} uppercase`}>Número de pedido</label>
              <input type="text" name="numeroPedido2" value={formData.numeroPedido2} onChange={handleChange} className={`${inputClass} w-full md:w-1/2`} />
            </div>

            <div>
              <label className={`${labelClass} uppercase`}>Adjuntar documentos</label>
              <input type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-fg-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-surface-raised file:text-fg-strong hover:file:opacity-80 transition-opacity cursor-pointer" />
              <p className="text-xs text-accent-magenta mt-2">[Máximo cinco documentos que no superen 10 Mb en total]</p>
              {errorArchivos && <p className="text-sm text-red-500 mt-1 font-bold">{errorArchivos}</p>}
              {archivos.length > 0 && !errorArchivos && (
                <ul className="mt-2 text-sm text-fg-muted list-disc list-inside">
                  {archivos.map((f, i) => <li key={i}>{f.name}</li>)}
                </ul>
              )}
            </div>

            <button type="submit" className="bg-[#0070c0] hover:bg-[#005a9c] text-white font-bold py-3 px-8 rounded shadow transition-colors">
              ENVIAR
            </button>
            
            <div className="pt-8 border-t border-fg-line text-sm text-fg-muted space-y-4">
              <p>REDSAM, con RUC 20000000000, con domicilio en San Martín, Perú.</p>
              <p><strong className="text-fg-strong">RECLAMO:</strong> Disconformidad relacionada a los productos o servicios.</p>
              <p><strong className="text-fg-strong">QUEJA:</strong> Disconformidad no relacionada a los productos o servicios o malestar o descontento respecto a la atención al público.</p>
              <p>La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
              <p>El proveedor deberá dar respuesta al reclamo en un plazo no mayor de treinta (30) días calendario, pudiendo ampliar el plazo hasta por treinta (30) días más, previa comunicación al consumidor.</p>
            </div>
          </section>

        </form>
      </div>
    </div>
  );
}
