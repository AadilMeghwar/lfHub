import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'lfhub-dev-secret-change-me';
export function signUser(user){ return jwt.sign({id:user.id,email:user.email}, SECRET, {expiresIn:'7d'}); }
export function requireAuth(req,res,next){
 const h=req.headers.authorization||'';
 const token=h.startsWith('Bearer ')?h.slice(7):null;
 if(!token) return res.status(401).json({message:'Authentication required'});
 try { req.auth=jwt.verify(token,SECRET); next(); } catch { return res.status(401).json({message:'Invalid or expired token'}); }
}
