import { success, notFound } from '../../services/response/'
import { Transaction } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Transaction.create({ ...body, user })
    .then((transaction) => transaction.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Transaction.count(query)
    .then(count => Transaction.find(query, select, cursor)
      .populate('user')
      .populate('category')
      .populate('wallet')
      .then((transactions) => ({
        count,
        rows: transactions.map((transaction) => transaction.view(true))
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Transaction.findById(params.id)
    .populate('user')
    .populate('category')
    .populate('wallet')
    .then(notFound(res))
    .then((transaction) => transaction ? transaction.view(true) : null)
    .then(success(res))
    .catch(next)