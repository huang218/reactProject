const jwt = require('jsonwebtoken');
const { secret } = require('../config/index')

function getJWTPayload(token) {
    // 验证并解析JWT
    return jwt.verify(token.split(' ')[1], secret, (err, decoded) => {
        if(err) {
            if(err.name == 'TokenExpiredError'){//token过期
                let str = {
                    iat:1,
                    exp:0,
                    msg: 'token过期'
                }
                return str;
            }else if(err.name == 'JsonWebTokenError'){//无效的token
                let str = {
                    iat:1,
                    exp:0,
                    msg: '无效的token'
                }
                return str;
            }
        }else {
            return decoded; // 正常输出
        }
    });
}

function getToken(payload = {}) {
    return jwt.sign(payload, secret, { expiresIn: '4h' });
}

module.exports = {
    getJWTPayload,
    getToken
}