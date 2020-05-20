import express from 'express';
import Auth from '../middlewares/Auth';
import WalletController from '../controllers/WalletController';

const router = express.Router();

router.get('/list-banks', WalletController.listBanks)
router.post('/verify-account-number', WalletController.verifyAccountNumber);
router.post('/create-wallet', Auth, WalletController.createWallet);
router.post('/initial-pay', Auth, WalletController.firstTimePayment);
router.post('/submit-otp', Auth,WalletController.submitOtp);
router.post('/request-loan', Auth, WalletController.requestForLoan);
router.post('/request-withdrawal', Auth, WalletController.requestForWithdrawal);
router.post('/payment/reference', Auth, WalletController.SubmitPaymentRef);

export default router;
