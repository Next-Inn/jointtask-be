/* eslint-disable max-len */
import Sequelize, { Op, fn, col, and } from 'sequelize';

const helperMethods = {

	// create a wallet 
	async createUserWallet(user_uuid, recipient_id, Wallet ) {
		const wallet = await Wallet.create({
			user_uuid,
			balance: 0.0,
			reference_id: recipient_id,
		  });
		  return wallet
	},

	// update a wallet by user uuid
    async updateWalletByUserId(Wallet, uuid, newBalance) {
		const wallet  = await Wallet.update(
			{ balance : newBalance},
			{where: { user_uuid: uuid }}
			);
		return wallet;
	},

	// find a wallet by the user id
	async findAWalletByUser (
		Wallet,
		uuid,
		exclude = [
			'reference_id'
		]
	) {
		const wallet = await Wallet.findOne({
			where: { user_uuid: uuid },
			attributes: { exclude }
		});
		return wallet;
	},

	// find a wallet by the uuid of the wallet
	async findAWalletByUuid (
		Wallet,
		uuid,
		exclude = [
			'reference_id'
		]
	) {
		const wallet = await Wallet.findOne({
			where: { uuid },
			attributes: { exclude }
		});
		return wallet;
	},

	// create a transaction object
	createTransaction (
		user_uuid,
		wallet_id,
		recipient_id,
		job_uuid,
		transaction_type,
		purpose,
		status = '',
		balance = 0,
		amount = 0
	) {
		return {
			user_uuid,
			wallet_id,
			recipient_id,
			job_uuid,
			transaction_type,
			purpose,
			status,
			balance,
			amount
		};
	},

	// find a user by uuid
	async getAUserByUuid (User, uuid, exclude) {
		const user = await User.findOne({
			where: { uuid },
			attributes: {
				exclude
			}
		});
		return user;
	},

	//find user by username
	async getAUsernameUuid (User, username) {
		const user = await User.findOne({
			where: { username },
			attributes: [
				'uuid'
			]
		});

		return user;
	},

	// get all users
	async signUpValidations (User) {
		const users = await User.findAll({
			attributes: [
				'uuid',
				'username',
				'email',
			],
			order: [
				[
					'username',
					'ASC'
				]
			],
			raw: true
		});
		return users;
	},

	// search for a stock
	async searchForUser (table, input) {
		const users = await table.findAll({
			where: {
				[Op.or]: [
					{ name: { [Op.iLike]: `%${input}%` } },
					{ username: { [Op.iLike]: `%${input}%` } },
					{ email: { [Op.iLike]: `%${input}%` } }
				]
			},
			order: [
				[
					'createdAt',
					'DESC'
				]
			],
			attributes: {
				exclude: [
					'createdAt',
					'password',
					'password',
					'updatedAt'
				]
			}
		});
		return users;
	},
	// list all data in a table
	async listAllDataInTable (table) {
		const datas = await table.findAll({
			attributes: {
				exclude: [
					'createdAt',
					'password',
					'updatedAt'
				]
			},
			order: [
				[
					'createdAt',
					'DESC'
				]
			]
		});
		return datas;
	},
  async getUserDownlines(User, uuid) {
	const dLines =await User.findOne({ where: { uuid },
		include: {
		  model: User,
		  as: 'descendents',
		  hierarchy: true
		} });
		return dLines;
  }
};
export default helperMethods;
