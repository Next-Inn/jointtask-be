/**
 * this module controls everything about the user's stage,
 * the user down-lines,
 * the user promotion and the rest.
 * This module will use some methods from the util module.
 */

import model from './../models';
import { validate, inValidName, inValidEmail, inValidPassword, magicTrimmer } from './../utils/validator';
import { sendErrorResponse, sendSuccessResponse } from './../utils/sendResponse';

const { User, Token, UserAncestor } = model;

export default {
    async getUserDownlines(req, res) {
      try {
            const { email, uuid } = req.userData;
            // const { user_uuid } = req.query;
			const userTree = await User.findOne({ where: { uuid },
            include: {
              model: User,
              as: 'descendents',
              hierarchy: true
            } });;
			return sendSuccessResponse(res, 200, userTree);
      } catch (e) {
          console.log(e);
          return sendErrorResponse(res, 500, 'An error occurred');
      }
    },
}