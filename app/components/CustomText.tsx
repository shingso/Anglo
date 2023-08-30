import { useTheme } from "@react-navigation/native"
import i18n from "i18n-js"
import React, { useEffect, useRef, useState } from "react"
import {
  StyleProp,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  Animated,
  View,
} from "react-native"
import { isRTL, translate, TxKeyPath } from "../i18n"
import { $sizeStyles, colors, preset_fonts, typography } from "../theme"
import { Button } from "./Button"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets = keyof typeof $presets

export interface CustomTextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: i18n.TranslateOptions
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * Text weight modifier.
   */
  weight?: Weights
  /**
   * Text size modifier.
   */
  size?: Sizes
  /**
   * Children components.
   */
  children?: React.ReactNode
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Text.md)
 */
export function CustomText(props: CustomTextProps) {
  const { weight, size, tx, txOptions, text, children, style: $styleOverride, ...rest } = props

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children
  const theme = useTheme()
  const preset: Presets = $presets[props.preset] ? props.preset : "default"
  const $styles = [$rtlStyle, $presets[preset], { color: theme.colors.foreground1 }, $styleOverride]

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <RNText {...rest} style={$styles}>
        {content}
      </RNText>
    </View>
  )
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: StyleProp<TextStyle> = [$fontWeightStyles.normal]

const $presets = {
  default: $baseStyle,

  caption1: preset_fonts.caption1 as StyleProp<TextStyle>,
  caption2: preset_fonts.caption2 as StyleProp<TextStyle>,
  caption1Strong: preset_fonts.caption1Strong as StyleProp<TextStyle>,
  body2: preset_fonts.body2 as StyleProp<TextStyle>,
  body2Strong: preset_fonts.body2Strong as StyleProp<TextStyle>,
  body1: preset_fonts.body1 as StyleProp<TextStyle>,
  body1Strong: preset_fonts.body1Strong as StyleProp<TextStyle>,
  title3: preset_fonts.title3 as StyleProp<TextStyle>,
  title2: preset_fonts.title2 as StyleProp<TextStyle>,
  title1: preset_fonts.title1 as StyleProp<TextStyle>,
  largeTitle: preset_fonts.largeTitle as StyleProp<TextStyle>,
  display: preset_fonts.display as StyleProp<TextStyle>,
}

const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {}
