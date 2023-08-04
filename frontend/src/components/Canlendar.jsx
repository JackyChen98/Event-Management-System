import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

/** Manually entering any of the following formats will perform date parsing */
const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;

const App = () => (
  <Space direction="vertical" size={12}>
    <DatePicker format={'MM/YY'} />
  </Space>
);
export default App;