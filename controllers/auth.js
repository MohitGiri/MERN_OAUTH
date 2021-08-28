const User = require("../models/user")
const jwt = require("jsonwebtoken")
const expressJwt = require('express-jwt')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const cookieSession= require('cookie-session');


//passport.use(User.createStrategy());

//here we take the user from callback function and grab info from user and stuff in cookie to send across browser
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

//deserializing 
passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
    done(null,user);
    });
   
});

var myemail ="",accesstoken = ""
var myprofile = {}
passport.use(
    new GoogleStrategy({
        // options for google strategy
        callbackURL:'http://localhost:8000/api/auth/google/profile',
        clientID: keys.google.clientID,
        clientSecret:keys.google.clientSecret
        //accessToken is used to access the users profile,mails
        //refreshtoken is cause the accesstoken expires after a while
        //profile is the one that brings back info from google
        //done fucntion is called after we are done with callback
    },   function(accessToken, refreshToken, profile, done) {
        //check user table for anyone with a google ID of profile.id
         myprofile = profile
        console.log(profile)
        console.log(accessToken)
        User.findOne({
            'googleId': profile.id 
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Google (all the profile. stuff)
            if (!user) {
                user = new User({
                    _id : profile.id,
                    name: profile.name.givenName,
                    lastname :profile.name.familyName,
                    email: profile.emails[0].value,
                   // username: profile.username,
                    googleId : profile.id,
                    //provider: 'facebook',
                    //role: 1,
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    //facebook: profile._json
                });
                user.save(function(err,user) {
                    if (err) console.log(err);
                    myemail = user.email
                    return done(err, user);
                });
            } else {
                //found user. Return
              // accesstoken = accessToken;
                
                return done(err, user);
            }
        });
    })
);




// AUTHENTICATION USING JWT For Admin




const JWT_SECRET ="sshhhh"

// Signup for Admin
exports.signup = (req,res)=>{
   
    // User.findById({_id : '101366167747138013001'},(err,user)=>{
    //     if(err){ 
    //        return res.status(400).json({
    //         error : "User id is not present in database"
    //         })
    //  }
    //   user.encry_passowrd = req.body.password;
    //   user.save((err,user)=>{
    //     if(err){ 
    //         console.log(err)
    //         return res.status(400).json({
    //         err : "User is not saved in database"
    //     }) 
    // }
    //  res.json(user);
    //   res.json({
    //       name : user.name,
    //       email: user.email,
    //       id : user._id
    //   })
     
    // })
    // })

    const user = new User(req.body)
    //user._id  = myprofile.id;
    user.save((err,user)=>{
        if(err){ 
            console.log(err)
            return res.status(400).json({
            err : "User is not saved in database"
        }) 
    }
     res.json(user);
      res.json({
          name : user.name,
          email: user.email,
          id : user._id
      })
    })
}

exports.signin = (req,res)=>{
   // const {email,password} = req.body;
      
    User.findOne({'_id': myprofile.id},(err,user)=>{
        if(err || !user){ 
           return res.status(400).json({
            error : "User email is not present in database"
            })
     }
     
    //  if(!user.authenticate(password)){
    //     return res.status(400).json({
    //          error : "Email and password do not match"
    //      })
    //  }
    
     // Save Token
    //  var token = accesstoken
     
    //  res.cookie("token",token,{expire : new Date() + 999}); 
        
    //  const {googleId,name,email,role} =user;
     
    //  return res.json({token,user : {googleId,name,email,role}})
    const token = jwt.sign({_id : user._id},JWT_SECRET)
     
    res.cookie("token",token,{expire : new Date() + 999}); 
       
    const {_id,name,email,role} =user;
    
    return res.json({token,user : {_id,name,email,role}})



    })
}



// exports.signinAdmin = (req,res)=>{
//     const {email,password} = req.body;
      
//     User.findOne({email},(err,user)=>{
//         if(err || !user){ 
//            return res.status(400).json({
//             error : "User email is not present in database"
//             })
//      }
     
//      if(!user.authenticates(password)){
//         return res.status(400).json({
//              error : "Email and password do not match"
//          })
//      }
    
//      // Create Token
//      const token = jwt.sign({_id : user._id},JWT_SECRET)
     
//      res.cookie("token",token,{expire : new Date() + 999}); 
        
//      const {_id,name,email,role} =user;
     
//      return res.json({token,user : {_id,name,email,role}})
//     })
// }


exports.signout = (req,res)=>{

   res.clearCookie("token")
    
    
    res.json({
        message : "Signout successful"
    });
    

}

// protected routes
exports.isSignedIn = expressJwt({
     secret: JWT_SECRET,
     algorithms: ['HS256'],
     userProperty : "auth" 
    // setting properties in user browser using cookies     
});


// exports.isSignedIn = cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [keys.session.cookieKey]
// });


// custom middlewares
exports.isAuthenticated = (req,res,next)=>{
    let permission = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!permission){
      return res.status(403).json({
          error : "ACCESS DENIED"
      })
    }
    next();
}

// exports.isAuthenticated = (req,res,next)=>{
//     let permission = req.profile && req.profile._id == myprofile._id;
//     if(!permission){
//       return res.status(403).json({
//           error : "ACCESS DENIED"
//       })
//     }
//     next();
// }

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0) return res.status(403).json({
        error : "Not Admin, ACCESS DENIED"
    })
    next();
}

// 0-> user , 1->admin
// exports.isAdmin = (req,res,next)=>{
//     if(req.profile.role === 0) return res.status(403).json({
//         error : "Not Admin, ACCESS DENIED"
//     })
//     next();
// }

