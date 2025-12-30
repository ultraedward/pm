import { getMetals } from "../../lib/dataSource";

export default async function handler(req, res) {
  const metals = await getMetals();
  res.status(200).json({ metals });
}
