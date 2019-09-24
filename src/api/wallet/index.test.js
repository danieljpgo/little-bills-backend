import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Wallet } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, wallet

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  wallet = await Wallet.create({ create: user })
})

test('POST /wallets 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, value: 'test', user: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.value).toEqual('test')
  expect(body.user).toEqual('test')
  expect(typeof body.create).toEqual('object')
})

test('POST /wallets 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /wallets 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].create).toEqual('object')
})

test('GET /wallets 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /wallets/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${wallet.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(wallet.id)
  expect(typeof body.create).toEqual('object')
})

test('GET /wallets/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${wallet.id}`)
  expect(status).toBe(401)
})

test('GET /wallets/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /wallets/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${wallet.id}`)
    .send({ access_token: userSession, value: 'test', user: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(wallet.id)
  expect(body.value).toEqual('test')
  expect(body.user).toEqual('test')
  expect(typeof body.create).toEqual('object')
})

test('PUT /wallets/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${wallet.id}`)
    .send({ access_token: anotherSession, value: 'test', user: 'test' })
  expect(status).toBe(401)
})

test('PUT /wallets/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${wallet.id}`)
  expect(status).toBe(401)
})

test('PUT /wallets/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, value: 'test', user: 'test' })
  expect(status).toBe(404)
})

test('DELETE /wallets/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${wallet.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /wallets/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${wallet.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /wallets/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${wallet.id}`)
  expect(status).toBe(401)
})

test('DELETE /wallets/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
