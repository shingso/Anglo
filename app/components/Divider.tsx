import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useTheme } from "@react-navigation/native"

export interface DividerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Divider = observer(function Divider(props: DividerProps) {
  const { style } = props
  const $styles = [$container, style]
  const theme = useTheme()
  return <View style={[...$styles, { borderBottomColor: theme.colors.foreground3 }]}></View>
})

const $container: ViewStyle = {
  borderBottomWidth: 0.3,
}
