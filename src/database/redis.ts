import { createClient, RedisClientType } from 'redis'
import config from '../config'

let redisClient: RedisClientType


const Redis = async () => {
       try {
              redisClient = createClient({
                     password: config.env.redisPass,
                     socket: {
                            host: 'redis-18754.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com',
                            port: 18754
                     }
              })

              redisClient.on('error', (err) => {
                     console.error('Redis Client Error:', err)
              })

              await redisClient.connect()
              console.log('Connected to Redis')
       } catch (error) {
              console.error('Failed to connect to Redis:', error)
       }
}

Redis()

const RedisClient = (): RedisClientType => {
       if (!redisClient) {
              throw new Error('Redis client is not initialized')
       }
       return redisClient
}

export default RedisClient

