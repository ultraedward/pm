export const metalSnapshots = [
  { id: "gold", name: "Gold", price: 2345.12, changePct: 0.42 },
  { id: "silver", name: "Silver", price: 29.84, changePct: -0.18 },
  { id: "platinum", name: "Platinum", price: 982.55, changePct: 0.09 }
]

export const mockHistory = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`,
  gold: 2300 + Math.random() * 80
}))
