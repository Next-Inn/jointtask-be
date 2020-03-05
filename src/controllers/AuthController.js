import token from 'uuid';
import model from './../models';
import { validate, inValidName, inValidEmail, inValidPassword, magicTrimmer } from './../utils/validator';
import { sendErrorResponse, sendSuccessResponse } from './../utils/sendResponse';
import { hashPassword, comparePassword } from './../utils/passwordHash';
import uploadImage from './../services/imageuploader';
import { SendMail } from './../services/emailsender';
import { createToken, verifyToken } from './../utils/processToken';
import { checkExpiredToken } from './../utils/dateChecker';
const { User, Token } = model;

//Returns token for logged/signup in Users
const userToken = (user) => {
	const { email, name, role, uuid } = user;
	return {
		token: createToken({
			uuid,
			name,
			email,
			role
		})
	};
};

const AuthController = {
	/**
 *
 * User Sign up logic
 */
	async signup (req, res, next) {
		try {
			// trims the req.body to remove trailling spaces
			const userData = magicTrimmer(req.body);
			// destructuring user details
			const { name, username, email, password, phone, address, role } = userData;
			// validation of inputs
			const schema = {
				name: inValidName('Full name', name),
				email: inValidEmail(email),
				password: inValidPassword(password)
			};

			// return console.log(schema);
			const validateErrors = validate(schema);
			if (validateErrors) return sendErrorResponse(res, 422, validateErrors);

			// checking if the username & email already exist
			const userName = await User.findOne({ where: { username } });
			const registeredEmail = await User.findOne({ where: { email } });
			if (userName) return sendErrorResponse(res, 409, 'Username Already Exist!!');
			if (registeredEmail) return sendErrorResponse(res, 409, 'Email Already Exist!!');

			//hash passwords and save in database
			const hashedPassword = hashPassword(password);
			const newUser = await User.create({
				username,
				name,
				email,
				address,
				password: hashedPassword,
				phone,
				role:

						role === 'user' ? 'user' :
						'admin'
			});

			//create a binary 64 string for user identity and save user
			const token = createToken(newUser.dataValues);
			// return console.log(token);
			await Token.create({
				user_uuid: newUser.dataValues.uuid
			});

			//send email verification mail
			SendMail(email, token, newUser.uuid);
			return sendSuccessResponse(res, 201, {
				message: 'Kindly Verify Account To Log In, Thanks!!'
			});
		} catch (e) {
			return next(e);
		}
	},

	async verifyUser (req, res, next) {
		try {
			// extracting the token and id from the query
			const { token, id } = req.query;
			// verify if the token exist
			const user = await verifyToken(token);
			const userrToken = await Token.findone({
				where: {
					user_uuid: id || user.uuid
				}
			});

			// validate user and verification status
			if (user.uuid !== id) return sendErrorResponse(res, 401, 'User is not available');
			if (!userrToken) return sendErrorResponse(res, 400, 'No User With The Token Supplied!!!');
			if (user.verified === true) return sendErrorResponse(res, 409, 'User is Already Verified!!!');

			// checking if the email link has expired
			const { createdAT } = userrToken.dataValues;
			const timeDiff = checkExpiredToken(createdAT);
			if (timeDiff !== 0) {
				return sendErrorResponse(
					res,
					400,
					'Email Link has Expired \n Click this button to get a new verification token'
				);
			}

			//if it passess all the valication
			await User.update(
				{
					verified: true,
					status: 'active'
				},
				{
					where: {
						uuid: id
					}
				}
			);

			return sendSuccessResponse(res, 200, '<h2>Your Account has benn Verified Succefully</h2>');
		} catch (e) {
			return next(e);
		}
	},

	async getNewEmailToken (req, res, next) {
		try {
			const { email = '', token = '' } = req.body;

			// get user and create amother token
			const user =
				token ? await verifyToken(token) :
				await User.findOne({ where: { email } });

			if (!user) return sendErrorResponse(res, 404, 'Email not available, please check and try again');

			// generate another token
			const anotherToken = userToken(user.dataValues);

			await SendMail(email, anotherToken, user.dataValues.uuid);
			return sendSuccessResponse(res, 200, 'Link Sent, Please Check your mail and Verify Accunt, Thanks!!!');
		} catch (e) {
			return next(e);
		}
	},

	async signin (req, res, next) {
		try {
			// extracting user data
			const { email, password, username } = req.body;

			// checking if the user exist
			const user =
				email ? await User.findOne({ where: { email } }) :
				await User.findOne({ where: { username } });

			if (!user) return sendErrorResponse(res, 404, 'User Not Found!!');

			// compare password
			const checkPassword = comparePassword(password, user.dataValues.password);
			if (!checkPassword) return sendErrorResponse(res, 400, 'Incorrect Password');

			// check user verification
			// if (!user.dataValues.verified) return sendErrorResponse(res, 401, 'Verify Your Account ');
			const token = userToken(user.dataValues);

			return sendSuccessResponse(res, 200, token);
		} catch (e) {
			return next(e);
		}
	},

	async me (req, res, next) {
		try {
			const user = req.userData;
			const profile = await User.findOne({
				where: { uuid: user.uuid },
				attributes: {
					exclude: [
						'password'
					]
				}
			});

			return sendSuccessResponse(res, 200, profile);
		} catch (e) {
			return next(e);
		}
	},

	// async logout (req, res, next) {
	// 	try {
	// 		// delete req.headers['authorization'];
	// 		// next();
	// 		return console.log(req.headers);
	// 		const { token } = req;

	// 		const userTokenTable = await Token.findOne({
	// 			where: {
	// 				user_uuid: user.uuid,
	// 				token
	// 			}
	// 		});
	// 		// return console.log(token);
	// 		await userTokenTable.destroy();

	// 		return sendSuccessResponse(res, 200, 'Succefully Logged out');
	// 	} catch (error) {
	// 		return sendErrorResponse(res, 400, error);
	// 	}
	// },

	async forgetPassword (req, res, next) {
		try {
			const { email } = req.body;
			// check if the email exist
			const user = await User.findOne({ where: { email } });
			if (!!user) return sendErrorResponse(res, 500, 'User Not Found!!');
			await User.update(
				{ password: hashedPassword },
				{
					returning: true,
					where: { email }
				}
			);

			return sendSuccessResponse(res, 200, 'Password Reset Successfull ');
		} catch (e) {
			return next(e);
		}
	},

	async resetPassword (req, res, next) {
		try {
			const { email, newPassword } = req.body;
			const hashedPassword = hashPassword(newPassword);
			const user = await User.findOne({ where: { email } });
			if (!!user) return sendErrorResponse(res, 500, 'User Not Found!!');
			await User.update(
				{ password: hashedPassword },
				{
					returning: true,
					where: { email }
				}
			);

			return sendSuccessResponse(res, 200, 'Password Reset Successfull ');
		} catch (e) {
			return next(e);
		}
	},

	async updateUser (req, res, next) {
		try {
			let avatar, profileDetails;
			const user = req.userData;
			const { name, phone, address } = req.body;
			// if there is a image
			if (req.file !== undefined) {
				avatar = await uploadImage(req.file);
				profileDetails = {
					avatar,
					name: name || user.name,
					phone: phone || user.phone,
					address: address || user.address
				};
			}
			else {
				profileDetails = {
					name: name || user.name,
					phone: phone || user.phone,
					address: address || user.address
				};
			}

			const profile = await User.update(profileDetails, {
				returning: true,
				where: { uuid: user.uuid }
			});

			return sendSuccessResponse(res, 200, profile);
		} catch (e) {
			return next(e);
		}
	}
};

export default AuthController;
