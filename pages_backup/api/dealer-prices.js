// pages/api/dealer-prices.js

// NOTE: prices here are just example placeholders.
// Adjust to current market if you like.

export default function handler(req, res) {
  const products = [
    {
      id: "gold-eagle-1oz",
      name: "Gold American Eagle 1 oz",
      metal: "XAU",
      weightOz: 1.0,       // gold content is 1 oz
      purity: 0.9167,      // 22k gold alloy
      contentOz: 1.0,      // pure gold content
      dealers: [
        {
          name: "APMEX",
          price: 2400.0,
          url: "https://www.apmex.com/",
        },
        {
          name: "JM Bullion",
          price: 2385.0,
          url: "https://www.jmbullion.com/",
        },
        {
          name: "SD Bullion",
          price: 2378.0,
          url: "https://sdbullion.com/",
        },
      ],
    },
    {
      id: "gold-bar-1oz",
      name: "Gold Bar 1 oz (Minted)",
      metal: "XAU",
      weightOz: 1.0,
      purity: 0.9999,
      contentOz: 1.0,
      dealers: [
        {
          name: "APMEX",
          price: 2340.0,
          url: "https://www.apmex.com/",
        },
        {
          name: "JM Bullion",
          price: 2335.0,
          url: "https://www.jmbullion.com/",
        },
      ],
    },
    {
      id: "silver-eagle-1oz",
      name: "Silver American Eagle 1 oz",
      metal: "XAG",
      weightOz: 1.0,
      purity: 0.999,
      contentOz: 1.0,
      dealers: [
        {
          name: "APMEX",
          price: 32.5,
          url: "https://www.apmex.com/",
        },
        {
          name: "JM Bullion",
          price: 31.9,
          url: "https://www.jmbullion.com/",
        },
      ],
    },
    {
      id: "silver-bar-10oz",
      name: "Silver Bar 10 oz",
      metal: "XAG",
      weightOz: 10.0,
      purity: 0.999,
      contentOz: 10.0,
      dealers: [
        {
          name: "APMEX",
          price: 295.0,
          url: "https://www.apmex.com/",
        },
        {
          name: "SD Bullion",
          price: 289.0,
          url: "https://sdbullion.com/",
        },
      ],
    },
  ];

  res.status(200).json(products);
}
