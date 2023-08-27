import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, typography } from "app/theme"

export interface DotProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Dot = observer(function Dot(props: DotProps) {
  const { style } = props
  const $styles = [$container, style]

  return <View style={$styles}></View>
})

const $container: ViewStyle = {
  width: 12,
  height: 12,
  borderRadius: 12,
  backgroundColor: custom_colors.successForeground1,
}
