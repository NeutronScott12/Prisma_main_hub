import * as yup from 'yup'
import { decode } from 'jsonwebtoken'

import { Context } from '../../../tstypes'
import { ForbiddenError } from 'apollo-server'
import {
	INVALID_CREDENTIALS,
	FORGOT_PASSWORD_PREFIX,
	EXPIRED_KEY_ERROR,
	PASSWORD_SUCCESSFULLY_CHANGED
} from '../../../constants'
import { sendResetPasswordEmail } from '../../../utils/auth/emailHelpers'
import { logger } from '../../../utils/logger'
import { hashPassword } from 'scotts_utilities'
import { MutationResolvers } from '../../../generated/graphqlgen'

const schema = yup.object().shape({
	newPassword: yup.string().required()
})

export const resolvers = {
	Mutation: {
		async forgotPassword(
			_: any,
			{ email }: MutationResolvers.ArgsForgotPassword,
			{ db, redis, req }: Context
		): Promise<any> {
			try {
				const user = await db.user({
					email
				})

				if (!user) {
					return new ForbiddenError(INVALID_CREDENTIALS)
				} else {
					const url = req.get('origin') as string
					await sendResetPasswordEmail(user, redis, url)
					return {
						ok: true,
						result: `Email sent to ${user.email}`
					}
				}
			} catch (error) {
				logger.error({ level: '5', message: error })
				return {
					ok: true,
					result: error
				}
			}
		},
		async checkToken(
			_: any,
			{ token }: MutationResolvers.ArgsCheckToken,
			{ db }: Context
		): Promise<any> {
			try {
				let decoded: any
				if (token != null) {
					decoded = decode(token)
				}

				if (decoded == null) {
					throw new ForbiddenError(INVALID_CREDENTIALS)
				}

				const user = await db.user({
					id: decoded.user.id
				})

				if (user) {
					return {
						ok: true,
						result: `${user.username}`
					}
				} else {
					return {
						ok: true,
						result: INVALID_CREDENTIALS
					}
				}
			} catch (error) {
				logger.error({ level: '', message: error })
				return error
			}
		},
		async resetPassword(
			_: any,
			{ id, password }: MutationResolvers.ArgsResetPassword,
			{ db, redis }: Context
		): Promise<any> {
			try {
				const redisKey = `${FORGOT_PASSWORD_PREFIX}${id}`

				const userId = await redis.get(redisKey)

				if (!userId) {
					return {
						ok: false,
						result: EXPIRED_KEY_ERROR
					}
				}

				try {
					await schema.validate({ password }, { abortEarly: false })
				} catch (error) {
					return {
						ok: false,
						result: error
					}
				}

				const passwordHash: string = await hashPassword(password, 10)

				const updatedUser = db.updateUser({
					where: { id },
					data: { password: passwordHash }
				})

				const deleteKey = redis.del(redisKey)

				await Promise.all([updatedUser, deleteKey])

				return {
					ok: true,
					message: PASSWORD_SUCCESSFULLY_CHANGED
				}
			} catch (error) {
				logger.error({ level: '0', message: error })
				return error
			}
		}
	}
}
