import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const EQUIPOS = {
  admin: { label: 'Administrador', color: '#534AB7', bg: '#EEEDFE' },
  diseno: { label: 'Diseño', color: '#185FA5', bg: '#E6F1FB' },
  impresion: { label: 'Impresión', color: '#854F0B', bg: '#FAEEDA' },
  acabados: { label: 'Acabados', color: '#3B6D11', bg: '#EAF3DE' },
}

const ETAPAS = [
  { key: 'diseno', label: 'Diseño', equipo: 'diseno', siguiente: 'impresion', color: '#185FA5', bg: '#E6F1FB' },
  { key: 'impresion', label: 'Impresión', equipo: 'impresion', siguiente: 'acabados', color: '#854F0B', bg: '#FAEEDA' },
  { key: 'acabados', label: 'Acabados', equipo: 'acabados', siguiente: 'entregado', color: '#3B6D11', bg: '#EAF3DE' },
  { key: 'entregado', label: 'Entregado', equipo: null, siguiente: null, color: '#534AB7', bg: '#EEEDFE' },
]

const USUARIOS = {
  admin: { password: 'admin123', rol: 'admin' },
  diseno: { password: 'diseno123', rol: 'diseno' },
  impresion: { password: 'impresion123', rol: 'impresion' },
  acabados: { password: 'acabados123', rol: 'acabados' },
}

const s = {
  app: { minHeight: '100vh', background: '#f5f5f5', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  loginCard: { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', padding: '2rem', width: 340, maxWidth: '95vw' },
  loginTitle: { fontSize: 22, fontWeight: 500, marginBottom: 8, color: '#111' },
  loginSub: { fontSize: 14, color: '#888', marginBottom: 24 },
  label: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 12, background: '#fff', color: '#111' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 12, background: '#fff', color: '#111' },
  btnPrimary: { width: '100%', padding: '10px 0', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  error: { color: '#E24B4A', fontSize: 13, marginBottom: 12 },
  nav: { background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 },
  navTitle: { fontSize: 16, fontWeight: 500, color: '#111', display: 'flex', alignItems: 'center', gap: 8 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  rolBadge: { fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 999 },
  btnOut: { fontSize: 13, color: '#888', background: 'none', border: '1px solid #e0e0e0', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' },
  main: { padding: '1.5rem', maxWidth: 1200, margin: '0 auto' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 },
  h2: { fontSize: 18, fontWeight: 500, color: '#111' },
  btnAdd: { display: 'flex', alignItems: 'center', gap: 6, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  columns: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 },
  col: { background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', padding: 12 },
  colHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  colTitle: { fontSize: 13, fontWeight: 500 },
  badge: { fontSize: 11, fontWeight: 500, borderRadius: 999, padding: '2px 8px' },
  card: { background: '#fafafa', border: '1px solid #e5e5e5', borderRadius: 8, padding: '10px 12px', marginBottom: 8 },
  cardUrgente: { background: '#FFF5F5', border: '1.5px solid #E24B4A', borderRadius: 8, padding: '10px 12px', marginBottom: 8 },
  urgenteTag: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#E24B4A', color: '#fff', fontSize: 11, fontWeight: 500, borderRadius: 999, padding: '2px 8px', marginBottom: 6 },
  cardCliente: { fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#666', marginBottom: 8, lineHeight: 1.4 },
  detalleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 8 },
  detalleItem: { fontSize: 11, color: '#888' },
  detalleVal: { fontSize: 11, color: '#444', fontWeight: 500 },
  notaBox: { background: '#f0f0f0', borderRadius: 6, padding: '5px 8px', fontSize: 11, color: '#555', marginBottom: 8, lineHeight: 1.4 },
  cardMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardFecha: { fontSize: 11, color: '#aaa' },
  btnAvanzar: { width: '100%', padding: '7px 0', background: '#534AB7', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer' },
  btnCancelar: { width: '100%', padding: '7px 0', background: 'transparent', color: '#E24B4A', border: '1px solid #E24B4A', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 6 },
  btnDescargar: { width: '100%', padding: '7px 0', background: 'transparent', color: '#185FA5', border: '1px solid #185FA5', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 6 },
  btnSubir: { width: '100%', padding: '7px 0', background: 'transparent', color: '#3B6D11', border: '1px solid #3B6D11', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 6 },
  archivoTag: { display: 'flex', alignItems: 'center', gap: 6, background: '#EAF3DE', borderRadius: 6, padding: '5px 8px', fontSize: 11, color: '#3B6D11', marginBottom: 6 },
  empty: { textAlign: 'center', color: '#bbb', fontSize: 12, padding: '20px 0' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' },
  modal: { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', padding: '1.5rem', width: 420, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 16, fontWeight: 500, marginBottom: '1rem', color: '#111' },
  field: { marginBottom: 12 },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 70, background: '#fff', color: '#111' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1rem' },
  btnCancel: { background: 'transparent', border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: '#666' },
  btnSave: { background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  checkLabel: { fontSize: 14, color: '#111' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: 15, color: '#888' },
  confirmOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' },
  confirmBox: { background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', padding: '1.5rem', width: 360, maxWidth: '100%' },
  confirmTitle: { fontSize: 16, fontWeight: 500, color: '#111', marginBottom: 8 },
  confirmText: { fontSize: 14, color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 },
  confirmFooter: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  btnConfirmCancel: { background: 'transparent', border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: '#666' },
  btnConfirmOk: { background: '#E24B4A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
}

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [trabajos, setTrabajos] = useState([])
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ cliente: '', descripcion: '', cantidad: '', material: '', medida: '', confeccion: '', notas: '', urgente: false, fecha_entrega: '' })
  const [loginForm, setLoginForm] = useState({ usuario: 'admin', password: '' })
  const [loginError, setLoginError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmCancelar, setConfirmCancelar] = useState(null)
  const [uploading, setUploading] = useState(null)
  const fileInputRef = useRef(null)
  const [uploadTarget, setUploadTarget] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('imprenta_usuario')
    if (saved) setUsuario(saved)
  }, [])

  useEffect(() => {
    if (!usuario) { setLoading(false); return }
    cargarTrabajos()
    const channel = supabase
      .channel('trabajos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trabajos' }, () => cargarTrabajos())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [usuario])

  async function cargarTrabajos() {
    setLoading(true)
    const { data } = await supabase.from('trabajos').select('*').order('created_at', { ascending: false })
    setTrabajos(data || [])
    setLoading(false)
  }

  function login() {
    const u = USUARIOS[loginForm.usuario]
    if (!u || u.password !== loginForm.password) {
      setLoginError('Usuario o contraseña incorrectos')
      return
    }
    localStorage.setItem('imprenta_usuario', loginForm.usuario)
    setUsuario(loginForm.usuario)
    setLoginError('')
  }

  function logout() {
    localStorage.removeItem('imprenta_usuario')
    setUsuario(null)
  }

  async function agregarTrabajo() {
    if (!form.cliente.trim()) return
    setSaving(true)
    await supabase.from('trabajos').insert([{
      cliente: form.cliente.trim(),
      descripcion: form.descripcion.trim(),
      cantidad: form.cantidad,
      material: form.material.trim(),
      medida: form.medida.trim(),
      confeccion: form.confeccion.trim(),
      notas: form.notas.trim(),
      urgente: form.urgente,
      fecha_entrega: form.fecha_entrega || null,
      etapa: 'diseno',
    }])
    setSaving(false)
    setModal(false)
    setForm({ cliente: '', descripcion: '', cantidad: '', material: '', medida: '', confeccion: '', notas: '', urgente: false, fecha_entrega: '' })
  }

  async function avanzar(trabajo) {
    const etapa = ETAPAS.find(e => e.key === trabajo.etapa)
    if (!etapa || !etapa.siguiente) return
    await supabase.from('trabajos').update({ etapa: etapa.siguiente }).eq('id', trabajo.id)
  }

  async function cancelarTrabajo(id) {
    await supabase.from('trabajos').delete().eq('id', id)
    setConfirmCancelar(null)
  }

  function abrirSubirArchivo(trabajo) {
    setUploadTarget(trabajo)
    fileInputRef.current.click()
  }

  async function subirArchivo(e) {
    const file = e.target.files[0]
    if (!file || !uploadTarget) return
    setUploading(uploadTarget.id)
    const ext = file.name.split('.').pop()
    const path = `${uploadTarget.id}.${ext}`
    const { error } = await supabase.storage.from('archivos').upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('archivos').getPublicUrl(path)
      await supabase.from('trabajos').update({ archivo_url: data.publicUrl, archivo_nombre: file.name }).eq('id', uploadTarget.id)
    }
    setUploading(null)
    setUploadTarget(null)
    e.target.value = ''
  }

  const rol = usuario ? USUARIOS[usuario]?.rol : null

  if (!usuario) return <LoginScreen form={loginForm} setForm={setLoginForm} onLogin={login} error={loginError} />

  return (
    <div style={s.app}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,.tif,.tiff,.pdf" onChange={subirArchivo} />

      <nav style={s.nav}>
        <div style={s.navTitle}>🖨️ Imprenta Digital</div>
        <div style={s.navRight}>
          <span style={{ ...s.rolBadge, background: EQUIPOS[rol]?.bg, color: EQUIPOS[rol]?.color }}>
            {EQUIPOS[rol]?.label}
          </span>
          <button style={s.btnOut} onClick={logout}>Salir</button>
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.topBar}>
          <h2 style={s.h2}>Flujo de trabajo</h2>
          {(rol === 'admin' || rol === 'diseno') && (
            <button style={s.btnAdd} onClick={() => setModal(true)}>+ Nuevo trabajo</button>
          )}
        </div>

        {loading ? (
          <div style={s.loading}>Cargando trabajos...</div>
        ) : (
          <div style={s.columns}>
            {(rol === 'admin' ? ETAPAS : ETAPAS.filter(e => e.key === rol || e.key === 'entregado')).map(etapa => {
              const items = trabajos.filter(t => t.etapa === etapa.key)
              const puedeAvanzar = rol === 'admin' || rol === etapa.equipo
              return (
                <div key={etapa.key} style={s.col}>
                  <div style={s.colHeader}>
                    <span style={{ ...s.colTitle, color: etapa.color }}>{etapa.label}</span>
                    <span style={{ ...s.badge, background: etapa.bg, color: etapa.color }}>{items.length}</span>
                  </div>
                  {items.length === 0 && <div style={s.empty}>Sin trabajos</div>}
                  {items.sort((a, b) => b.urgente - a.urgente).map(t => (
                    <div key={t.id} style={t.urgente ? s.cardUrgente : s.card}>
                      {t.urgente && <div style={s.urgenteTag}>⚡ URGENTE</div>}
                      <div style={s.cardCliente}>{t.cliente}</div>
                      {t.descripcion && <div style={s.cardDesc}>{t.descripcion}</div>}
                      <div style={s.detalleGrid}>
                        {t.cantidad && <><span style={s.detalleItem}>Cantidad</span><span style={s.detalleVal}>{t.cantidad}</span></>}
                        {t.material && <><span style={s.detalleItem}>Material</span><span style={s.detalleVal}>{t.material}</span></>}
                        {t.medida && <><span style={s.detalleItem}>Medida</span><span style={s.detalleVal}>{t.medida}</span></>}
                        {t.confeccion && <><span style={s.detalleItem}>Confección</span><span style={s.detalleVal}>{t.confeccion}</span></>}
                      </div>
                      {t.notas && <div style={s.notaBox}>📝 {t.notas}</div>}
                      {t.archivo_url && (
                        <div style={s.archivoTag}>
                          📎 {t.archivo_nombre || 'Archivo adjunto'}
                        </div>
                      )}
                      <div style={s.cardMeta}>
                        <span style={s.cardFecha}>{t.fecha_entrega ? `Entrega: ${formatFecha(t.fecha_entrega)}` : ''}</span>
                      </div>
                      {t.archivo_url && (
                        <a href={t.archivo_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                          <button style={s.btnDescargar}>⬇ Ver / Descargar archivo</button>
                        </a>
                      )}
                      {(rol === 'admin' || rol === 'diseno') && (
                        <button style={s.btnSubir} onClick={() => abrirSubirArchivo(t)} disabled={uploading === t.id}>
                          {uploading === t.id ? 'Subiendo...' : t.archivo_url ? '🔄 Reemplazar archivo' : '⬆ Subir archivo'}
                        </button>
                      )}
                      {puedeAvanzar && etapa.siguiente && (
                        <button style={{ ...s.btnAvanzar, marginTop: 6 }} onClick={() => avanzar(t)}>
                          Pasar a {ETAPAS.find(e => e.key === etapa.siguiente)?.label} →
                        </button>
                      )}
                      {(rol === 'admin' || rol === 'diseno') && (
                        <button style={s.btnCancelar} onClick={() => setConfirmCancelar(t)}>
                          Cancelar trabajo
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {confirmCancelar && (
        <div style={s.confirmOverlay}>
          <div style={s.confirmBox}>
            <div style={s.confirmTitle}>¿Cancelar este trabajo?</div>
            <div style={s.confirmText}>
              Vas a cancelar el trabajo de <strong>{confirmCancelar.cliente}</strong>. Esta acción no se puede deshacer.
            </div>
            <div style={s.confirmFooter}>
              <button style={s.btnConfirmCancel} onClick={() => setConfirmCancelar(null)}>No, mantener</button>
              <button style={s.btnConfirmOk} onClick={() => cancelarTrabajo(confirmCancelar.id)}>Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div style={s.modal}>
            <div style={s.modalTitle}>Nuevo trabajo</div>
            <div style={s.field}>
              <label style={s.label}>Cliente *</label>
              <input style={s.input} value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} placeholder="Nombre del cliente" />
            </div>
            <div style={s.field}>
              <label style={s.label}>Descripción</label>
              <input style={s.input} value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Volantes promocionales" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={s.field}>
                <label style={s.label}>Cantidad</label>
                <input style={s.input} value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} placeholder="Ej: 500" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Medida</label>
                <input style={s.input} value={form.medida} onChange={e => setForm({ ...form, medida: e.target.value })} placeholder="Ej: 21x28 cm" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Material</label>
                <input style={s.input} value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="Ej: Couché 150g" />
              </div>
              <div style={s.field}>
                <label style={s.label}>Confección</label>
                <input style={s.input} value={form.confeccion} onChange={e => setForm({ ...form, confeccion: e.target.value })} placeholder="Ej: Doblado, engrapado" />
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Fecha de entrega</label>
              <input type="date" style={s.input} value={form.fecha_entrega} onChange={e => setForm({ ...form, fecha_entrega: e.target.value })} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Notas adicionales</label>
              <textarea style={s.textarea} value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Cualquier detalle importante..." />
            </div>
            <div style={s.checkRow}>
              <input type="checkbox" id="urgente" checked={form.urgente} onChange={e => setForm({ ...form, urgente: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label htmlFor="urgente" style={{ ...s.checkLabel, cursor: 'pointer' }}>⚡ Marcar como urgente</label>
            </div>
            <div style={s.modalFooter}>
              <button style={s.btnCancel} onClick={() => setModal(false)}>Cancelar</button>
              <button style={s.btnSave} onClick={agregarTrabajo} disabled={saving}>{saving ? 'Guardando...' : 'Agregar trabajo'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LoginScreen({ form, setForm, onLogin, error }) {
  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🖨️</div>
        <div style={s.loginTitle}>Imprenta Digital</div>
        <div style={s.loginSub}>Ingresa con tu equipo para continuar</div>
        <label style={s.label}>Equipo</label>
        <select style={s.select} value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })}>
          <option value="admin">Administrador</option>
          <option value="diseno">Diseño</option>
          <option value="impresion">Impresión</option>
          <option value="acabados">Acabados</option>
        </select>
        <label style={s.label}>Contraseña</label>
        <input
          type="password"
          style={s.input}
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && onLogin()}
          placeholder="Contraseña"
        />
        {error && <div style={s.error}>{error}</div>}
        <button style={s.btnPrimary} onClick={onLogin}>Entrar</button>
      </div>
    </div>
  )
}

function formatFecha(f) {
  if (!f) return ''
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}
