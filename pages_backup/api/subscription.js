export default async function handler(req, res) {
  res.status(501).json({
    error: "Subscriptions are disabled in the MVP build.",
  });
}
