import cache from "express-redis-cache";
export const redisCache = cache({
  host: process.env.REDIS_HOST ,
  port: process.env.REDIS_PORT,
});
