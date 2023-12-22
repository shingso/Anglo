import * as React from "react"
import {
  Keyboard,
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, typography } from "../theme"
import { Text } from "./Text"
import { useEffect, useRef, useState } from "react"
import { $presets, CustomText } from "./CustomText"
import { useTheme } from "@react-navigation/native"
import { Icon } from "./Icon"

export interface EditableTextProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  initialValue?: string
  placeholder?: string
  onSubmit?: Function
  multiline?: boolean
  preset?: any
  testID?: string
  focus?: boolean
  customRef?: any
}

/**
 * Describe your component here
 */
export const EditableText = observer(function EditableText(props: EditableTextProps) {
  const {
    style: $styleOverride,
    initialValue,
    placeholder,
    onSubmit,
    multiline,
    preset,
    testID,
    focus,
    customRef,
  } = props
  const $styles = [$styleOverride]

  const [text, setText] = useState(initialValue)
  const theme = useTheme()
  const textInputRef = customRef || useRef<TextInput>(null)

  useEffect(() => {
    /*     const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      textInputRef?.current?.blur()
    })

    // Clean up the listener when the component unmounts
    return () => {
      keyboardDidHideListener.remove()
    } */
  }, [])

  useEffect(() => {
    setText(initialValue)
  }, [initialValue])

  /*   useEffect(() => {
    if (focus) {
      textInputRef?.current?.focus()
    }
  }, [focus])
 */
  const handleTextChange = (value) => {
    setText(value)
  }

  const handleBlur = () => {
    onSubmit(text)
  }

  return (
    <TextInput
      ref={textInputRef}
      style={[
        $presets?.[preset] ? $presets[preset] : null,
        $styles,
        {
          color: theme.colors.foreground1,
          padding: 0,
        },
      ]}
      value={text}
      onChangeText={handleTextChange}
      onBlur={handleBlur}
      autoFocus={false}
      blurOnSubmit={true}
      placeholderTextColor={theme.colors.foreground2}
      testID={testID + "_edit"}
      multiline={true}
      placeholder={placeholder}
    />
  )
})
