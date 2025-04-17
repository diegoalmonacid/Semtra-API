import express from 'express'
import * as dotenv from 'dotenv'
import passport from 'passport'
dotenv.config()
const router = express.Router();

router.get('/', (req, res) =>{
  res.send('<a href="/api/auth/microsoft"> Authenticate with Outlook </a>')
})

router.get('/microsoft', passport.authenticate('microsoft', {
  prompt: 'select_account',
}))

router.get('/microsoft/callback', 
  passport.authenticate('microsoft', { failureRedirect: '/auth' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:5173/redirect');
});

router.get('/validate', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ message: 'Session is valid' });
  } else {
    res.status(401).send({ message: 'Session is invalid' });
  }
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {res.status(401).send({ message: 'Logout Error' }); return;}
    //console.log("ok")
    res.status(200).send({ message: 'Logged out' });
  });
});


export default router;