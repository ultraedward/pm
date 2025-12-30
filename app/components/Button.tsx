import React from "react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger"
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-800 focus:ring-black",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
    danger:
      "bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-500"
  }

  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  )
}
