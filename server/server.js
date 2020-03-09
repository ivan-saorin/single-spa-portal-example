const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
var cors = require('cors');
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./database.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = 'example.com/portal';

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Create a token from a payload 
function createToken(payload){
  /*
  4.1.1. "iss" (Issuer) Claim
The iss (issuer) claim identifies the principal that issued the JWT. The processing of this claim is generally application specific. The iss value is a case-sensitive string containing a StringOrURI value. Use of this claim is OPTIONAL.

4.1.2. "sub" (Subject) Claim
The sub (subject) claim identifies the principal that is the subject of the JWT. The claims in a JWT are normally statements about the subject. The subject value MUST either be scoped to be locally unique in the context of the issuer or be globally unique. The processing of this claim is generally application specific. The sub value is a case-sensitive string containing a StringOrURI value. Use of this claim is OPTIONAL.

4.1.3. "aud" (Audience) Claim
The aud (audience) claim identifies the recipients that the JWT is intended for. Each principal intended to process the JWT MUST identify itself with a value in the audience claim. If the principal processing the claim does not identify itself with a value in the aud claim when this claim is present, then the JWT MUST be rejected. In the general case, the aud value is an array of case-sensitive strings, each containing a StringOrURI value. In the special case when the JWT has one audience, the aud value MAY be a single case-sensitive string containing a StringOrURI value. The interpretation of audience values is generally application specific. Use of this claim is OPTIONAL.

4.1.4. "exp" (Expiration Time) Claim
The exp (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing. The processing of the exp claim requires that the current date/time MUST be before the expiration date/time listed in the exp claim. Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew. Its value MUST be a number containing a NumericDate value. Use of this claim is OPTIONAL.

4.1.5. "nbf" (Not Before) Claim
The nbf (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing. The processing of the nbf claim requires that the current date/time MUST be after or equal to the not-before date/time listed in the nbf claim. Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew. Its value MUST be a number containing a NumericDate value. Use of this claim is OPTIONAL.

4.1.6. "iat" (Issued At) Claim
The iat (issued at) claim identifies the time at which the JWT was issued. This claim can be used to determine the age of the JWT. Its value MUST be a number containing a NumericDate value. Use of this claim is OPTIONAL.

4.1.7. "jti" (JWT ID) Claim
The jti (JWT ID) claim provides a unique identifier for the JWT. The identifier value MUST be assigned in a manner that ensures that there is a negligible probability that the same value will be accidentally assigned to a different data object; if the application uses multiple issuers, collisions MUST be prevented among values produced by different issuers as well. The jti claim can be used to prevent the JWT from being replayed. The jti value is a case-sensitive string. Use of this claim is OPTIONAL.
*/
  let adminGroups = ['guest', 'admin'];
  let guestGroups = ['guest'];

  payload.iss = 'example.com';
  payload.sub = 'portal';
  payload.aud = ['app1Angular8', 'app2Angular9', 'app4React'];
  payload.exp = Math.floor(Date.now() / 1000) + (60 * 60); // 1h
  payload.nbf = Math.floor(Date.now() / 1000) - 10; // now - 10 sec to account for server client timing misallignment
  payload.iat = Math.floor(Date.now() / 1000);
  payload.jti = makeid(10);
  if (payload.user == 'admin') {
    payload.groups = adminGroups;
  }
  else {
    payload.groups = guestGroups;
  }
  return jwt.sign(payload, SECRET_KEY);
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({user, password}){
  console.log(user);
  console.log(password);
  console.log(userdb.users);
  return userdb.users.findIndex(u => u.user === user && u.password === password) !== -1
}

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const {user, password} = req.body;

  if(isAuthenticated({user, password}) === true) {
    const status = 401;
    const message = 'User and Password already exist';
    res.status(status).json({status, message});
    return
  }

fs.readFile("./users.json", (err, data) => {  
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({status, message})
      return
    }

    // Get current users data
    data = JSON.parse(data.toString());

    // Get the id of last user
    var last_item_id = data.users[data.users.length-1].id;

    //Add new user
    data.users.push({id: last_item_id + 1, user: user, password: password}); //add some data
    fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  // WRITE
        if (err) {
          const status = 401
          const message = err
          res.status(status).json({status, message})
          return
        }
    });
});

// Create token for new user
  const access_token = createToken({user, password})
  console.log("Access Token:" + access_token);
    res.status(200).json({access_token})
  });

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {user, password} = req.body;
  console.log('user', user);
  console.log('pwd', password);
  if (isAuthenticated({user, password}) === false) {
    const status = 401
    const message = 'Incorrect user or password'
    res.status(status).json({status, message})
    return
  }
  const access_token = createToken({user, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  console.log('authorization: ', req.headers.authorization);
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);
    console.log('verifyTokenResult: ', verifyTokenResult);

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token not provided'
       res.status(status).json({status, message})
       return
     }
     next(); // for CORS
     next();
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})
server.use(cors);
server.use(router);

server.listen(3200, () => {
  console.log('Run Auth API Server')
})