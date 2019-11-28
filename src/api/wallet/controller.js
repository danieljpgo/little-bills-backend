import { success, notFound, authorOrAdmin } from '../../services/response/';
import { Wallet } from '.';

export const create = ({ user, bodymen: { body } }, res, next) =>
  Wallet.create({ ...body, user: user })
    .then(wallet => wallet.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Wallet.find(query, select, cursor)
    .populate('create')
    .then(wallets => wallets.map(wallet => wallet.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Wallet.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(wallet => (wallet ? wallet.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Wallet.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then(wallet => (wallet ? Object.assign(wallet, body).save() : null))
    .then(wallet => (wallet ? wallet.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Wallet.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then(wallet => (wallet ? wallet.remove() : null))
    .then(success(res, 204))
    .catch(next);
