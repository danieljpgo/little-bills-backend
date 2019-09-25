import { Goals } from '.'
import { User } from '../user'

let user, goals

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  goals = await Goals.create({ user, startTime: 'test', endTime: 'test', startValue: 'test', endValue: 'test', status: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = goals.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(goals.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.startTime).toBe(goals.startTime)
    expect(view.endTime).toBe(goals.endTime)
    expect(view.startValue).toBe(goals.startValue)
    expect(view.endValue).toBe(goals.endValue)
    expect(view.status).toBe(goals.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = goals.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(goals.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.startTime).toBe(goals.startTime)
    expect(view.endTime).toBe(goals.endTime)
    expect(view.startValue).toBe(goals.startValue)
    expect(view.endValue).toBe(goals.endValue)
    expect(view.status).toBe(goals.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
