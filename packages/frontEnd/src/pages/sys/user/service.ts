import { http } from "@/common/http";

//更新用户
export function updateUser(data: {}) {
  return http.request({
    url: "/users/updateUser",
    method: "POST",
    data,
  });
}
//查询用户
export function getUser() {
  return http.request({
    url: "/users/getUser",
    method: "GET"
  });
}

export function deleteUser(data) {
  return http.request({
    url: "/users/deleteUser",
    method: "POST",
    data
  })
}