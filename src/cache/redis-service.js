class CacheService {
	constructor() {
	this._client = createClient({
	socket: {
		host: process.env.REDIS_SERVER,
		
	},
	});

	this._client.on('error', (error) => {
		console.error(error);
	});

	this._client.connect();
	
  }
}
