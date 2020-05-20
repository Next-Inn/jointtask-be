import express from 'express';
import Auth from '../middlewares/Auth';
import StageController from '../controllers/StageController';
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.get('/user/get-down-lines', Auth, StageController.getUserDownlines);
router.get('/user/get-stage-rewards', Auth, StageController.getUserStageReward);
router.post('/make-report', Auth, AuthController.sendUsReview);

export default router;
