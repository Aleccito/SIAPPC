// PHASE 2: replace these bodies with real endpoints. requestReset must respond
// the same way whether the email exists or not, so the UI never leaks which
// institutional emails are registered.
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
