const router = require('koa-router')()
const fs = require('fs')
const path = require('path')
const { getJWTPayload } = require('../module/jwt')

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

// 获得权限
router.get("/getPermissions", async (ctx, next) => {
  const payload = getJWTPayload(ctx.headers.authorization)
  const { name } = payload;
  let permissions
  await new Promise((resolve) => {
    fs.readFile(path.resolve('db/', `${name}_permissions.json`), (err, dataStr) => {
      permissions = JSON.parse(dataStr.toString());
      resolve()
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: permissions,
  }
})

// 更新权限
router.post("/updatePermissions", async (ctx, next) => {
  const payload = getJWTPayload(ctx.headers.authorization)
  const { name } = payload;
  let permissions = JSON.stringify(ctx.request.body) //获取post提交的数据
  await new Promise((resolve) => {
    fs.writeFile(path.resolve('db/', `${name}_permissions.json`),permissions, () => {
      resolve()
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: {},
  }
})

// 获得配置
router.get("/getConfig", async (ctx, next) => {
  const payload = getJWTPayload(ctx.headers.authorization)
  const { name } = payload;
  let permissions
  await new Promise((resolve) => {
    fs.readFile(path.resolve('db/', `${name}_globalConfig.json`), (err, dataStr) => {
      permissions = JSON.parse(dataStr.toString());
      resolve()
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: permissions,
  }
})

// 更新配置
router.post("/updateConfig", async (ctx, next) => {
  const payload = getJWTPayload(ctx.headers.authorization)
  const { name } = payload;
  let permissions = JSON.stringify(ctx.request.body) //获取post提交的数据
  await new Promise((resolve) => {
    fs.writeFile(path.resolve('db/', `${name}_globalConfig.json`),permissions, () => {
      resolve()
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: {
      msg: '更新成功'
    },
  }
})

// 查询用户
router.get("/getUser", async (ctx, next) => {
  let permissions
  await new Promise((resolve) => {
    fs.readFile(path.resolve('db/', `user.json`), (err, dataStr) => {
      permissions = JSON.parse(dataStr.toString()).map(item => JSON.parse(item));
      resolve()
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: permissions,
    totle: permissions.length
  }
})

// 更新用户
router.post("/updateUser", async (ctx, next) => {
  let info = ctx.request.body
  info.id = guid()
  let permissions = JSON.stringify(info) //获取post提交的数据
  await new Promise((resolve, rejected) => {
    let data = []
    fs.readFile(path.resolve('db/', `user.json`), (err, dataStr) => {
      let isRepeat = JSON.parse(dataStr.toString()).map(item => JSON.parse(item)).filter(item => {
        if(item.userName === info.userName) return item
      })
      if(!isRepeat.length) {
        if(dataStr) {
          data = [...JSON.parse(dataStr.toString()), permissions]
        }else {
          data = [permissions]
        }
        fs.writeFile(path.resolve('db/', `user.json`), JSON.stringify(data) , () => {
          resolve()
        })
      }else {
        rejected("用户名重复")
      }
     
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: {
      msg: '更新成功'
    },
  }
})

router.post("/deleteUser", async(ctx, next) => {
  let delId = ctx.request.body
  let permissions
  await new Promise((resolve) => {
    fs.readFile(path.resolve('db/', `user.json`), (err, dataStr) => {
      permissions = JSON.parse(dataStr.toString()).map(item => JSON.parse(item));
      let newDatas = permissions.filter(item => {
        if(!delId.includes(item.id)) {
          return item
        }
      })
      let dataJSON = newDatas.map(item => JSON.stringify(item))
      console.log(dataJSON,'json',JSON.stringify(dataJSON))
      fs.writeFile(path.resolve('db/', `user.json`), JSON.stringify(dataJSON), () => {
        resolve()
      })
    })
  })
  ctx.response.body = {
    status: 1,
    code: "200",
    data: permissions,
    totle: permissions.length
  }
})


module.exports = router
