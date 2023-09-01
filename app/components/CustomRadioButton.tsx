import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { useTheme } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"

export interface CustomRadioButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  //style?: StyleProp<ViewStyle>
  selected?: boolean
  onPress?: Function
}

/**
 * Describe your component here
 */
export const CustomRadioButton = observer(function CustomRadioButton(
  props: CustomRadioButtonProps,
) {
  const { selected, onPress } = props
  const theme = useTheme()
  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : null)}
      style={[
        $outer,
        { borderColor: selected ? theme.colors.brandForeground1 : theme.colors.foreground3 },
      ]}
    >
      {selected ? (
        <View style={[$inner, { backgroundColor: theme.colors.brandForeground1 }]} />
      ) : null}
    </TouchableOpacity>
  )
})

const $outer: ViewStyle = {
  height: 20,
  width: 20,
  borderRadius: 12,
  borderWidth: 1.8,
  alignItems: "center",
  justifyContent: "center",
}

const $inner: ViewStyle = {
  height: 12,
  width: 12,
  borderRadius: 20,
}
