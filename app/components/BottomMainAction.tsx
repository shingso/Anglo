import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { borderRadius } from "app/theme/borderRadius"
import { Button } from "./Button"
import { useTheme } from "@react-navigation/native"

export interface BottomMainActionProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  label?: string
  onPress?: Function
  disabled?: boolean
}
export const BOTTOM_ACTION_HEIGHT = 70
export const BottomMainAction = observer(function BottomMainAction(props: BottomMainActionProps) {
  const { style, onPress, label, disabled } = props
  const $styles = [$container, style]
  const theme = useTheme()

  return (
    <View style={[...$styles, { backgroundColor: theme.colors.background1 }]}>
      <Button
        preset="custom_default"
        text={label}
        onPress={() => onPress()}
        disabled={disabled}
      ></Button>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  padding: spacing.size160,
  paddingHorizontal: spacing.size240,
  width: "100%",
  height: BOTTOM_ACTION_HEIGHT,
  elevation: 6,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  //borderTopLeftRadius: borderRadius.corner120,
  //borderTopRightRadius: borderRadius.corner120,
}
