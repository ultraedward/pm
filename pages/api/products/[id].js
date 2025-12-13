// pages/api/products/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  const products = [
    { id: "gold-eagle-1oz", name: "Gold American Eagle 1 oz", metal: "XAU", weightOz: 1, description: "The most popular gold bullion coin in the U.S." },
    { id: "gold-bar-1oz", name: "Gold Bar 1 oz", metal: "XAU", weightOz: 1, description: "Private mint 1 oz gold bar." },
    { id: "silver-eagle-1oz", name: "Silver American Eagle 1 oz", metal: "XAG", weightOz: 1, description: "The most recognized silver bullion coin worldwide." },
    { id: "silver-bar-10oz", name: "Silver Bar 10 oz", metal: "XAG", weightOz: 10, description: "A larger-format silver bar with lower premiums." }
  ];
  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.status(200).json(product);
}
