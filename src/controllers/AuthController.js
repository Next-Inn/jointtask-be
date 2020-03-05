import token from 'uuid';
import model from './../models';
import { validate, inValidName, inValidEmail, inValidPassword, magicTrimmer } from './../utils/validator';
import { sendErrorResponse, sendSuccessResponse } from './../utils/sendResponse';
import { hashPassword, comparePassword } from './../utils/passwordHash';
import uploadImage from './../services/imageuploader';
import { SendMail } from './../services/emailsender';
import { createToken } from './../utils/processToken';
const { User, Token } = model;

//Returns token for logged/signup in Users
const userToken = (user) => {
	const { email, name, role, uuid } = user;
	return {
		token: createToken({
			name,
			uuid,
			email,
			role
		})
	};
};
