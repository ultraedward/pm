import { getMetals } from "../lib/dataSource";

export async function getServerSideProps() {
  const metals = await getMetals();
  return { props: { metals } };
}

export default function Home({ metals }) {
  return (
    <div>
      <h1>Precious Metals</h1>
      <ul>
        {metals.map((m) => (
          <li key={m.id}>
            {m.name}: ${m.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
