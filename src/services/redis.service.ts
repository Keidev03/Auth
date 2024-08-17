import { RedisClientType } from 'redis';
import RedisClient from '../database/redis'

const redisClient: RedisClientType = RedisClient()

const FindAllToken = async () => {
       try {
              let cursor: number = 0
              const allKeyValues: any[] = []
              do {
                     const scanResult = await redisClient.scan(cursor, {
                            MATCH: '*',
                            COUNT: 100
                     });
                     cursor = scanResult.cursor
                     const keys = scanResult.keys

                     for (const key of keys) {
                            const value = await redisClient.get(key)
                            allKeyValues.push({ key, value })
                     }
              } while (cursor !== 0)

              return allKeyValues

       } catch (err) {
              console.error('Error fetching key-values:', err)
       }
}

const SetDataRedis = async (key: string, value: string, options?: { EX: any }) => {
       try {
              const keyToken = key.split(".")[2]
              await redisClient.set(keyToken, value, options)
              return "Data set successfully"
       } catch (error) {
              console.error('Error setting data in Redis:', error)
              throw new Error('Failed to set data in Redis')
       }
}

const GetDataRedis = async (key: string): Promise<string | null> => {
       try {
              const keyToken = key.split(".")[2]
              const result = await redisClient.get(keyToken)
              if (result === null) {
                     console.log(`No data found for key: ${keyToken}`)
                     return null
              }
              return result
       } catch (error) {
              console.error('Error getting data from Redis:', error)
              throw new Error('Failed to get data from Redis')
       }
}

const DelDataRedis = async (key: string): Promise<string> => {
       try {
              const keyToken = key.split(".")[2]
              await redisClient.del(keyToken)
              return "Delete successful"
       } catch (error) {
              console.error('Error deleting data from Redis:', error)
              throw new Error('Failed to delete data from Redis')
       }
};

export { FindAllToken, SetDataRedis, GetDataRedis, DelDataRedis }