import model from '../models';
import helperMethods from './../utils/helpers';
const { User } = model;

// eslint-disable-next-line consistent-return
export default async (req, res, next) => {
	try {
		const sponsorUserName = req.body.sponsorUserName;
		if (!sponsorUserName || sponsorUserName == '') {
			req.sponsorId = null;
			return next();
		}
		const refererId = await helperMethods.getAUsernameUuid(User, sponsorUserName);
		req.sponsorId = refererId.dataValues.uuid;
		next();
	} catch (err) {
		const error =
			err.message ? 'UserName is Already Used' :
			err;
		next(error);
	}
};
