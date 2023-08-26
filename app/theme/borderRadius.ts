export const borderRadius = {
  corner0: 0,
  corner20: 2,
  corner40: 4,
  corner80: 8, // Large Buttoms
  corner120: 12, // Buttoms bottom sheets
  cornerCircle: "50%",
} as const

export type BorderRadius = keyof typeof borderRadius
