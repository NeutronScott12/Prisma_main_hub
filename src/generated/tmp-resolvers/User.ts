// This resolver file was scaffolded by github.com/prisma/graphqlgen, DO NOT EDIT.
// Please do not import this file directly but copy & paste to your application code.

import { UserResolvers } from '../graphqlgen'

//@ts-ignore
export const User: UserResolvers.Type = {
	...UserResolvers.defaultResolvers,

	notifications: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	directMessages: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	avatar_url: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	blockedUsers: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	friends: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	friend_requests: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	teams: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	channels: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	owned_teams: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	},
	owned_channels: (parent, args, ctx) => {
		throw new Error('Resolver not implemented')
	}
}
