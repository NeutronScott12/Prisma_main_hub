// @ts-ignore
const cloudinary = require('cloudinary')
import { Response } from 'express'
import * as uuid from 'uuid/v4'

//@ts-ignore
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET
})

export const respond = (
	res: Response,
	status: number,
	boolean: boolean,
	data: Object | null
) => {
	return res.status(status).json({
		success: boolean,
		result: data
	})
}

// interface IProcessUpload {
// 	filename: stringType
// 	mimetype: stringType
// 	encoding: stringType
// 	key: string
// 	url: string
// 	Etag: string
// }

export const filteredBody = (body: any, whitelist: []) => {
	const items: any = {}

	Object.keys(body).forEach((key: any) => {
		// @ts-ignore
		if (whitelist.indexOf(key) >= 0) {
			items[key] = body[key]
		}
	})

	return items
}

// export const parseErrors = ({ errors }) => {
// 	const response = {}
// 	const result = forIn(errors, (key, value) => {
// 		response[value] = pick(key, ['path', 'message'])
// 	})
// 	return response
// }

export const processUpload = async (picture: string, folder: string) => {
	const myPicture: any = await picture
	const key = folder + '/' + uuid() + '-' + myPicture.filename

	console.log('STREAM', myPicture, key)

	let res: any

	const streamLoad = cloudinary.v2.uploader.upload_stream(function(
		error: any,
		result: any
	) {
		if (result) {
			res = {
				filename: myPicture.filename,
				mimitype: myPicture.mimetype,
				encoding: myPicture.encoding,
				key: result.key,
				url: result.secure_url,
				Etag: result.etag
			}
			return {
				filename: myPicture.filename,
				mimitype: myPicture.mimetype,
				encoding: myPicture.encoding,
				key: result.key,
				url: result.secure_url,
				Etag: result.etag
			}
		} else {
			throw Error(error)
		}
	})

	myPicture.createReadStream().pipe(streamLoad)

	const response = new Promise((resolve, _) => {
		// const chunks: any[] = []
		setInterval(() => {
			if (res) {
				return resolve(res)
			}
		}, 50)
	})

	return await response
}

// export class FetchError extends Error {
// 	constructor(details, ...params) {
// 		super(...params)

// 		if (Error.captureStackTrace) {
// 			Error.captureStackTrace(this, FetchError)
// 		}

// 		this.path = details

// 		this.date = new Date()
// 	}
// }

// export const parseErrors = ({ errors }) => {
// 	const response = []
// 	forIn(errors, (key, value) => {
// 		response.push(pick(key, ['path', 'message']))
// 	})
// 	return {
// 		ok: false,
// 		errors: response
// 	}
// }

// export const errorResponse = errors => {
// 	console.log('ERRORS', errors)
// 	if (errors instanceof Error.ValidationError) {
// 		return parseErrors(errors)
// 	} else if (errors instanceof Error.ValidatorError) {
// 		return parseErrors(errors)
// 	} else if (errors instanceof FetchError) {
// 		return errors.path
// 	} else {
// 		return {
// 			ok: false,
// 			result: 'error',
// 			errors: [{ path: 'Server', message: 'Something went wrong' }]
// 		}
// 	}
// }
