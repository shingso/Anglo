import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useState } from "react"
import { TextField } from "./TextField"
import { Deck } from "app/models"

export interface PromptSettingsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  deck: Deck
}

/**
 * Describe your component here
 */
export const PromptSettings = observer(function PromptSettings(props: PromptSettingsProps) {
  const { style, deck } = props
  const $styles = [$container, style]

  const [subheaderPrompt, setSubheaderPrompt] = useState(deck?.customPrompts?.subheaderPrompt)
  const [backPrompt, setBackPrompt] = useState(deck?.customPrompts?.backPrompt)
  const [extraPrompt, setExtraPrompt] = useState(deck?.customPrompts?.extraPrompt)
  const [extraArrayPrompt, setExtraArrayPrompt] = useState(deck?.customPrompts?.extraArrayPrompt)

  const submitBackPrompt = () => {
    deck.customPrompts.setBackPrompt(backPrompt)
  }

  const submitExtraPrompt = () => {
    deck.customPrompts.setExtraPrompt(extraPrompt)
  }

  const submitExtraArrayPrompt = () => {
    deck.customPrompts.setExtraArrayPrompt(extraArrayPrompt)
  }

  const submitSubheaderPrompt = () => {
    deck.customPrompts.setSubheaderPrompt(subheaderPrompt)
  }

  return (
    <View style={$styles}>
      <View style={{ gap: spacing.size160 }}>
        <TextField
          label="Back"
          testID="back_input"
          value={backPrompt}
          onChangeText={setBackPrompt}
          onSubmitEditing={() => submitBackPrompt()}
        ></TextField>
        <TextField
          label="Subheader"
          testID="subheader_input"
          value={subheaderPrompt}
          onChangeText={setSubheaderPrompt}
          placeholder="Subheader is shown with the front."
          onSubmitEditing={() => submitSubheaderPrompt()}
        ></TextField>
        <TextField
          label="Extra"
          testID="extra_input"
          value={extraPrompt}
          onChangeText={setExtraPrompt}
          placeholder="Extra field is used for any additional text."
          onSubmitEditing={() => submitExtraPrompt()}
        ></TextField>
        <TextField
          label="Extra Labels"
          testID="extra_array_input"
          value={extraArrayPrompt}
          onChangeText={setExtraArrayPrompt}
          placeholder="Extra labels is used to return lists."
          onSubmitEditing={() => submitExtraArrayPrompt()}
        ></TextField>
      </View>
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
