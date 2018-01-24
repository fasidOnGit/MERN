const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';
export default {
	mongodbUri: 'mongodb://fasiOnMongo:11mse1060@ds111138.mlab.com:11138/fasid',
	port:env.PORT || 8080,
	host: env.HOST || '0.0.0.0',
	get serverUrl() {
		return `http://${this.host}:${this.port}`;
	}
};