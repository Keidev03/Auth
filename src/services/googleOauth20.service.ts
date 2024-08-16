import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import { Callback } from "mongoose"

import config from "../config"

const GoogleOauth20 = () => {
    passport.use(new Strategy({
        clientID: config.env.clientID,
        clientSecret: config.env.clientSecret,
        callbackURL: `${config.env.baseURL}/auth/google/callback`
    },
        function (accessToken: string, refreshToken: string, profile: any, cb: Callback) {
            cb(null, profile)
        }
    ))
}

export default GoogleOauth20