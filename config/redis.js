import { createClient } from 'redis';

const client = createClient({
  url: 'redis://localhost:6379'
});

let redisPromise = null;

async function getRedis() {
  if (!redisPromise) {
    console.log('Connecting to Redis...');
    redisPromise = client.connect().then(() => {
      console.log('Redis connected');
      return client;
    });
  }
  await redisPromise;
  return client;
}

export default getRedis;
