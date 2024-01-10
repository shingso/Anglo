import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { CustomText } from "./CustomText"
import { borderRadius } from "app/theme/borderRadius"
import { ReactElement } from "react"

export interface StatusLabelProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  text: string
  RightComponent?: ReactElement
}

/**
 * Describe your component here
 */
export const StatusLabel = observer(function StatusLabel(props: StatusLabelProps) {
  const { style, text, RightComponent } = props
  const $styles = [$container, style]

  return (
    <View style={$styles}>
      <CustomText style={$text} preset="caption1Strong" text={text}></CustomText>
      {RightComponent}
    </View>
  )
})

const $container: TextStyle = {
  marginBottom: spacing.size20,
  paddingHorizontal: 8,
  paddingVertical: 2,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: borderRadius.corner80,
  backgroundColor: custom_colors.successBackground1,
}

const $text: TextStyle = {
  color: custom_colors.successForeground1,
  overflow: "hidden",
}
