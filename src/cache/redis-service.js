import redis from 'redis';

class CacheService {
	constructor() {
	this._client = redis.createClient({
	socket: {
		host: process.env.REDIS_SERVER,
		
	},
	});

	this._client.on('error', (error) => {
		console.error(error);
	});

	this._client.connect();
	
  }
  
  async set(key, value, expirationInSecond = 3600) {
	  try {
		  await this._client.set(key, value, {
			  EX: expirationInSecond,
		  });
	  } catch (error) {
		  console.error('REDIS SET error: ', error);
		  throw error;
	  }
  }
  
  async get(key) {
	  try {
		  const result = await this._client.get(key);
		  return result;
	  } catch (error) {
		  console.error('REDIS GET error: ', error);
		  throw error;
	  }
  }
  
  async delete(key) {
	  try {
		  await this._client.del(key);
		  
	  } catch (error) {
		  console.error('REDIS DELETE error: ', error);
		  throw error;
	  }
  }
  
  async quit() {
	  await this._pool.quit();
  }
}

export default CacheService;