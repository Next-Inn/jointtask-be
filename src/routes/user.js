import express from 'express';
import Auth from '../middlewares/Auth';
import StageController from '../controllers/StageController';

const router = express.Router();

router.get('/user/get-down-lines', Auth, StageController.getUserDownlines);
router.get('/user/get-stage-rewards', Auth, StageController.getUserStageReward);

export default router;
