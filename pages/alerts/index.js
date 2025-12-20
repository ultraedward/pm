import { getAlerts } from "../../lib/dataSource";

export async function getServerSideProps() {
  const alerts = await getAlerts();
  return { props: { alerts } };
}

export default function Alerts({ alerts }) {
  return (
    <div>
      <h1>Alerts</h1>
      <ul>
        {alerts.map((a) => (
          <li key={a.id}>
            {a.metal.name} {a.direction} ${a.targetPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}
