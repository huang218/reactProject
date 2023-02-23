import { Card } from "antd";
import type { ReactNode } from "react";

const { Meta } = Card;

const App: React.FC = (props: { children: ReactNode }) => (
  <Card
    hoverable
    style={{ width: 400 }}
    // cover={
    //   <img
    //     alt="example"
    //     src=""
    //   />
    // }
  >
    {props.children}
  </Card>
);

export default App;
