const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim()

export const isContactServiceConfigured = Boolean(contactEndpoint)

/**
 * Envía una solicitud de contacto al endpoint configurado por el entorno.
 * El servicio remoto debe validar y sanitizar siempre el payload recibido.
 */
export async function sendContactMessage(payload, { signal } = {}) {
  if (!contactEndpoint) {
    throw new Error('CONTACT_ENDPOINT_NOT_CONFIGURED')
  }

  const response = await fetch(contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    let errorDetail = 'CONTACT_REQUEST_FAILED'
    try {
      const errorJson = await response.json()
      if (errorJson?.detail) {
        errorDetail = typeof errorJson.detail === 'string'
          ? errorJson.detail
          : errorJson.detail[0]?.msg || 'Error en los datos ingresados'
      }
    } catch {
      // fallback
    }
    const err = new Error(errorDetail)
    err.status = response.status
    throw err
  }

  return await response.json()
}
