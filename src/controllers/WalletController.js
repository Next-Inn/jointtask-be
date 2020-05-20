/**
 * this module controls everything about the user's wallet,
 * This module will use some methods from the paystack module in the service folder.
 */

import model from './../models';
import { validate, inValidName, inValidEmail, inValidPassword, magicTrimmer, emptyInput, inValidInput } from './../utils/validator';
import { sendErrorResponse, sendSuccessResponse } from './../utils/sendResponse';
import {  getBanks, verifyAccount, createRecipient, tokenize, charge, sendOtp } from '../services/paystackHelper';
import helperMethods from './../utils/helpers';
import { SendAnyMail } from '../services/emailsender';

const { Wallet, User, LoanRequest, WithdrawRequest,PaymentRef } = model;

export default {
    async listBanks(req, res) {
        try {
          const banks = await getBanks();
          if (banks) return sendSuccessResponse(res, 200, banks);
        } catch (e) {
          return sendErrorResponse(res, 500, 'An error occurred please try again');
        }
      },

       // verify account number using paystack
   async verifyAccountNumber(req, res) {
    try {
      const { account_number, code } = req.body;
      const schema = {
        account_number: inValidInput('Account Number', account_number),
        code: emptyInput(code),
      };
      const error = validate(schema);
      if (error) return sendErrorResponse(res, 422, error);
      const account = await verifyAccount(account_number, code);
      if (account.account_number === null) return sendErrorResponse(res, 404, account.error);
      return sendSuccessResponse(res, 200, account.account_name);
    } catch (e) {
      return sendErrorResponse(res, 500, 'An error occurred please try again');
     }
   },

     // create a wallet for a user
  async createWallet(req, res) {
    try {
      const { uuid, name, role } = req.userData;
      const { account_number, bank_code } = req.body;
      const schema = {
        account_number: inValidInput('Account number', account_number),
        code: emptyInput(bank_code),
      };
      const error = validate(schema);
      if (error) return sendErrorResponse(res, 422, error);
      const checkWallet = await helperMethods.findAWalletByUser(Wallet, uuid);
      if (checkWallet) return sendErrorResponse(res, 409, 'Wallet already exist');
      const recipient_id = await createRecipient('nuban', name, role, account_number, bank_code, 'NGN');
      if (recipient_id === 'error') return sendErrorResponse(res, 500, 'An error occurred please try again!!!');
      const wallet = await helperMethods.createUserWallet(uuid, recipient_id, Wallet);
      const createdWallet = await helperMethods.findAWalletByUuid(Wallet, wallet.uuid);
      return sendSuccessResponse(res, 200, createdWallet);
    } catch (e) {
      console.log(e);
      return sendErrorResponse(res, 500, 'An error occurred please try again!!!');
    }
  },

  // submit payment reference
  async SubmitPaymentRef(req, res) {
    try {
      const {
        uuid
      } = req.userData;
      const {
        status, reference, transaction
      } = req.body;
      const schema = {
        status: emptyInput(status),
        reference: emptyInput(reference),
        transaction: emptyInput(transaction)
      };
      const error = validate(schema);
      if (error) return sendErrorResponse(res, 422, error);
      await PaymentRef.create({
        user_uuid: uuid,
        status,
        transaction,
        reference
      });
      await User.update(
        { paid: true },
        { where: { uuid } },
      );
      return sendSuccessResponse(res, 200, `wallet loaded successfully`);
    } catch (e) {
      console.log(e);
      return sendErrorResponse(res, 500, 'An error occurred please try again!!!');
    }
  },

   // user load wallet
   async firstTimePayment(req, res) {
    try {
      const {
        uuid, role, name, email,
      } = req.userData;
      const {
        amount, cvv, expiry_month, expiry_year, number, pin, reference
      } = req.body;
      const schema = {
        ammount: emptyInput(amount),
        cvv: emptyInput(cvv),
        expiry_month: emptyInput(expiry_month),
        expiry_year: emptyInput(expiry_year),
        number: emptyInput(number),
        pin: emptyInput(pin),
      };
      const error = validate(schema);
      if (error) return sendErrorResponse(res, 422, error);
      const authorization_code = await tokenize({
        cvv, expiry_month, expiry_year, number,
      }, email);
      if (authorization_code === 'error') return sendErrorResponse(res, 400, 'An error occurred please try again!!!');
      const paymentStatus = await charge(amount, email, authorization_code, name, pin);
      if (paymentStatus.status === 'error') return sendErrorResponse(res, 400, paymentStatus.message);
      if (paymentStatus.status == 'send_otp') return sendSuccessResponse(
        res, 201, { message :paymentStatus.message, ref: paymentStatus.ref });
      await User.update(
        { paid: true },
        { where: { uuid } },
      );
      return sendSuccessResponse(res, 200, `wallet loaded successfully`);
    } catch (e) {
      console.log(e);
      return sendErrorResponse(res, 500, 'An error occurred please try again!!!');
    }
  },

  // request for loan 
   async requestForLoan(req, res) {
     try {
       const { uuid, name } = req.userData;
       const { accountName, accountNumber, email, amount, bank } = req.body;
       await LoanRequest.create({
         user_uuid: uuid,
         accountName,
         accountNumber,
         email,
         amount,
         bank
       });
       await SendAnyMail('admin@jointtaskfoundation.com', 'LOAN REQUEST', `${name} has requested for a loan`);
       return sendSuccessResponse(res, 200, 'Loan requested successfully'); 
     } catch (error) {
       console.log(error);
       return sendErrorResponse(res, 500, 'An error occurred while requesting for loan');
     }
   },

   // request withdrawal
   async requestForWithdrawal(req, res) {
    try {
      const { uuid, name } = req.userData;
      const { accountName, accountNumber, email, amount, bank } = req.body;
      const wallet = await helperMethods.findAWalletByUser(Wallet, uuid);
      if(!wallet)return sendErrorResponse(res, 404, 'No wallet found');
      if (parseInt(wallet.dataValues.balance, 10) >= parseInt(amount, 10)) return sendErrorResponse(res, 401, 'Low balance');
      await WithdrawRequest.create({
        user_uuid: uuid,
        accountName,
        accountNumber,
        email,
        amount,
        bank
      });
      await SendAnyMail('admin@jointtaskfoundation.com', 'WITHDRAWAL REQUEST', `${name} has requested for a withdrawal`);
      return sendSuccessResponse(res, 200, 'Loan requested successfully'); 
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, 'An error occurred while requesting for loan');
    }
  },

  // submit otp
   async submitOtp(req, res) {
    try {
      const {
        uuid, role, name, email,
      } = req.userData;
      const {
       otp, reference
      } = req.body;
      const schema = {
        otp: emptyInput(otp),
        reference: emptyInput(reference),
      };
      const error = validate(schema);
      if (error) return sendErrorResponse(res, 422, error);
      const status = await sendOtp(otp, reference);
      if (status.status === 'error') return sendErrorResponse(res, 400, paymentStatus.message);
      await User.update(
        { paid: true },
        { where: { uuid } },
      );
      return sendSuccessResponse(res, 200, `${paymentStatus.message}`);
    } catch (e) {
      console.log(e);
      return sendErrorResponse(res, 500, 'An error occurred please try again!!!');
    }
  },
}