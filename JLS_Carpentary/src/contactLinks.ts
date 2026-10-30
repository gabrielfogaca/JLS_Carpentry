/** Keep formatting in the editor, but use digits only in WhatsApp URLs. */
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^00/, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function smsLink(phone: string): string {
  const trimmed = phone.trim()
  const digits = trimmed.replace(/\D/g, '')
  const number = digits.startsWith('00') ? `+${digits.slice(2)}` : `${trimmed.startsWith('+') ? '+' : ''}${digits}`
  return `sms:${number}`
}
