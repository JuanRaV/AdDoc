import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const token = req.cookies._token;
  
    if (!token) {
      return res.redirect('/login');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };

export default authenticate;