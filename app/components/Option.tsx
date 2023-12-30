import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { CustomText } from "./CustomText"
import { Icon } from "./Icon"
import { useTheme } from "@react-navigation/native"

export interface OptionProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  option?: String
  title?: String
  onPress?: Function
  currentSelected?: String
}

/**
 * Describe your component here
 */
export const Option = observer(function Option(props: OptionProps) {
  const { style, option, title, onPress, currentSelected } = props
  const $styles = [$container, style]
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={() => (onPress ? onPress(option) : null)}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {currentSelected !== null && (
          <Icon
            icon={option === currentSelected ? "circle_check_filled" : "circle"}
            size={22}
            color={
              option === currentSelected ? theme.colors.brandBackground1 : theme.colors.foreground2
            }
            style={{ marginRight: spacing.size160 }}
          ></Icon>
        )}
        <View
          style={{
            borderBottomColor: theme.colors.foreground3,
            borderBottomWidth: 0.3,
            paddingVertical: spacing.size120 + spacing.size20,

            flex: 1,
            height: "100%",
          }}
        >
          <CustomText preset="body2">{title}</CustomText>
        </View>
      </View>
    </TouchableOpacity>
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
