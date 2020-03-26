import express from 'express';
import Auth from '../middlewares/Auth';
import WalletController from '../controllers/WalletController';

const router = express.Router();

router.get('/list-banks', WalletController.listBanks)
router.post('/verify-account-number', WalletController.verifyAccountNumber);
router.post('/create-wallet', Auth, WalletController.createWallet);
router.post('/initial-pay', Auth, WalletController.firstTimePayment);

export default router;
