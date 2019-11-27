import { success, notFound } from '../../services/response/'
import { Category } from '../category'
import { Transaction } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Transaction.create({ ...body, user })
    .then((transaction) => transaction.view(true))
    .then(success(res, 201))
    .catch(next)

export const createIncome = ({ user, bodymen: { body } }, res, next) =>
  Transaction.create({ ...body, user })
    .then((transaction) => transaction.view(true))
    .then(success(res, 201))
    .catch(next)

export const createExpense = ({ user, bodymen: { body } }, res, next) =>
  Transaction.create({ ...body, user })
    .then((transaction) => transaction.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Category.find({ 'type': query.categoryType }, select, cursor)
    .then((categories) => Transaction.find({ 'category': { $in: categories.map(category => category.id) } })
      .populate('user')
      .populate('wallet')
      .populate('category')
    )
    .then((transactions) => ({
      count: transactions.length,
      rows: transactions.map((transaction) => transaction.view(true))
    }))
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
