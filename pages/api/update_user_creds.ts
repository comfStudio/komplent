import { BAD_REQUEST, OK, CREATED, NOT_FOUND } from 'http-status-codes'
import microCors from 'micro-cors'

import { error_message, data_message } from '@utility/message'
import {
    with_auth_middleware,
    ExApiRequest,
    ExApiResponse,
} from '@server/middleware'
import { update_user_creds, login_user_without_password } from '@services/user'
import { User } from '@db/models'

const cors = microCors({ allowMethods: ['PUT', 'POST', 'OPTIONS'] })

/**
 * 
 * @api {POST} /update_user_creds Update User Credentials
 * @apiName UpdateUserCreds
 * @apiGroup User
 * @apiVersion  0.1.0
 * 
 * 
 * @apiParam  {Object} data={username:undefined,email:undefined,password:undefined} an object with new user credentials 
 * 
 * @apiSuccess (200) {Object} user user object
 * @apiSuccess (200) {String} token new login token
 * 
 * @apiParamExample  {JSON} Request-Example:
 * {
 *     username : "new name123",
 *     email : "newmail123@test.com",
 *     old_password : "new_pass12234"
 *     password : "new_pass12234"
 * }
 * 
 * 
 * @apiSuccessExample {JSON} Success-Response:
 * {
 *     data: { 
 *          user : {...},
 *          token: "456567fhgcfjn567uyhj...."
 *         }
 * }
 * 
 * 
 */
export default with_auth_middleware(
    async (req: ExApiRequest, res: ExApiResponse) => {
        try {
            const { data } = req.json

            let r = {
                user: undefined,
                token: undefined
            }

            r.user = await update_user_creds(await User.findById(req.user._id).select("+password email username"), data, {randomize_username: false, require_old_password: true})
            
            if (data.password) {
                r.token = await login_user_without_password(r.user, req, res)
            } else {
                r.token = req.session.jwt_token
            }
            
            r.user = { ...r.user.toJSON(), password: undefined }

            res.status(OK).json(data_message(r))

        } catch (err) {
            res.status(BAD_REQUEST).json(error_message(err.message))
        }
    }
)
