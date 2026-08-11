// PENDIENTE: datos de ejemplo, faltan los endpoints reales. Cuando existan,
// `requestReset` debe responder igual exista o no el correo: si no, la pantalla
// delata qué direcciones institucionales están dadas de alta.
export async function requestReset(email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (!email.trim()) {
    throw new Error('Email is required')
  }
}

export async function verifyCode(code: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (code.length !== 6) {
    throw new Error('Invalid code')
  }
}
