import passport from 'passport'
import * as dotenv from 'dotenv'
import { User } from '../models/index.js'
import MicrosoftStrategy from 'passport-microsoft'
import assignRole from '../dev/roles.js'

dotenv.config()

passport.use(new MicrosoftStrategy.Strategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/microsoft/callback',
    scope: ['user.read']
  },
  async function(accessToken, refreshToken, profile, done) {
    var userData = {
      userId: profile.id,
      name: profile.name.givenName,
      surname: profile.name.familyName,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      accessToken: accessToken,
    };

    if (refreshToken)
      userData.refreshToken = refreshToken;
    if (profile.Alias)
      userData.alias = profile.Alias;
    const [user, created] = await User.upsert(userData);
    assignRole[user.email](user);
    done(null, user);
  }
));

passport.serializeUser(function(user, done){
  done(null, user.userId);
})

passport.deserializeUser(async function(id, done){
  try {
    const user = await User.findByPk(id, {raw: true});
    done(null, user)
  } catch (error) {
    done(error, null)
  }
  
})

export function isLoggedIn(req, res, next){
  req.user ? next() : res.sendStatus(401);
}