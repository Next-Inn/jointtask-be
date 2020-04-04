/**
 * this module controls everything about the user's stage,
 * the user down-lines,
 * the user promotion and the rest.
 * This module will use some methods from the util module.
 */

import model from './../models';
import { validate, inValidName, inValidEmail, inValidPassword, magicTrimmer } from './../utils/validator';
import { sendErrorResponse, sendSuccessResponse } from './../utils/sendResponse';
import getUserStageAndReward from '../utils/StageHelper';
import helperMethods from '../utils/helpers';

const { User, Token, UserAncestor, Wallet } = model;

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
            } });
			return sendSuccessResponse(res, 200, userTree);
      } catch (e) {
          console.log(e);
          return sendErrorResponse(res, 500, 'An error occurred');
      }
    },

    // calculate user stage and reward 
    async getUserStageReward(req, res){
      try {
        const { email, uuid } = req.userData;
        const downlines = await helperMethods.getUserDownlines(User, uuid);
        if (downlines.children.length == 0) return sendSuccessResponse(res, 201, { stage_completed: 0, reward: { balance: 0}})
        const stage_reward = await getUserStageAndReward(downlines.children);
        const formerBalance = await helperMethods.findAWalletByUser(Wallet, uuid);
        if (!formerBalance) return sendErrorResponse(res, 404, 'Wallet not found');
        const newBalance = formerBalance.balance + stage_reward.reward.balance;
        await helperMethods.updateWalletByUserId(Wallet, uuid, newBalance);
        await User.update(
          { stage_completed: stage_reward.stage_completed},
          {where: { uuid }}
        )
        return sendSuccessResponse(res, 200, stage_reward);
      } catch (error) {
        console.log(error);
        return sendErrorResponse(res, 500, 'An error occurred');
      }
    }
};