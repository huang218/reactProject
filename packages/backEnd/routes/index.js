const router = require('koa-router')()
const fs = require('fs')
const jwt = require('jsonwebtoken');
const path = require('path')
const { getJWTPayload, getToken } = require('../module/jwt')

const { secret } = require('../config/index')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// 登录
router.post("/login", async (ctx, next) => {
  const { name } = ctx.request.body;
  console.log(ctx.request.body,'ctx',name)
  let payload = { name }; // 加密的数据
  let isLogin = true;
  let permissions
  await new Promise((resolve, rejected) => {
    fs.readFile(path.resolve('db/', `${name}_permissions.json`), (err, dataStr) => {
      if(dataStr) {
        permissions = JSON.parse(dataStr.toString());
        resolve();
      }else {
        isLogin = false;
        rejected('未查询到该账户');
      }
    })
    
  })
  ctx.response.body = {
    status: 1,
    code: '200',
    success: isLogin,
    data: isLogin ? { 
      token: getToken(payload) 
    } : {},
  }
})


module.exports = router
