import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="p-6">
      <Title level={2}>TheSeus</Title>
      <Paragraph>Welcome to TheSeus. The project is up and running.</Paragraph>
    </div>
  );
}
