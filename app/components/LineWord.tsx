import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { CustomText } from "./CustomText"

export interface LineWordProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  text?: string
}

/**
 * Describe your component here
 */
export const LineWord = observer(function LineWord(props: LineWordProps) {
  const { text } = props

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: spacing.size240,
      }}
    >
      <View style={{ backgroundColor: custom_colors.foreground2, height: 1, flex: 1 }} />
      <CustomText preset="caption1" style={{ paddingHorizontal: spacing.size160 }}>
        {text}
      </CustomText>
      <View style={{ backgroundColor: custom_colors.foreground2, height: 1, flex: 1 }} />
    </View>
  )
})
