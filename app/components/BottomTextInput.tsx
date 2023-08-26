import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"

export interface BottomTextInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const BottomTextInput = observer(function BottomTextInput(props: BottomTextInputProps) {
  const { style } = props
  const $styles = [$container, style]

  return (
    <View style={$styles}>
      <BottomSheetTextInput></BottomSheetTextInput>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $bottom_sheet: TextStyle = {
  marginTop: 8,
  marginBottom: 10,
  borderRadius: 10,
  fontSize: 16,
  lineHeight: 20,
  padding: 8,
  backgroundColor: "rgba(151, 151, 151, 0.25)",
}
