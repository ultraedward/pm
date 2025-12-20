import { getPriceHistory } from "../lib/dataSource";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export async function getServerSideProps() {
  const data = await getPriceHistory();
  return { props: { data } };
}

export default function Charts({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h1>Price Chart</h1>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
