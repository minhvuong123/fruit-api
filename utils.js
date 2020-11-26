const jwt = require('jsonwebtoken');

const configToken = {
  secretToken: "kiwi",
  refreshTokenSecret: "kiwi_refresh",
  tokenLife: 60
} 

function verifyJwtToken(token, secretKey) {
  return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
              reject(undefined)
          } 
          resolve(decoded);
      })
  })
}

module.exports = {
 rootPath: __dirname,
 configToken,
 verifyJwtToken
}