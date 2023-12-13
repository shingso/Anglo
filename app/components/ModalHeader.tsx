import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { CustomText } from "./CustomText"
import { useTheme } from "@react-navigation/native"

export interface ModalHeaderProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  title?: String
}

/**
 * Describe your component here
 */
export const ModalHeader = observer(function ModalHeader(props: ModalHeaderProps) {
  const { style, title } = props
  const $styles = [$container, style]
  const theme = useTheme()

  return (
    <View style={$styles}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: spacing.size200,
          paddingTop: spacing.size80,
        }}
      >
        <CustomText preset="body2">{title}</CustomText>
      </View>
      <View
        style={{
          height: 0.2,
          backgroundColor: theme.colors.foreground3,
          marginHorizontal: -16,
          marginBottom: spacing.size120,
        }}
      ></View>
    </View>
  )
})

const $container: ViewStyle = {}
