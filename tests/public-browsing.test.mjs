import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import test from 'node:test'
import { computed, reactive, ref } from 'vue'
import { inquiryRedirect } from '../app/utils/inquiryRedirect.ts'

function middleware(file, role = null) {
  const source = readFileSync(new URL(`../app/middleware/${file}`, import.meta.url), 'utf8')
  return runInNewContext(source.replace('export default', ''), {
    defineNuxtRouteMiddleware: handler => handler,
    useAuth: () => ({ user: { value: role ? { role } : null }, token: { value: role ? 'test-token' : null } }),
    inquiryRedirect,
    navigateTo: destination => destination,
  })
}

test('guests can browse public routes but must sign in to post an inquiry', () => {
  const guard = middleware('role.global.ts')
  for (const path of ['/', '/organizers', '/organizers/eventpro-solutions']) {
    assert.equal(guard({ path }), undefined)
  }
  for (const file of ['role.global.ts', 'client.ts']) {
    const redirect = middleware(file)({ path: '/client/post-event' })
    assert.equal(redirect.path, '/login')
    assert.equal(redirect.query.redirect, '/client/post-event')
    assert.equal(middleware(file, 'client')({ path: '/client/post-event' }), undefined)
    assert.equal(middleware(file, 'organizer')({ path: '/client/post-event' }), '/organizer/home')
  }
})

test('authentication redirects reject external URLs, arrays, and unrelated paths', () => {
  assert.equal(inquiryRedirect('/client/post-event'), '/client/post-event')
  for (const value of [null, undefined, ['\/client/post-event'], '//example.com', 'https://example.com', '/organizer/home', '/client/post-event?redirect=https://example.com']) {
    assert.equal(inquiryRedirect(value), undefined)
  }
})

async function submitLogin(role, method, redirect) {
  const source = readFileSync(new URL('../app/pages/login.vue', import.meta.url), 'utf8')
    .match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1]
  const destinations = []
  const credentials = []
  const context = {
    computed, reactive, ref, inquiryRedirect,
    definePageMeta() { }, useSeoMeta() { }, watch() { },
    useRoute: () => ({ query: { redirect } }),
    useAuth: () => ({
      login: async payload => { credentials.push(payload); return { role } },
      redirectByRole: user => destinations.push(user.role === 'client' ? '/client/my-events' : '/organizer/home'),
      isLoading: ref(false), errorMessage: ref(''),
    }),
    navigateTo: destination => destinations.push(destination),
  }
  runInNewContext(stripTypeScriptTypes(source) + '\nthis.submit = handleSubmit; this.form = state; this.method = loginMethod;', context)
  context.method.value = method
  Object.assign(context.form, { email: 'test@example.com', phone: '09171234567', password: 'test-only' })
  await context.submit()
  return { destination: destinations[0], credentials: credentials[0] }
}

test('email and phone login return clients to the inquiry form', async () => {
  for (const method of ['email', 'phone']) {
    const result = await submitLogin('client', method, '/client/post-event')
    assert.equal(result.destination, '/client/post-event')
    assert.equal(result.credentials[method], method === 'email' ? 'test@example.com' : '+639171234567')
  }
})

test('organizers retain their dashboard and untrusted redirects are ignored', async () => {
  assert.equal((await submitLogin('organizer', 'email', '/client/post-event')).destination, '/organizer/home')
  assert.equal((await submitLogin('client', 'email', 'https://example.com')).destination, '/client/my-events')
  assert.equal((await submitLogin('client', 'email', undefined)).destination, '/client/my-events')
})
