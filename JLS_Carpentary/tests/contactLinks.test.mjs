import test from 'node:test'
import assert from 'node:assert/strict'
import { smsLink, whatsappLink } from '../src/contactLinks.ts'

test('formatted international numbers produce valid WhatsApp and SMS destinations', () => {
  for (const phone of ['+61 450 973 980', '+61 (450) 973-980', '0061 450 973 980']) {
    assert.equal(whatsappLink(phone, 'Quote & renovation?'), 'https://wa.me/61450973980?text=Quote%20%26%20renovation%3F')
    assert.equal(smsLink(phone), 'sms:+61450973980')
  }
  assert.equal(whatsappLink('61450973980', ''), 'https://wa.me/61450973980?text=')
  assert.equal(smsLink('0450 973 980'), 'sms:0450973980')
})
