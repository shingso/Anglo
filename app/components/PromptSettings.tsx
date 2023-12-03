import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useState } from "react"
import { TextField } from "./TextField"
import { Deck } from "app/models"
import {
  defaultBackPrompt,
  defaultExtraArrayPrompt,
  defaultExtraPrompt,
  defaultSubheaderPrompt,
} from "app/utils/consts"
import { CustomText } from "./CustomText"
import { Button } from "./Button"

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
        <View>
          <CustomText
            style={{ marginBottom: spacing.size20 }}
            preset="caption1"
            presetColors="secondary"
          >
            Select default prompts or set your own custom prompts for flashcard AI generation.
          </CustomText>
          <CustomText
            style={{ marginBottom: spacing.size120 }}
            preset="caption1"
            presetColors="secondary"
          >
            For best results, be precise as possible with instructions and how you want it
            formatted.
          </CustomText>
          {/*  <View style={{ gap: spacing.size80, flexDirection: "row" }}>
            <Button preset="custom_default_small">Definition</Button>
            <Button preset="custom_default_small">Language</Button>
            <Button preset="custom_outline_small">Custom</Button>
          </View> */}
        </View>
        <TextField
          label="Back prompt"
          testID="back_input"
          value={backPrompt}
          placeholder={defaultBackPrompt}
          onChangeText={setBackPrompt}
          onSubmitEditing={() => submitBackPrompt()}
        ></TextField>
        <TextField
          label="Subheader prompt"
          testID="subheader_input"
          value={subheaderPrompt}
          onChangeText={setSubheaderPrompt}
          placeholder={defaultSubheaderPrompt}
          onSubmitEditing={() => submitSubheaderPrompt()}
        ></TextField>
        <TextField
          label="Extra prompt"
          testID="extra_input"
          value={extraPrompt}
          onChangeText={setExtraPrompt}
          placeholder={defaultExtraPrompt}
          onSubmitEditing={() => submitExtraPrompt()}
        ></TextField>
        <TextField
          label="Extra label prompt"
          testID="extra_array_input"
          value={extraArrayPrompt}
          onChangeText={setExtraArrayPrompt}
          placeholder={defaultExtraArrayPrompt}
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
