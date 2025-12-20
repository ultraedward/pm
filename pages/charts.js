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
    <main>
      <header>
        <h1>Charts</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/alerts">Alerts</a>
        </nav>
      </header>

      <div className="chart">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
