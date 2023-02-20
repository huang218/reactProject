import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";

const Errors = () => {
  const naviagte = useNavigate();
  return(
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => naviagte("/layout/hello")}>
          Back Home
        </Button>
      }
    />
  )
}
export default Errors;
