import passport from 'passport';

export default function isAuth(req, res, next) {
    passport.authenticate('jwt', { session: true }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
}