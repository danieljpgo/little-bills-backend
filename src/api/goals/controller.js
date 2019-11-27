import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Goals } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Goals.create({ ...body, user })
    .then((goals) => goals.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Goals.count(query)
    .then(count => Goals.find(query, select, cursor)
      .populate('user')
      .then((goals) => ({
        count,
        rows: goals.map((goals) => goals.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Goals.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((goals) => goals ? goals.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Goals.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((goals) => goals ? Object.assign(goals, body).save() : null)
    .then((goals) => goals ? goals.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Goals.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((goals) => goals ? goals.remove() : null)
    .then(success(res, 204))
    .catch(next)
