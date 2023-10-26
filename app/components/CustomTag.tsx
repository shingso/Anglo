import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "../theme"
import { Text } from "./Text"
import { CustomText } from "./CustomText"
import { borderRadius } from "../theme/borderRadius"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon } from "./Icon"

export interface CustomTagProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  text: string
  onPress?: Function
  selected?: boolean
}

/**
 * Describe your component here
 */
export const CustomTag = observer(function CustomTag(props: CustomTagProps) {
  const { style, text, onPress, selected } = props
  const $styles = [$container, style]

  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : null)}
      style={[$styles, selected ? $selected : null]}
      disabled={!onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CustomText preset="caption1" style={[$text, selected ? $selectedText : null]}>
          {text}
        </CustomText>
        {onPress && (
          <View
            style={{
              //backgroundColor: custom_palette.grey84,
              marginLeft: spacing.size80,
              //borderRadius: 20,
              // padding: 2,
            }}
          >
            <Icon icon="x" color={custom_palette.grey50} size={15}></Icon>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
})

const $container: ViewStyle = {
  paddingHorizontal: spacing.size120,
  paddingVertical: spacing.size60,
  backgroundColor: custom_colors.background5,
  borderRadius: borderRadius.corner80,
  alignItems: "center",
  justifyContent: "center",
}

const $selected: ViewStyle = {
  backgroundColor: custom_colors.brandBackground2,
}

const $selectedText: TextStyle = {
  color: custom_colors.background1,
  //backgroundColor: custom_colors.brandBackground1,
}

const $text: TextStyle = {
  color: custom_colors.foreground1,
}
