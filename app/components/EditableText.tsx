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
import { CustomText } from "./CustomText"

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
  } = props
  const $styles = [$styleOverride]

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(initialValue)

  const textInputRef = useRef<TextInput>(null)

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      textInputRef?.current?.blur()
    })

    // Clean up the listener when the component unmounts
    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])

  useEffect(() => {
    if (focus) {
      console.log("this ran focus")
      setEditing(true)
      textInputRef?.current?.focus()
    }
  }, [focus])

  const handleTap = () => {
    setEditing(true)
  }

  const handleTextChange = (value) => {
    setText(value)
  }

  const handleBlur = () => {
    setEditing(false)
    onSubmit(text)
  }

  return (
    <TouchableOpacity onPress={handleTap}>
      {editing ? (
        <TextInput
          ref={textInputRef}
          style={$styles}
          value={text}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          autoFocus
          blurOnSubmit={true}
          testID={testID + "_edit"}
          multiline={multiline}
          placeholder={placeholder}
        />
      ) : (
        <CustomText
          testID={testID}
          style={[$styles, !text ? $placeholderStyle : {}]}
          preset={preset}
        >
          {text || placeholder}
        </CustomText>
      )}
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

const $placeholderStyle: TextStyle = {
  color: custom_colors.foreground2,
}
