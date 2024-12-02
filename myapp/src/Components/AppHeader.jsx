import { BellFilled, UserAddOutlined } from "@ant-design/icons";
import { Avatar, Badge, Image, List, Space, Typography } from "antd";

function AppHeader() {
  return (
    <div className="AppHeader">
      <Image width={200} src="Collabora.png" height="100"></Image>
      <Typography.Title>Welcome Back Sadaf</Typography.Title>

      <Space size={15}>
        <Avatar
          style={{ backgroundColor: "#264BAD" }}
          icon={<UserAddOutlined />}
        ></Avatar>
        <Badge style={{ backgroundColor: "#264BAD" }} count={10}>
          <BellFilled style={{ fontSize: 24, color: "#264BAD" }} />
        </Badge>
      </Space>
    </div>
  );
}
export default AppHeader;
