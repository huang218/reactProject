import { http } from "@/common/http";

//更新用户
export function uploadFile(data) {
  return http.request({
    url: "/upload_single_file",
    method: "POST",
    headers: {
      'content-type': 'multipart/form-data'
    },
    data,
  });
}