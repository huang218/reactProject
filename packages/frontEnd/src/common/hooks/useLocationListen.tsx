import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { globalStore } from "@/stores";

export default (listener) => {
  let location = useLocation();
  // 监听路由以及国际化变更
  useEffect(() => {
    listener(location);
  }, [location, globalStore.language]);
};
