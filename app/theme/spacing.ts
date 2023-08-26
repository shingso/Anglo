/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const spacing = {
  micro: 2,
  tiny: 4,
  extraSmall: 8,
  small: 12,
  medium: 16,
  large: 24,
  extraLarge: 32,
  huge: 48,
  massive: 64,

  size20: 2,
  size40: 4,
  size60: 6,
  size80: 8,
  size100: 10,
  size120: 12, //space between icons, list view padding,,
  size160: 16, //bit bigger space between icons
  size200: 20,
  size240: 24,
  size280: 28,
  size320: 32,
  size360: 36,
  size400: 40,
  size480: 48,
  size520: 52,
  size560: 56,
} as const

export type Spacing = keyof typeof spacing
