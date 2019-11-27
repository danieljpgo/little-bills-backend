import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Goals, { schema } from './model'

const router = new Router()
const { startTime, endTime, startValue, endValue, status } = schema.tree

let reqSchema = {
  user: {
    type: String
  }
} 

/**
 * @api {post} /goals Create goals
 * @apiName CreateGoals
 * @apiGroup Goals
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam startTime Goals's startTime.
 * @apiParam endTime Goals's endTime.
 * @apiParam startValue Goals's startValue.
 * @apiParam endValue Goals's endValue.
 * @apiParam status Goals's status.
 * @apiSuccess {Object} goals Goals's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Goals not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ startTime, endTime, startValue, endValue, status }),
  create)

/**
 * @api {get} /goals Retrieve goals
 * @apiName RetrieveGoals
 * @apiGroup Goals
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of goals.
 * @apiSuccess {Object[]} rows List of goals.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(reqSchema),
  index)

/**
 * @api {get} /goals/:id Retrieve goals
 * @apiName RetrieveGoals
 * @apiGroup Goals
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} goals Goals's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Goals not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /goals/:id Update goals
 * @apiName UpdateGoals
 * @apiGroup Goals
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam startTime Goals's startTime.
 * @apiParam endTime Goals's endTime.
 * @apiParam startValue Goals's startValue.
 * @apiParam endValue Goals's endValue.
 * @apiParam status Goals's status.
 * @apiSuccess {Object} goals Goals's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Goals not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ startTime, endTime, startValue, endValue, status }),
  update)

/**
 * @api {delete} /goals/:id Delete goals
 * @apiName DeleteGoals
 * @apiGroup Goals
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Goals not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
