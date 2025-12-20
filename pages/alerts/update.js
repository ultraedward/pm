import prisma from "../../lib/prisma";

export async function getServerSideProps({ req, res }) {
  if (req.method !== "POST") {
    return {
      notFound: true,
    };
  }

  const { alertId, targetPrice } = req.body || {};

  if (!alertId || !targetPrice) {
    res.statusCode = 400;
    res.end("Missing fields");
    return { props: {} };
  }

  await prisma.alert.update({
    where: { id: alertId },
    data: { targetPrice: Number(targetPrice) },
  });

  res.statusCode = 200;
  res.end("OK");

  return { props: {} };
}

export default function UpdateAlertPage() {
  return null;
}
