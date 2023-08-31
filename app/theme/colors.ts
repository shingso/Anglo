// TODO: write documentation for colors and palette in own markdown file and add links from here

import { DefaultTheme } from "@react-navigation/native"

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#F4E0D9",
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#C76542",
  primary600: "#A54F31",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  danger100: "#FDF6F6",
  danger200: "#DC5E62",
  danger300: "#F2D6CD",
  danger400: "#D13438",
  danger500: "#BC2F32",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  success500: "green",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const custom_palette = {
  white: "#ffffff",
  grey98: "#fafafa",
  grey96: "#f5f5f5",
  grey94: "#f0f0f0",
  grey92: "#ebebeb",
  grey90: "#e6e6e6",
  grey88: "#e0e0e0",
  grey86: "#dbdbdb",
  grey84: "#D6D6D6",
  grey82: "#d1d1d1",
  grey74: "#bdbdbd",
  grey68: "#ADADAD",
  grey50: "#808080",
  grey46: "#757575",
  grey38: "#616161",
  grey36: "5C5C5C",
  grey30: "4D4D4D",
  grey24: "3D3D3D",
  grey20: "#333333",
  grey16: "#292929",
  grey14: "#242424",
  grey12: "#1F1F1F",
  grey8: "#141414",
  black: "#000000",

  primary40: "#7a4531",
  primary50: "#8e5139",
  primary60: "#a25c42",
  primary70: "#b7684a",
  primary80: "#cb7352",
  primary90: "#d08163",
  primary100: "#d58f75",
  primary110: "#db9d86",
  primary120: "#e0ab97",
  primary130: "#e5b9a9",
  primary140: "#eac7ba",
  primary150: "#efd5cb",

  red10: "#bc2f32",
  red20: "#DC5E62",
  red40: "#D13438", //primary
  red60: "#fdf6f6",

  green10: "#0e700e",
  green20: "#359b35",
  green40: "#107c10", //primary
  green60: "#f1faf1",
} as const

export const custom_colors = {
  background1: custom_palette.white,
  background2: custom_palette.white,
  background3: custom_palette.white,
  background4: custom_palette.grey98,
  background5: custom_palette.grey94,
  background6: custom_palette.grey82,

  foreground1: custom_palette.grey14,
  foreground2: custom_palette.grey38,
  foreground3: custom_palette.grey50,

  brandBackground1: custom_palette.primary80,
  brandBackground1Pressed: custom_palette.primary50,
  brandBackground1Selected: custom_palette.primary60,
  brandBackground2: custom_palette.primary70,
  brandBackground2Pressed: custom_palette.primary40,
  brandBackground2Selected: custom_palette.primary50,
  brandBackground3: custom_palette.primary60,
  brandBackgroundTint: custom_palette.primary150,
  brandBackgroundDisabled: custom_palette.primary140,

  brandForeground1: custom_palette.primary80,
  brandForeground1Pressed: custom_palette.primary50,
  brandForeground1Selected: custom_palette.primary60,
  brandForegroundTint: custom_palette.primary60,
  brandForegroundDisabled1: custom_palette.primary90,
  brandForegroundDisabled2: custom_palette.primary140,

  brandStroke1: custom_palette.primary80,
  brandStroke1Pressed: custom_palette.primary50,
  brandStroke1Selected: custom_palette.primary60,
  brandStrokeTint: custom_palette.primary90,

  dangerBackground1: custom_palette.red60,
  dangerForeground1: custom_palette.red10,
  dangerStroke1: custom_palette.red20,
  dangerBackground2: custom_palette.red40,
  dangerForeground2: custom_palette.red40,
  dangerStroke2: custom_palette.red40,

  blueForeground1: "#1967d2",
  blueForeground2: "#2886DE",

  successBackground1: custom_palette.green60,
  successForeground1: custom_palette.green10,
  successStroke1: custom_palette.green20,
  successBackground2: custom_palette.green40,
  successForeground2: custom_palette.green40,

  severeBackground1: "rgba(0, 0, 0, 0)",
  severeForeground1: "rgba(0, 0, 0, 0)",
  severeStroke1: "rgba(0, 0, 0, 0)",
  severeBackground2: "rgba(0, 0, 0, 0)",
  severeForeground2: "rgba(0, 0, 0, 0)",
  severeStroke2: "rgba(0, 0, 0, 0)",
}

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: custom_palette.grey96,
    background1: custom_palette.white,
    background2: custom_palette.white,
    background3: custom_palette.white,
    background4: custom_palette.grey98,
    background5: custom_palette.grey94,
    background6: custom_palette.grey82,
    canvas: custom_palette.grey96,

    foreground1: custom_palette.grey14,
    foreground2: custom_palette.grey38,
    foreground3: custom_palette.grey50,

    brandBackground1: custom_palette.primary80,
    brandBackground1Pressed: custom_palette.primary50,
    brandBackground1Selected: custom_palette.primary60,
    brandBackground2: custom_palette.primary70,
    brandBackground2Pressed: custom_palette.primary40,
    brandBackground2Selected: custom_palette.primary50,
    brandBackground3: custom_palette.primary60,
    brandBackgroundTint: custom_palette.primary150,
    brandBackgroundDisabled: custom_palette.primary140,

    brandForeground1: custom_palette.primary80,
    brandForeground1Pressed: custom_palette.primary50,
    brandForeground1Selected: custom_palette.primary60,
    brandForegroundTint: custom_palette.primary60,
    brandForegroundDisabled1: custom_palette.primary90,
    brandForegroundDisabled2: custom_palette.primary140,

    brandStroke1: custom_palette.primary80,
    brandStroke1Pressed: custom_palette.primary50,
    brandStroke1Selected: custom_palette.primary60,
    brandStrokeTint: custom_palette.primary90,

    dangerBackground1: custom_palette.red60,
    dangerForeground1: custom_palette.red10,
    dangerStroke1: custom_palette.red20,
    dangerBackground2: custom_palette.red40,
    dangerForeground2: custom_palette.red40,
    dangerStroke2: custom_palette.red40,

    blueForeground1: "#1967d2",
    blueForeground2: "#2886DE",

    successBackground1: custom_palette.green60,
    successForeground1: custom_palette.green10,
    successStroke1: custom_palette.green20,
    successBackground2: custom_palette.green40,
    successForeground2: custom_palette.green40,

    severeBackground1: "rgba(0, 0, 0, 0)",
    severeForeground1: "rgba(0, 0, 0, 0)",
    severeStroke1: "rgba(0, 0, 0, 0)",
    severeBackground2: "rgba(0, 0, 0, 0)",
    severeForeground2: "rgba(0, 0, 0, 0)",
    severeStroke2: "rgba(0, 0, 0, 0)",

    stroke1: custom_palette.grey82,
    stroke2: custom_palette.grey88,
  },
}

export const darkTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    background: custom_palette.grey8,
    background1: custom_palette.black,
    background2: custom_palette.grey12,
    background3: custom_palette.grey16,
    background4: custom_palette.grey20,
    background5: custom_palette.grey24,
    background6: custom_palette.grey36,
    canvas: custom_palette.grey8, //screen background color

    foreground1: custom_palette.white,
    foreground2: custom_palette.grey84,
    foreground3: custom_palette.grey68,

    brandBackground1: custom_palette.primary80,
    brandBackground1Pressed: custom_palette.primary50,
    brandBackground1Selected: custom_palette.primary60,
    brandBackground2: custom_palette.primary70,
    brandBackground2Pressed: custom_palette.primary40,
    brandBackground2Selected: custom_palette.primary50,
    brandBackground3: custom_palette.primary60,
    brandBackgroundTint: custom_palette.primary150,
    brandBackgroundDisabled: custom_palette.primary140,

    brandForeground1: custom_palette.primary80,
    brandForeground1Pressed: custom_palette.primary50,
    brandForeground1Selected: custom_palette.primary60,
    brandForegroundTint: custom_palette.primary60,
    brandForegroundDisabled1: custom_palette.primary90,
    brandForegroundDisabled2: custom_palette.primary140,

    brandStroke1: custom_palette.primary80,
    brandStroke1Pressed: custom_palette.primary50,
    brandStroke1Selected: custom_palette.primary60,
    brandStrokeTint: custom_palette.primary90,

    dangerBackground1: custom_palette.red60,
    dangerForeground1: custom_palette.red10,
    dangerStroke1: custom_palette.red20,
    dangerBackground2: custom_palette.red40,
    dangerForeground2: custom_palette.red40,
    dangerStroke2: custom_palette.red40,

    blueForeground1: "#1967d2",
    blueForeground2: "#2886DE",

    successBackground1: custom_palette.green60,
    successForeground1: custom_palette.green10,
    successStroke1: custom_palette.green20,
    successBackground2: custom_palette.green40,
    successForeground2: custom_palette.green40,

    severeBackground1: "rgba(0, 0, 0, 0)",
    severeForeground1: "rgba(0, 0, 0, 0)",
    severeStroke1: "rgba(0, 0, 0, 0)",
    severeBackground2: "rgba(0, 0, 0, 0)",
    severeForeground2: "rgba(0, 0, 0, 0)",
    severeStroke2: "rgba(0, 0, 0, 0)",

    stroke1: custom_palette.grey30,
    stroke2: custom_palette.grey24,
  },
}

export type Theme = typeof lightTheme

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral300,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,

  /**
   * Success messages.
   *
   */
  success: palette.success500,

  white: palette.neutral100,
}
