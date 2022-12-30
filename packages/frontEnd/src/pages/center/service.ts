import { http } from "@/common/http";

export function updateConfig(params) {
  return http.request({
    url: "/users/updateConfig",
    method: "POST",
    data: params,
  });
}



