
const fs = require('fs');
const formidable = require('formidable');

//检测文件是否已经存在
const exists = function exists(path){
	return new Promise((resolve, reject)=>{
		fs.access(path, fs.constants.F_OK, err=>{
			if(err){
				resolve(false);
				return;
			}
			resolve(true);
		});
	});
}


//将传进来的文件数据写入服务器
//form-data格式的数据将以流的形式写入
//BASE64格式数据则直接将内容写入
const writeFile = function writeFile(serverPath, file, isStream){
	return new Promise((resolve, reject)=>{
		if(isStream){
			try{
				let readStream = fs.createReadStream(file.path);
				let writeStream = fs.createWriteStream(serverPath);
				readStream.pipe(writeStream);
				readStream.on('end',()=>{
					resolve({
						result: true,
						message: '上传成功！'
					});
					fs.unlinkSync(file.path);
				});
			}catch(err){
				resolve({
					result: false,
					message: err
				})
			}
		}else{
			fs.writeFile(serverPath,file, err=>{
				if(err){
					resolve({
						result: false,
						message: err
					})
					return;
				}
				resolve({
					result: true,
					message: '上传成功！'
				});
			});
		}
	});
}

export default {
	exists,
	multipartyUpload,
	writeFile
}