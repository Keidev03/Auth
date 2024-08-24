import { resolve } from "path"

const port = process.env.PORT || 3000
const baseURL = process.env.BASE_URL || 'http://localhost:3000'

const domainList = ['http://localhost:5173']

const uri: any = process.env.URI

const keyFilePath = resolve('secret.json')

const clientID: any = process.env.GOOGLE_CLIENT_ID
const clientSecret: any = process.env.GOOGLE_CLIENT_SECRET

const idFolder: any = process.env.FOLDER_AVATAR

const mailSend = process.env.MAIL_SEND
const mailPassword = process.env.MAIL_PASSWORD

const keyRefreshToken: any = process.env.KEY_REFRESH_TOKEN
const keyAccessToken: any = process.env.KEY_ACCESS_TOKEN

const redisPass: any =  process.env.REDIS_PASS

const scopes: any = ["https://www.googleapis.com/auth/drive"]

const env = {
     port,
     baseURL,
     domainList,
     uri,
     keyFilePath,
     scopes,
     clientID,
     clientSecret,
     idFolder,
     mailSend,
     mailPassword,
     keyRefreshToken,
     keyAccessToken,
     redisPass
}

export default env