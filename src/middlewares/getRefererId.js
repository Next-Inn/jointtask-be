import model from '../models';
import helperMethods from './../utils/helpers';
import { sendErrorResponse } from '../utils/sendResponse';
const { User } = model;

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
	try {
		const sponsorUserName = req.body.sponsorUserName;
		if (!sponsorUserName || sponsorUserName == '') {
			req.refererId = null;
			return next();
		}
		const referer = await helperMethods.getAUsernameUuid(User, sponsorUserName);
		if (!referer) return sendErrorResponse(res, 404, 'The referer you specified does not exist');
		console.log(referer);
		req.refererId = referer.dataValues.uuid;
		next();
	} catch (err) {
		const error =
			err.message ? 'UserName is Already Used' :
			err;
		next(error);
	}
};
