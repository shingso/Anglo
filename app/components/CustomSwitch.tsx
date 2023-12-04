import * as React from "react"
import {
  Animated,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleSheet,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Easing, color } from "react-native-reanimated"
import { useTheme } from "@react-navigation/native"
import { useEffect } from "react"

export interface CustomSwitchProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  isOn?: boolean
  onColor?: string
  offColor?: string
  onToggle?: any
  labelStyle?: StyleProp<TextStyle>
  label?: string
  testID?: string
}

/**
 * Describe your component here
 */
export const CustomSwitch = observer(function CustomSwitch(props: CustomSwitchProps) {
  const theme = useTheme()
  const {
    style,
    isOn = false,
    onColor = theme.colors.brandBackground2,
    offColor = theme.colors.background6,
    onToggle = () => {},
    labelStyle,
    label = "",
    testID,
  } = props

  const animatedValue = new Animated.Value(0)

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  })

  const color = isOn ? onColor : offColor

  useEffect(() => {
    animatedValue.setValue(isOn ? 0 : 1)
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }, [isOn])

  return (
    <View style={$container}>
      {!!label && <Text style={[$label, labelStyle]}>{label}</Text>}

      <TouchableOpacity testID={testID} onPress={typeof onToggle === "function" && onToggle}>
        <View style={[$toggleContainer, style, { backgroundColor: color }]}>
          <Animated.View
            style={[
              $toggleWheelStyle,
              {
                backgroundColor: theme.colors.background4,
                marginLeft: moveToggle,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $toggleContainer: ViewStyle = {
  width: 50,
  height: 30,
  borderRadius: 15,
  justifyContent: "center",
}

const $toggleWheelStyle: ViewStyle = {
  width: 25,
  height: 25,
  borderRadius: 12.5,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 2.5,
  elevation: 1.5,
}

const $label = {}
