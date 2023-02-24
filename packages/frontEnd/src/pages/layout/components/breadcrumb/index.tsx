import "react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from "antd";
import routeConfig from "@/router/config";
import type { Location } from "react-router-dom";
import useLocationListen from "@/common/hooks/useLocationListen";


export default () => {
  const [infoArr, setInfoArr] = useState<{ id: string; info: string }[]>([]);
  const { t } = useTranslation();


  useLocationListen((location: Location) => {
    const { pathname } = location;
    let temp = pathname.split("/").filter((item) => {
      return item;
    });
    let temp2 = temp.map((item) => {
      return {
        id: item,
        info: t(routeConfig[item]?.meta?.text),
      };
    })
    setInfoArr(temp2);
  });

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {infoArr.map((item) => {
        const { info, id } = item;
        return <Breadcrumb.Item key={id}>{info}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
};
