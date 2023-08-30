// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform, StyleProp, TextStyle } from "react-native"
import {
  SpaceGrotesk_300Light as spaceGroteskLight,
  SpaceGrotesk_400Regular as spaceGroteskRegular,
  SpaceGrotesk_500Medium as spaceGroteskMedium,
  SpaceGrotesk_600SemiBold as spaceGroteskSemiBold,
  SpaceGrotesk_700Bold as spaceGroteskBold,
} from "@expo-google-fonts/space-grotesk"

import {
  OpenSans_300Light as openSans300,
  OpenSans_400Regular as openSans400,
  OpenSans_500Medium as openSans500,
  OpenSans_600SemiBold as openSans600,
  OpenSans_700Bold as openSans700,
  OpenSans_800ExtraBold as openSans800,
} from "@expo-google-fonts/open-sans"

import {
  Inter_300Light as interLight,
  Inter_400Regular as interRegular,
  Inter_500Medium as interMedium,
  Inter_600SemiBold as interSemiBold,
  Inter_700Bold as interBold,
} from "@expo-google-fonts/inter"

import {
  Roboto_300Light as robotoLight,
  Roboto_400Regular as robotoRegular,
  Roboto_500Medium as robotoMedium,
  Roboto_700Bold as robotoBold,
} from "@expo-google-fonts/roboto"
import { colors, custom_colors } from "./colors"

export const customFontsToLoad = {
  spaceGroteskLight,
  spaceGroteskRegular,
  spaceGroteskMedium,
  spaceGroteskSemiBold,
  spaceGroteskBold,
  interLight,
  interRegular,
  interMedium,
  interSemiBold,
  interBold,
  robotoLight,
  robotoRegular,
  robotoMedium,
  robotoBold,
  openSans300,
  openSans400,
  openSans500,
  openSans600,
  openSans700,
  openSans800,
}

const fonts = {
  roboto: {
    light: "robotoLight",
    normal: "robotoRegular",
    medium: "robotoMedium",
    bold: "robotoBold",
  },
  inter: {
    light: "interLight",
    normal: "interRegular",
    medium: "interMedium",
    semiBold: "interSemiBold",
    bold: "interBold",
  },
  openSans: {
    // Cross-platform Google font.
    light: "openSans300",
    normal: "openSans400",
    medium: "openSans500",
    semiBold: "openSans600",
    bold: "openSans700",
  },
  spaceGrotesk: {
    // Cross-platform Google font.
    light: "spaceGroteskLight",
    normal: "spaceGroteskRegular",
    medium: "spaceGroteskMedium",
    semiBold: "spaceGroteskSemiBold",
    bold: "spaceGroteskBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.inter,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}

export const $sizeStyles = {
  xxxl: { fontSize: 60 } as TextStyle,
  xxl: { fontSize: 34 } as TextStyle,
  xl: { fontSize: 28 } as TextStyle,
  lg: { fontSize: 22 } as TextStyle,
  md: { fontSize: 20 } as TextStyle,
  sm: { fontSize: 17 } as TextStyle,
  xs: { fontSize: 15 } as TextStyle,
  xxs: { fontSize: 13 } as TextStyle,
  xxxs: { fontSize: 12 } as TextStyle,
}

export const $lineHeightStyles = {
  xxxl: { lineHeight: 70 } as TextStyle,
  xxl: { lineHeight: 41 } as TextStyle,
  xl: { lineHeight: 34 } as TextStyle,
  lg: { lineHeight: 28 } as TextStyle,
  md: { lineHeight: 25 } as TextStyle,
  sm: { lineHeight: 22 } as TextStyle,
  xs: { lineHeight: 20 } as TextStyle,
  xxs: { lineHeight: 18 } as TextStyle,
  xxxs: { lineHeight: 16 } as TextStyle,
}
type Weights = keyof typeof typography.primary
const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: StyleProp<TextStyle> = [
  $sizeStyles.sm,
  $fontWeightStyles.normal,
  { color: custom_colors.foreground1 },
]

const $spacingStyles = {
  xxl: { letterSpacing: 24 } as TextStyle,
  xl: { letterSpacing: 24 } as TextStyle,
  lg: { letterSpacing: 24 } as TextStyle,
  md: { letterSpacing: 24 } as TextStyle,
  sm: { letterSpacing: 24 } as TextStyle,
  xs: { letterSpacing: 24 } as TextStyle,
  xxs: { letterSpacing: 24 } as TextStyle,
}

export const preset_fonts = {
  caption1: [
    $baseStyle,
    $sizeStyles.xxs,
    $lineHeightStyles.xxs,
    ,
    $fontWeightStyles.normal,
  ] as StyleProp<TextStyle>,
  caption2: [
    $baseStyle,
    $sizeStyles.xxxs,
    $lineHeightStyles.xxxs,
    $fontWeightStyles.normal,
  ] as StyleProp<TextStyle>,
  caption1Strong: [
    $baseStyle,
    $sizeStyles.xxs,
    $lineHeightStyles.xxs,
    $fontWeightStyles.semiBold,
  ] as StyleProp<TextStyle>,
  body2: [
    $baseStyle,
    $sizeStyles.xs,
    $lineHeightStyles.xs,
    $fontWeightStyles.normal,
  ] as StyleProp<TextStyle>,
  body2Strong: [
    $baseStyle,
    $sizeStyles.xs,
    $lineHeightStyles.xs,
    $fontWeightStyles.semiBold,
  ] as StyleProp<TextStyle>,
  body1: [
    $baseStyle,
    $sizeStyles.sm,
    $lineHeightStyles.sm,
    $fontWeightStyles.normal,
  ] as StyleProp<TextStyle>,
  body1Strong: [
    $baseStyle,
    $sizeStyles.sm,
    $lineHeightStyles.sm,
    $fontWeightStyles.semiBold,
  ] as StyleProp<TextStyle>,
  title3: [
    $baseStyle,
    $sizeStyles.md,
    $lineHeightStyles.md,
    $fontWeightStyles.semiBold,
  ] as StyleProp<TextStyle>,
  title2: [
    $baseStyle,
    $sizeStyles.lg,
    $lineHeightStyles.lg,
    $fontWeightStyles.semiBold,
  ] as StyleProp<TextStyle>,
  title1: [
    $baseStyle,
    $sizeStyles.xl,
    $lineHeightStyles.xl,
    $fontWeightStyles.bold,
  ] as StyleProp<TextStyle>,
  largeTitle: [
    $baseStyle,
    $sizeStyles.xxl,
    $lineHeightStyles.xxl,
    $fontWeightStyles.bold,
  ] as StyleProp<TextStyle>,
  display: [
    $baseStyle,
    $sizeStyles.xxxl,
    $lineHeightStyles.xxxl,
    $fontWeightStyles.bold,
  ] as StyleProp<TextStyle>,
}
