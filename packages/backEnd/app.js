const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const koastatic = require('koa-static');
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const router = require('koa-router')()
const logger = require('koa-logger')
const jwtKoa = require('koa-jwt');
const multiparty = require('multiparty');
const fs = require('fs')

const SERVER_PATH = `${__dirname}/upload`;
const host = '127.0.0.1',
      port = '3130';
const HOSTNAME = `${host}:${port}`


let routeArr = []
const files = fs.readdirSync('./routes')
files.forEach(function (item, index) {
  routeArr.push("./routes/"+item)
})


const { secret } = require('./config/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        ok: false,
        code: 401,
        msg: err.originalError ? err.originalError.message : err.message
      }
    } else {
      throw err;
    }
  });
});

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

/* 路由权限控制 */
app.use(jwtKoa({ secret: secret }).unless({
  // 设置login、register接口，可以不需要认证访问
  path: [
    /^\//,
    /^\/register/,
    /^((?!).)*$/   // 设置除了私有接口外的其它资源，可以不需要认证访问
  ]
}));

// routes
routeArr.forEach((item)=>{
  const route = require(item)
  app.use(route.routes(), route.allowedMethods())
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


//利用multiparty插件解析前端传来的form-data格式的数据，并上传至服务器
const multipartyUpload = function multipartyUpload(req, autoUpload){
	let config = {
		maxFieldsSize : 200 * 1024 *1024
	}
	if(autoUpload) config.uploadDir = SERVER_PATH;
	return new Promise((resolve,reject)=>{
		new multiparty.Form(config).parse(req, (err, fields, files)=>{
			if(err){
				reject(err);
				return;
			}
			resolve({
        fields,
        files
			});
		});
	});
}
//上传单个文件（form-data），利用第三方插件multipary解析并上传
router.post('/upload_single_file', async (ctx, next) => {
  try {
      let data = await multipartyUpload(ctx.req, true);
      let userName = data && data.fields ? data.fields.user[0] : '';
      let file = (data && data.files.files.length) ? data.files.files[0] : {};
      const path = file.path.replace(__dirname, HOSTNAME)
      console.log(userName,'********************************')
      ctx.body = {
          code: 200,
          message: '文件上传成功',
          originalFilename: file.originalFilename,
          url: `http://${path}`
      }
  } catch (err) {
      ctx.body = {
          code: 1,
          message: '文件上传失败',
          error: err
      }
  }
});

app.use(koastatic('./'));
app.use(router.routes());
module.exports = app
