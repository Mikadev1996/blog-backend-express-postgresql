const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const db = require('./queries');


passport.use(
    new LocalStrategy((username, password, done) => {
        const queryText = 'SELECT * FROM users WHERE username = $1';
        const queryValues = [username];
        db.query(queryText, queryValues, (err, results) => {
            if (err) return done(err);

            const user = results.rows[0];
            if (!user) return done(null, false, { message: "Incorrect Username"});

            bcrypt.compare(password, user.password, (err, res) => {
                if (res) return done(null, user);
                else return done(null, false, { message: "Incorrect Password"});
            })
        })
    })
)

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY
    }, (jwtPayload, done) => {
        return done(null, jwtPayload);
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function (id, done) {
    const queryText = 'SELECT * FROM users WHERE user_id = $1';
    const queryValues = [id];

    db.query(queryText, queryValues, (err, results) => {
        const user = results.rows[0];
        done(err, user);
    })
})