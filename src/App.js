import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const EQUIPOS = {
  admin: { label: 'Administrador', color: '#FF6B00', bg: '#1a1a1a' },
  diseno: { label: 'Diseño', color: '#FF6B00', bg: '#1a1a1a' },
  impresion: { label: 'Impresión', color: '#FF6B00', bg: '#1a1a1a' },
  acabados: { label: 'Acabados', color: '#FF6B00', bg: '#1a1a1a' },
}

const ETAPAS = [
  { key: 'diseno', label: 'Diseño', equipo: 'diseno', siguiente: 'impresion', color: '#FF6B00', bg: '#2a1a00', border: '#FF6B00' },
  { key: 'impresion', label: 'Impresión', equipo: 'impresion', siguiente: 'acabados', color: '#FFA040', bg: '#2a1800', border: '#FFA040' },
  { key: 'acabados', label: 'Acabados', equipo: 'acabados', siguiente: 'entregado', color: '#aaaaaa', bg: '#222222', border: '#666666' },
  { key: 'entregado', label: 'Entregado', equipo: null, siguiente: null, color: '#4CAF50', bg: '#0d2010', border: '#4CAF50' },
]

const USUARIOS = {
  admin: { password: 'admin123', rol: 'admin' },
  diseno: { password: 'diseno123', rol: 'diseno' },
  impresion: { password: 'impresion123', rol: 'impresion' },
  acabados: { password: 'acabados123', rol: 'acabados' },
}

const s = {
  app: { minHeight: '100vh', background: '#111111', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111111' },
  loginCard: { background: '#1e1e1e', borderRadius: 16, border: '1px solid #333', padding: '2rem', width: 360, maxWidth: '95vw' },
  loginLogo: { fontSize: 36, marginBottom: 8, textAlign: 'center' },
  loginTitle: { fontSize: 22, fontWeight: 700, marginBottom: 4, color: '#FF6B00', textAlign: 'center' },
  loginSub: { fontSize: 13, color: '#888', marginBottom: 28, textAlign: 'center' },
  label: { display: 'block', fontSize: 12, color: '#aaa', marginBottom: 4 },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #333', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 12, background: '#2a2a2a', color: '#fff' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #333', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 12, background: '#2a2a2a', color: '#fff' },
  btnPrimary: { width: '100%', padding: '11px 0', background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5 },
  error: { color: '#ff4444', fontSize: 13, marginBottom: 12 },
  nav: { background: '#1a1a1a', borderBottom: '2px solid #FF6B00', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 },
  navTitle: { fontSize: 18, fontWeight: 700, color: '#FF6B00', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: 0.5 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  rolBadge: { fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: '#FF6B00', color: '#fff' },
  btnOut: { fontSize: 13, color: '#aaa', background: 'none', border: '1px solid #444', borderRadius: 8, padding: '6px 14px', cursor: 'pointer' },
  main: { padding: '1.5rem', maxWidth: 1300, margin: '0 auto' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 },
  h2: { fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: 0.3 },
  btnAdd: { display: 'flex', alignItems: 'center', gap: 8, background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  columns: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 },
  col: { background: '#1a1a1a', borderRadius: 12, border: '1px solid #2a2a2a', padding: 14 },
  colHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #2a2a2a' },
  colTitle: { fontSize: 14, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' },
  badge: { fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px', border: '1px solid' },
  card: { background: '#222222', border: '1px solid #333', borderRadius: 10, padding: '12px 14px', marginBottom: 10 },
  cardUrgente: { background: '#2a1200', border: '2px solid #FF6B00', borderRadius: 10, padding: '12px 14px', marginBottom: 10 },
  urgenteTag: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FF6B00', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px', marginBottom: 8, letterSpacing: 0.5 },
  cardCliente: { fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#999', marginBottom: 10, lineHeight: 1.4 },
  detalleGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10, background: '#1a1a1a', borderRadius: 8, padding: '8px 10px' },
  detalleItem: { fontSize: 11, color: '#666' },
  detalleVal: { fontSize: 11, color: '#FF6B00', fontWeight: 600 },
  notaBox: { background: '#1a1a1a', borderLeft: '3px solid #FF6B00', borderRadius: '0 6px 6px 0', padding: '6px 10px', fontSize: 11, color: '#aaa', marginBottom: 10, lineHeight: 1.4 },
  cardMeta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardFecha: { fontSize: 11, color: '#FF6B00', display: 'flex', alignItems: 'center', gap: 4 },
  btnAvanzar: { width: '100%', padding: '8px 0', background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3 },
  btnCancelar: { width: '100%', padding: '7px 0', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6 },
  btnDescargar: { width: '100%', padding: '7px 0', background: 'transparent', color: '#FFA040', border: '1px solid #FFA040', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6 },
  btnSubir: { width: '100%', padding: '7px 0', background: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6 },
  archivoTag: { display: 'flex', alignItems: 'center', gap: 6, background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, padding: '5px 10px', fontSize: 11, color: '#FFA040', marginBottom: 8 },
  empty: { textAlign: 'center', color: '#444', fontSize: 12, padding: '24px 0' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' },
  modal: { background: '#1e1e1e', borderRadius: 16, border: '1px solid #333', padding: '1.5rem', width: 440, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 17, fontWeight: 700, marginBottom: '1rem', color: '#FF6B00' },
  field: { marginBottom: 12 },
  textarea: { width: '100%', padding: '10px 12px', border: '1px solid #333', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 70, background: '#2a2a2a', color: '#fff' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1rem' },
  btnCancel: { background: 'transparent', border: '1px solid #444', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: '#aaa' },
  btnSave: { background: '#FF6B00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  checkLabel: { fontSize: 14, color: '#ccc' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: 15, color: '#FF6B00' },
  confirmOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' },
  confirmBox: { background: '#1e1e1e', borderRadius: 16, border: '1px solid #444', padding: '1.5rem', width: 360, maxWidth: '100%' },
  confirmTitle: { fontSize: 16, fontWeight: 700, color: '#ff4444', marginBottom: 8 },
  confirmText: { fontSize: 14, color: '#aaa', marginBottom: '1.5rem', lineHeight: 1.5 },
  confirmFooter: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  btnConfirmCancel: { background: 'transparent', border: '1px solid #444', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', color: '#aaa' },
  btnConfirmOk: { background: '#ff4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
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
        <div style={s.navTitle}>
          🖨️ Prorotulos
        </div>
        <div style={s.navRight}>
          <span style={s.rolBadge}>{EQUIPOS[rol]?.label}</span>
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
            {(rol === 'admin' || rol === 'diseno' ? ETAPAS : ETAPAS.filter(e => e.key === rol || e.key === 'entregado')).map(etapa => {
              const items = trabajos.filter(t => t.etapa === etapa.key)
              const puedeAvanzar = rol === 'admin' || rol === etapa.equipo
              return (
                <div key={etapa.key} style={{ ...s.col, borderTop: `3px solid ${etapa.color}` }}>
                  <div style={s.colHeader}>
                    <span style={{ ...s.colTitle, color: etapa.color }}>{etapa.label}</span>
                    <span style={{ ...s.badge, background: etapa.bg, color: etapa.color, borderColor: etapa.border }}>{items.length}</span>
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
                        <div style={s.archivoTag}>📎 {t.archivo_nombre || 'Archivo adjunto'}</div>
                      )}
                      <div style={s.cardMeta}>
                        <span style={s.cardFecha}>{t.fecha_entrega ? `📅 ${formatFecha(t.fecha_entrega)}` : ''}</span>
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
              Vas a cancelar el trabajo de <strong style={{ color: '#fff' }}>{confirmCancelar.cliente}</strong>. Esta acción no se puede deshacer.
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
            <div style={s.modalTitle}>+ Nuevo trabajo</div>
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
              <input type="checkbox" id="urgente" checked={form.urgente} onChange={e => setForm({ ...form, urgente: e.target.checked })} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#FF6B00' }} />
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
        <div style={s.loginLogo}>🖨️</div>
        <div style={s.loginTitle}>Prorotulos</div>
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
        <button style={s.btnPrimary} onClick={onLogin}>ENTRAR</button>
      </div>
    </div>
  )
}

function formatFecha(f) {
  if (!f) return ''
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}
