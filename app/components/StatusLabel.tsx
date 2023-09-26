import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { CustomText } from "./CustomText"
import { borderRadius } from "app/theme/borderRadius"

export interface StatusLabelProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  text: string
}

/**
 * Describe your component here
 */
export const StatusLabel = observer(function StatusLabel(props: StatusLabelProps) {
  const { style, text } = props
  const $styles = [$container, style]

  return <CustomText preset="caption1Strong" style={$styles} text={text}></CustomText>
})

const $container: TextStyle = {
  marginBottom: spacing.size20,
  color: custom_colors.successForeground1,
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: borderRadius.corner80,
  backgroundColor: custom_colors.successBackground1,
}
