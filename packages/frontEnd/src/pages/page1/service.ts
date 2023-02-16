import { http } from "@/common/http";

//获得权限
export function getPings(params: any) {
  return http.request({
    url: "/users/pings",
    method: "POST",
    data: params
  });
}


