import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { requireAuth, signUser } from './auth.js';

const app=express();
app.use(cors({origin:true}));
app.use(express.json({limit:'1mb'}));

const cleanUser = r => ({id:r.id,name:r.full_name,studentId:r.student_id,email:r.email,phone:r.phone,bio:r.bio,meta:r.student_id,initials:r.full_name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase(),rollNo:r.student_id});
const reportOut = r => ({...r,urgent:!!r.urgent,views:Number(r.views||0),matches:0,date:r.report_date,type:r.type,status:r.status});
function userById(id){ return db.prepare('SELECT * FROM users WHERE id=?').get(id); }
function ensureUser(id){ const u=userById(id); if(!u) throw new Error('User not found'); return u; }

app.get('/api/health',(req,res)=>res.json({ok:true,service:'LF_Hub API',database:'SQLite'}));

app.post('/api/auth/register', async (req,res)=>{
 try{
  const {fullName,studentId,email,password}=req.body;
  if(!fullName?.trim()||!studentId?.trim()||!email?.trim()||!password) return res.status(400).json({message:'Full name, student ID, email and password are required'});
  if(password.length<6) return res.status(400).json({message:'Password must be at least 6 characters'});
  const exists=db.prepare('SELECT id FROM users WHERE email=? OR student_id=?').get(email.trim().toLowerCase(),studentId.trim());
  if(exists) return res.status(409).json({message:'Email or student ID is already registered'});
  const hash=await bcrypt.hash(password,10);
  const result=db.prepare('INSERT INTO users(full_name,student_id,email,password_hash) VALUES(?,?,?,?)').run(fullName.trim(),studentId.trim(),email.trim().toLowerCase(),hash);
  const u=ensureUser(Number(result.lastInsertRowid)); const token=signUser(u);
  res.status(201).json({token,user:cleanUser(u)});
 }catch(e){res.status(500).json({message:'Registration failed'});}
});
app.post('/api/auth/login',async(req,res)=>{
 try{
  const {email,password}=req.body; const u=db.prepare('SELECT * FROM users WHERE email=?').get(String(email||'').trim().toLowerCase());
  if(!u||!(await bcrypt.compare(password||'',u.password_hash))) return res.status(401).json({message:'Invalid email or password'});
  res.json({token:signUser(u),user:cleanUser(u)});
 }catch{res.status(500).json({message:'Login failed'});}
});
app.get('/api/auth/me',requireAuth,(req,res)=>res.json({user:cleanUser(ensureUser(req.auth.id))}));

app.get('/api/reports',requireAuth,(req,res)=>{
 const {type,status,category,location,q,mine}=req.query; let sql='SELECT * FROM reports WHERE 1=1', args=[];
 if(type&&type!=='ALL'){sql+=' AND type=?';args.push(type)}
 if(status){sql+=' AND status=?';args.push(status)}
 if(category&&category!=='All'){sql+=' AND category=?';args.push(category)}
 if(location&&location!=='All Locations'){sql+=' AND location=?';args.push(location)}
 if(mine==='true'){sql+=' AND user_id=?';args.push(req.auth.id)}
 if(q){sql+=' AND (LOWER(item_name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)'; const x=`%${q.toLowerCase()}%`;args.push(x,x,x)}
 sql+=' ORDER BY datetime(created_at) DESC';
 res.json({reports:db.prepare(sql).all(...args).map(reportOut)});
});
app.post('/api/reports',requireAuth,(req,res)=>{
 const b=req.body;
 if(!b.itemName?.trim()||!b.category||!b.description?.trim()||!b.location?.trim()||!b.date||!['LOST','FOUND'].includes(b.type)) return res.status(400).json({message:'Required report fields are missing'});
 const r=db.prepare(`INSERT INTO reports(user_id,type,item_name,category,description,brand,color,location,report_date,time,location_details,contact_name,contact_email,contact_phone,urgent,handoff_preference,pickup_point) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(req.auth.id,b.type,b.itemName.trim(),b.category,b.description.trim(),b.brand||'',b.color||'',b.location.trim(),b.date,b.time||'',b.locationDetails||'',b.contactName||'',b.contactEmail||'',b.contactPhone||'',b.urgent?1:0,b.handoffPreference||'',b.pickupPoint||'');
 const id=Number(r.lastInsertRowid);
 db.prepare('INSERT INTO notifications(user_id,type,title,text,cta) VALUES(?,?,?,?,?)').run(req.auth.id,'summary','Report created',`Your ${b.type.toLowerCase()} report for ${b.itemName} was saved successfully.`,'View Report');
 res.status(201).json({report:reportOut(db.prepare('SELECT * FROM reports WHERE id=?').get(id))});
});
app.put('/api/reports/:id',requireAuth,(req,res)=>{
 const old=db.prepare('SELECT * FROM reports WHERE id=? AND user_id=?').get(req.params.id,req.auth.id); if(!old)return res.status(404).json({message:'Report not found'});
 const b={...old,...req.body};
 db.prepare(`UPDATE reports SET item_name=?,category=?,description=?,brand=?,color=?,location=?,report_date=?,time=?,location_details=?,contact_name=?,contact_email=?,contact_phone=?,urgent=?,handoff_preference=?,pickup_point=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`).run(b.itemName,b.category,b.description,b.brand||'',b.color||'',b.location,b.date||b.report_date,b.time||'',b.locationDetails||b.location_details||'',b.contactName||b.contact_name||'',b.contactEmail||b.contact_email||'',b.contactPhone||b.contact_phone||'',b.urgent?1:0,b.handoffPreference||b.handoff_preference||'',b.pickupPoint||b.pickup_point||'',b.status||old.status,req.params.id,req.auth.id);
 res.json({report:reportOut(db.prepare('SELECT * FROM reports WHERE id=?').get(req.params.id))});
});
app.delete('/api/reports/:id',requireAuth,(req,res)=>{
 const r=db.prepare('DELETE FROM reports WHERE id=? AND user_id=?').run(req.params.id,req.auth.id); if(!r.changes)return res.status(404).json({message:'Report not found'}); res.json({message:'Report deleted'});
});
app.patch('/api/reports/:id/resolve',requireAuth,(req,res)=>{
 const r=db.prepare("UPDATE reports SET status='RESOLVED',updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?").run(req.params.id,req.auth.id); if(!r.changes)return res.status(404).json({message:'Report not found'}); res.json({report:reportOut(db.prepare('SELECT * FROM reports WHERE id=?').get(req.params.id))});
});

app.get('/api/dashboard',requireAuth,(req,res)=>{
 const counts=db.prepare(`SELECT type, status, COUNT(*) count FROM reports GROUP BY type,status`).all();
 const total=(type)=>Number(db.prepare('SELECT COUNT(*) count FROM reports WHERE type=?').get(type).count);
 const recent=db.prepare('SELECT * FROM reports ORDER BY datetime(created_at) DESC LIMIT 6').all().map(reportOut);
 const matches=db.prepare(`SELECT l.id,l.item_name lost,l.color lost_color,f.item_name found,f.color found_color FROM reports l JOIN reports f ON l.type='LOST' AND f.type='FOUND' AND l.status='ACTIVE' AND f.status='ACTIVE' WHERE l.user_id=? AND (LOWER(l.item_name) LIKE '%'||LOWER(f.item_name)||'%' OR LOWER(f.item_name) LIKE '%'||LOWER(l.item_name)||'%') LIMIT 3`).all(req.auth.id).map((x,i)=>({id:x.id,lost:x.lost,found:x.found,time:'recent',confidence:Math.max(65,94-i*12)}));
 res.json({stats:{lost:total('LOST'),found:total('FOUND'),reunited:Number(db.prepare("SELECT COUNT(*) count FROM reports WHERE status='RESOLVED'").get().count),pending:Number(db.prepare("SELECT COUNT(*) count FROM reports WHERE status='ACTIVE'").get().count)},recent,matches});
});

app.get('/api/notifications',requireAuth,(req,res)=>res.json({notifications:db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY datetime(created_at) DESC').all(req.auth.id).map(n=>({...n,unread:!!n.unread,time:new Date(n.created_at).toLocaleString()}))}));
app.patch('/api/notifications/:id/read',requireAuth,(req,res)=>{db.prepare('UPDATE notifications SET unread=0 WHERE id=? AND user_id=?').run(req.params.id,req.auth.id);res.json({ok:true})});
app.patch('/api/notifications/read-all',requireAuth,(req,res)=>{db.prepare('UPDATE notifications SET unread=0 WHERE user_id=?').run(req.auth.id);res.json({ok:true})});

app.get('/api/profile',requireAuth,(req,res)=>res.json({user:cleanUser(ensureUser(req.auth.id)),prefs:(()=>{const u=ensureUser(req.auth.id);return {matchAlerts:!!u.match_alerts,messages:!!u.messages,weeklySummary:!!u.weekly_summary}})()}));
app.put('/api/profile',requireAuth,(req,res)=>{
 const b=req.body; db.prepare('UPDATE users SET full_name=?,phone=?,bio=?,match_alerts=?,messages=?,weekly_summary=? WHERE id=?').run(b.displayName||b.fullName||ensureUser(req.auth.id).full_name,b.phone||'',b.bio||'',b.prefs?.matchAlerts?1:0,b.prefs?.messages?1:0,b.prefs?.weeklySummary?1:0,req.auth.id);
 res.json({user:cleanUser(ensureUser(req.auth.id))});
});

const PORT=Number(process.env.PORT||5000);
app.listen(PORT,()=>console.log(`LF_Hub backend running at http://localhost:${PORT}`));
