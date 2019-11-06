import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, createExpense, createIncome, index, show } from './controller'
import { schema } from './model'
export Transaction, { schema } from './model'

const router = new Router()
const { wallet, category, value, description } = schema.tree

/**
 * @api {post} /transactions Create transaction
 * @apiName CreateTransaction
 * @apiGroup Transaction
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam wallet Transaction's wallet.
 * @apiParam category Transaction's category.
 * @apiParam value Transaction's value.
 * @apiParam description Transaction's description.
 * @apiSuccess {Object} transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ wallet, category, value, description }),
  create)

/**
* @api {post} /transactions/expense Create transaction expense
* @apiName CreateTransaction
* @apiGroup Transaction
* @apiPermission user
* @apiParam {String} access_token user access token.
* @apiParam wallet Transaction's wallet.
* @apiParam category Transaction's category.
* @apiParam value Transaction's value.
* @apiParam description Transaction's description.
* @apiSuccess {Object} transaction Transaction's data.
* @apiError {Object} 400 Some parameters may contain invalid values.
* @apiError 404 Transaction not found.
* @apiError 401 user access only.
*/
router.post('/expense',
  token({ required: true }),
  body({ wallet, category, value, description }),
  createExpense)

/**
* @api {post} /transactions/income Create transaction income
* @apiName CreateTransaction
* @apiGroup Transaction
* @apiPermission user
* @apiParam {String} access_token user access token.
* @apiParam wallet Transaction's wallet.
* @apiParam category Transaction's category.
* @apiParam value Transaction's value.
* @apiParam description Transaction's description.
* @apiSuccess {Object} transaction Transaction's data.
* @apiError {Object} 400 Some parameters may contain invalid values.
* @apiError 404 Transaction not found.
* @apiError 401 user access only.
*/
router.post('/income',
  token({ required: true }),
  body({ wallet, category, value, description }),
  createIncome)


/**
 * @api {get} /transactions Retrieve transactions
 * @apiName RetrieveTransactions
 * @apiGroup Transaction
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of transactions.
 * @apiSuccess {Object[]} rows List of transactions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /transactions/:id Retrieve transaction
 * @apiName RetrieveTransaction
 * @apiGroup Transaction
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

export default router
