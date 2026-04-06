import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xegfgtraorqwlpcqpcvb.supabase.co'
const supabaseKey = 'sb_publishable_CqO7igUgbtrniAuCfwYD2g_vjTHx5-l'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    correo: '',
    direccion: '',
    institucion: '',
    area: ''
  })

  const [registros, setRegistros] = useState([])
  const [login, setLogin] = useState({ usuario: '', password: '' })
  const [adminAuth, setAdminAuth] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarRegistros()
  }, [])

  const cargarRegistros = async () => {
    const { data, error } = await supabase
      .from('docentes')
      .select('*')
      .order('id', { ascending: false })

    if (!error) {
      setRegistros(data || [])
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const guardarRegistro = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from('docentes')
      .insert([formData])

    if (!error) {
      setMensaje('Información guardada correctamente')
      setFormData({
        nombre: '',
        documento: '',
        telefono: '',
        correo: '',
        direccion: '',
        institucion: '',
        area: ''
      })
      cargarRegistros()
    } else {
      setMensaje('Error al guardar la información')
    }
  }

  const ingresarAdmin = () => {
    if (login.usuario === 'admin' && login.password === '1234') {
      setAdminAuth(true)
    } else {
      alert('Usuario o contraseña incorrectos')
    }
  }

  const instituciones = useMemo(
    () => [...new Set(registros.map((r) => r.institucion).filter(Boolean))],
    [registros]
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Actualización de Datos Docentes</h1>
          <p className="text-gray-600 mt-2">
            Este enlace es exclusivo para diligenciar la información.
          </p>
        </div>

        <form onSubmit={guardarRegistro} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="Nombres y apellidos" />
          <input name="documento" value={formData.documento} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="Número de documento" />
          <input name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="Teléfono" />
          <input name="correo" value={formData.correo} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="Correo electrónico" />
          <input name="direccion" value={formData.direccion} onChange={handleChange} className="w-full border rounded-xl p-3 md:col-span-2" placeholder="Dirección" />
          <input name="institucion" value={formData.institucion} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="Institución / sede" />
          <input name="area" value={formData.area} onChange={handleChange} className="w-full border rounded-xl p-3" placeholder="Área o asignatura" />
          <button type="submit" className="md:col-span-2 mt-4 bg-black text-white rounded-xl p-3 font-medium">
            Guardar información
          </button>
        </form>

        {mensaje && <p className="mt-4 text-sm">{mensaje}</p>}
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {!adminAuth ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Acceso Administrador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                className="w-full border rounded-xl p-3"
                placeholder="Usuario"
                onChange={(e) =>
                  setLogin({ ...login, usuario: e.target.value })
                }
              />
              <input
                className="w-full border rounded-xl p-3"
                type="password"
                placeholder="Contraseña"
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
              />
            </div>
            <button
              onClick={ingresarAdmin}
              className="w-full bg-black text-white rounded-xl p-3 font-medium"
            >
              Ingresar
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-4">Panel Administrativo</h3>
            <p className="mb-4 text-sm text-gray-600">
              Instituciones registradas: {instituciones.join(', ')}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Documento</th>
                    <th className="text-left p-3">Institución</th>
                    <th className="text-left p-3">Área</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((registro, index) => (
                    <tr key={registro.id || index} className="border-b">
                      <td className="p-3">{registro.nombre}</td>
                      <td className="p-3">{registro.documento}</td>
                      <td className="p-3">{registro.institucion}</td>
                      <td className="p-3">{registro.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}