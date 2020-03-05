import cloudinary from 'cloudinary';
import uuid from 'uuid';
import path from 'path';
import Datauri from 'datauri';
import upload from '../utils/multer-config';

require('../config/cloudinaryconfig');

const duri = new Datauri();

const uploadimage = async (file, public_id = '') => {
	upload.single('file');
	const dataUri = duri.format(path.extname(file.originalname).toString(), file.buffer);
	const { content } = dataUri;
	const result = await cloudinary.v2.uploader.upload(content, {
		public_id:

				public_id !== '' ? `media_mall/${public_id}` :
				`media_mall/${uuid()}`
	});
	return result.secure_url;
};

const uploadVideo = async (file, public_id = '') => {
	upload.single('file');
	const dataUri = duri.format(path.extname(file.originalname).toString(), file.buffer);
	const { content } = dataUri;
	const result = await cloudinary.v2.uploader.upload(content, {
		public_id:

				public_id !== '' ? `media_mall/${public_id}` :
				`media_mall/${uuid()}`,
		resource_type: 'video'
	});
	return result.secure_url;
};

const uploadAFile = async (file_name, buffer, public_id = '') => {
	upload.single('file');
	const dataUri = duri.format(path.extname(file_name).toString(), buffer);
	const { content } = dataUri;
	const result = await cloudinary.v2.uploader.upload(content, {
		public_id:

				public_id !== '' ? `media_mall/${public_id}` :
				`media_mall/${uuid()}`,
		resource_type: 'auto'
	});
	return result.secure_url;
};

export default uploadimage;

export { uploadVideo, uploadAFile };
