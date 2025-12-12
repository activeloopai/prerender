const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({});
const bucketName = process.env.S3_BUCKET_NAME;

module.exports = {

	requestReceived: async function(req, res, next) {
		if(req.method !== 'GET') {
			return next();
		}

		let key = req.prerender.url;

		if (process.env.S3_PREFIX_KEY) {
			key = process.env.S3_PREFIX_KEY + '/' + key;
		}

		try {
			const command = new GetObjectCommand({
				Bucket: bucketName,
				Key: key
			});
			const result = await s3Client.send(command);
			const body = await result.Body.transformToString();
			return res.send(200, body);
		} catch (err) {
			next();
		}
	},

	pageLoaded: async function(req, res, next) {
		if(req.prerender.statusCode !== 200) {
			return next();
		}

		let key = req.prerender.url;

		if (process.env.S3_PREFIX_KEY) {
			key = process.env.S3_PREFIX_KEY + '/' + key;
		}

		try {
			const command = new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				ContentType: 'text/html;charset=UTF-8',
				StorageClass: 'REDUCED_REDUNDANCY',
				Body: req.prerender.content
			});
			await s3Client.send(command);
		} catch (err) {
			console.error(err);
		}

		next();
	}
};

