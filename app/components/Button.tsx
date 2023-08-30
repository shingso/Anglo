import React, { ComponentType } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"
import { colors, custom_colors, custom_palette, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"
import { borderRadius } from "../theme/borderRadius"

type Presets = keyof typeof $viewPresets

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    ...rest
  } = props

  const preset: Presets = $viewPresets[props.preset] ? props.preset : "default"
  function $viewStyle({ pressed }) {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
    ]
  }
  function $textStyle({ pressed }) {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
    ]
  }

  return (
    <Pressable style={$viewStyle} accessibilityRole="button" {...rest}>
      {(state) => (
        <>
          {!!LeftAccessory && <LeftAccessory style={$leftAccessoryStyle} pressableState={state} />}

          <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
            {children}
          </Text>

          {!!RightAccessory && (
            <RightAccessory style={$rightAccessoryStyle} pressableState={state} />
          )}
        </>
      )}
    </Pressable>
  )
}

const $customBase: ViewStyle = {
  borderRadius: borderRadius.corner80,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: 0,
  paddingHorizontal: 20,
  height: 40,
}

const $customBaseText: TextStyle = {
  fontSize: 17,
  lineHeight: 22,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
}

const $customBaseSmall: ViewStyle = {
  borderRadius: borderRadius.corner80,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingHorizontal: spacing.size280,
  paddingVertical: spacing.size60,
  //flex: 1,
  //paddingVertical: spacing.size80,
  //width: 90,
}

const $customSmallText: TextStyle = {
  fontSize: 13,
  lineHeight: 18,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
  zIndex: 2,
}

const $custom_outline: ViewStyle = {
  borderWidth: 1,
  borderColor: custom_colors.brandStroke1,
}

const $small_button: ViewStyle = {
  //padding: 0,
  minHeight: 30,
}

//// - OLD STYLES

const $baseViewStyle: ViewStyle = {
  minHeight: 56,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.small,
  paddingHorizontal: spacing.small,
  overflow: "hidden",
}

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
}

const $custom_filled: ViewStyle = {
  borderWidth: 0,
  minHeight: 0,
  paddingVertical: spacing.small,
  paddingHorizontal: spacing.large,
}

const $clear: ViewStyle = {
  borderWidth: 0,
  marginHorizontal: 8,
  minHeight: 0,
  paddingVertical: spacing.small,
  paddingHorizontal: spacing.large,
}

const $circle_icon: ViewStyle = {
  backgroundColor: colors.palette.primary300,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  width: 36,
  height: 36,
  borderRadius: 60,
}

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.extraSmall, zIndex: 1 }
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.extraSmall, zIndex: 1 }

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.palette.neutral400,
      backgroundColor: colors.palette.neutral100,
    },
  ] as StyleProp<ViewStyle>,

  filled: [$baseViewStyle, { backgroundColor: colors.palette.neutral300 }] as StyleProp<ViewStyle>,

  reversed: [
    $baseViewStyle,
    { backgroundColor: colors.palette.neutral800 },
  ] as StyleProp<ViewStyle>,

  small_success: [
    $baseViewStyle,
    $small_button,
    { backgroundColor: colors.success },
  ] as StyleProp<ViewStyle>,

  custom_filled: [
    $baseViewStyle,
    $custom_filled,
    { backgroundColor: colors.palette.primary500 },
  ] as StyleProp<ViewStyle>,

  clear: [$baseViewStyle, $clear, { backgroundColor: colors.transparent }] as StyleProp<ViewStyle>,

  circle_icon: [$circle_icon] as StyleProp<ViewStyle>,

  custom_default: [
    $customBase,
    { backgroundColor: custom_colors.brandBackground1 },
  ] as StyleProp<ViewStyle>,

  custom_clear: [$customBase, { backgroundColor: colors.transparent }] as StyleProp<ViewStyle>,

  custom_default_small: [
    $customBaseSmall,
    $small_button,
    { backgroundColor: custom_colors.brandBackground1 },
  ] as StyleProp<ViewStyle>,

  custom_secondary_small: [
    $customBaseSmall,
    $small_button,
    { backgroundColor: custom_palette.grey88 },
  ] as StyleProp<ViewStyle>,

  custom_outline: [
    $customBase,
    $custom_outline,
    { backgroundColor: colors.transparent },
  ] as StyleProp<ViewStyle>,

  custom_outline_small: [
    $customBaseSmall,
    $small_button,
    $custom_outline,
    { backgroundColor: colors.transparent },
  ] as StyleProp<ViewStyle>,
}

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: $baseTextStyle,
  filled: $baseTextStyle,
  reversed: [$baseTextStyle, { color: colors.palette.neutral100 }],
  small_success: [$baseTextStyle, { color: colors.white }],
  custom_filled: [$customBaseText, { color: colors.white }],
  custom_outline: [
    $customBaseText,
    {
      color: custom_colors.brandBackground1,
    },
  ],
  clear: [
    $baseTextStyle,
    {
      color: colors.palette.primary500,
      fontFamily: typography.primary.bold,
      fontSize: 14,
      lineHeight: 16,
    },
  ],
  circle_icon: [$baseTextStyle],
  custom_default: [$customBaseText, { color: custom_colors.background1 }],
  custom_default_small: [$customBaseText, $customSmallText, { color: custom_colors.background1 }],
  custom_outline_small: [
    $customBaseText,
    $customSmallText,
    { color: custom_colors.brandBackground1 },
  ],
  custom_secondary_small: [$customBaseText, $customSmallText, { color: custom_colors.foreground1 }],

  custom_clear: [$customBaseText, { color: custom_colors.brandForeground1 }],
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.palette.neutral200 },
  filled: { backgroundColor: colors.palette.neutral400 },
  reversed: { backgroundColor: colors.palette.neutral700 },
  small_success: { backgroundColor: colors.palette.neutral800 },
  custom_filled: { backgroundColor: colors.palette.primary400 },
  custom_outline: { backgroundColor: colors.palette.neutral300 },
  clear: { backgroundColor: "transparent" },
  circle_icon: { backgroundColor: colors.palette.primary400 },
  custom_default: { backgroundColor: custom_colors.brandBackground1Pressed },
  custom_default_small: { backgroundColor: custom_colors.brandBackground1Pressed },
  custom_outline_small: { backgroundColor: colors.palette.neutral300 },
  custom_clear: { backgroundColor: "transparent" },
  custom_secondary_small: { backgroundColor: custom_palette.grey82 },
}

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9 },
  filled: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
  small_success: { opacity: 1 },
  custom_filled: { opacity: 1 },
  custom_outline: { opacity: 1 },
  clear: { opacity: 0.5 },
  circle_icon: { opacity: 0.5 },
  custom_default: { opacity: 1 },
  custom_default_small: { opacity: 1 },
  custom_outline_small: { opacity: 1 },
  custom_clear: { opacity: 0.5 },
  custom_secondary_small: { opacity: 0.8 },
}
