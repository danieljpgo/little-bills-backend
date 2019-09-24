import { Wallet } from '.'
import { User } from '../user'

let user, wallet

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  wallet = await Wallet.create({ create: user, value: 'test', user: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = wallet.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(wallet.id)
    expect(typeof view.create).toBe('object')
    expect(view.create.id).toBe(user.id)
    expect(view.value).toBe(wallet.value)
    expect(view.user).toBe(wallet.user)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = wallet.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(wallet.id)
    expect(typeof view.create).toBe('object')
    expect(view.create.id).toBe(user.id)
    expect(view.value).toBe(wallet.value)
    expect(view.user).toBe(wallet.user)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
