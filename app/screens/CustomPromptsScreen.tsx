import React, { FC, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  BottomSheet,
  Card,
  CustomText,
  Header,
  ModalHeader,
  Screen,
  TextField,
  Option,
  EditableText,
} from "app/components"
import { spacing } from "app/theme"
import { useStores } from "app/models"
import {
  defaultBackPrompt,
  defaultSubheaderPrompt,
  defaultExtraPrompt,
  defaultExtraArrayPrompt,
  defaultPromptOptions,
  TranslateLanguage,
  defaultLanguageBackPrompt,
  defaultLanguageExtraPrompt,
  defaultLanguageSubheaderPrompt,
  defaultLanguageExtraArrayPrompt,
  aiLanguageOptions,
} from "app/utils/consts"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { capitalizeFirstLetter } from "app/utils/helperUtls"
import { borderRadius } from "app/theme/borderRadius"

interface CustomPromptsScreenProps extends AppStackScreenProps<"CustomPrompts"> {}

export const CustomPromptsScreen: FC<CustomPromptsScreenProps> = observer(
  function CustomPromptsScreen() {
    const { deckStore } = useStores()
    const deck = deckStore?.selectedDeck
    const deckCustomPrompts = deck?.customPrompts
    const customPromptModelRef = useRef<BottomSheetModal>()
    const [subheaderPrompt, setSubheaderPrompt] = useState(deck?.customPrompts?.subheaderPrompt)
    const [backPrompt, setBackPrompt] = useState(deck?.customPrompts?.backPrompt)
    const [extraPrompt, setExtraPrompt] = useState(deck?.customPrompts?.extraPrompt)
    const [extraArrayPrompt, setExtraArrayPrompt] = useState(deck?.customPrompts?.extraArrayPrompt)
    const [defaultPromptType, setDefaultPromptType] = useState(
      deck?.customPrompts?.defaultPromptType,
    )
    const aiLanguageModelRef = useRef<BottomSheetModal>()
    const [aiLanguage, setAILanguage] = useState(deck?.translateLanguage)

    const setDeckPromptType = (type: TranslateLanguage) => {
      deck?.customPrompts?.setDefaultPromptType(type)
      if (type === TranslateLanguage.DEFINITION) {
        setDeckBackPrompt(defaultBackPrompt)
        setDeckExtraPrompt(defaultExtraPrompt)
        setDeckExtraArrayPrompt(defaultExtraArrayPrompt)
        setDeckSubheaderPrompt(defaultSubheaderPrompt)
      } else {
        setDeckBackPrompt(defaultLanguageBackPrompt(type))
        setDeckExtraPrompt(defaultLanguageExtraPrompt(type))
        setDeckExtraArrayPrompt(defaultLanguageExtraArrayPrompt(type))
        setDeckSubheaderPrompt(defaultLanguageSubheaderPrompt(type))
      }
      setDefaultPromptType(type)
    }

    const setDeckBackPrompt = (prompt: string) => {
      setBackPrompt(prompt)
      deck.customPrompts.setBackPrompt(prompt)
    }

    const setDeckExtraPrompt = (prompt: string) => {
      setExtraPrompt(prompt)
      deck.customPrompts.setExtraPrompt(prompt)
    }

    const setDeckExtraArrayPrompt = (prompt: string) => {
      setExtraArrayPrompt(prompt)
      deck.customPrompts.setExtraArrayPrompt(prompt)
    }

    const setDeckSubheaderPrompt = (prompt: string) => {
      setSubheaderPrompt(prompt)
      deck.customPrompts.setSubheaderPrompt(prompt)
    }

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
      <Screen contentContainerStyle={{ flexGrow: 1 }} style={$root} preset="scroll">
        <Header title="AI Settings"></Header>
        <View style={$container}>
          <CustomText style={{ marginBottom: spacing.size320 }} preset="body2">
            Set custom prompts for AI flashcard generation. Change input language if the words are
            not in English.
          </CustomText>
          {/* 
          <CustomText
            style={{ marginBottom: spacing.size120 }}
            preset="caption1"
            presetColors="secondary"
          >
            For best results, be precise as possible with instructions and how you want it
            formatted.
          </CustomText> */}
          <View>
            <TouchableOpacity onPress={() => aiLanguageModelRef?.current?.present()}>
              <View style={{ marginBottom: spacing.size160 }}>
                <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size80 }}>
                  Language input
                </CustomText>
                <CustomText
                  presetColors={"secondary"}
                  preset="caption2"
                  style={{ marginBottom: spacing.size80 }}
                >
                  Change to get better results if the words you are inputting for the front is of a
                  different language.
                </CustomText>

                <CustomText preset="body2">
                  {capitalizeFirstLetter(deck?.translateLanguage)}
                </CustomText>
              </View>
            </TouchableOpacity>
            <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size80 }}>
              Back prompt
            </CustomText>
            <EditableText
              preset="body2"
              testID="back"
              style={{ marginBottom: spacing.size160 }}
              onSubmit={(value) => deck.customPrompts.setBackPrompt(value)}
              multiline={true}
              initialValue={
                deck?.customPrompts?.backPrompt !== null
                  ? deck?.customPrompts?.backPrompt
                  : defaultBackPrompt
              }
            ></EditableText>

            <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size80 }}>
              Subheader prompt
            </CustomText>
            <EditableText
              preset="body2"
              testID="back"
              style={{ marginBottom: spacing.size160 }}
              onSubmit={(value) => deck.customPrompts.setSubheaderPrompt(value)}
              multiline={true}
              initialValue={
                deck?.customPrompts?.subheaderPrompt !== null
                  ? deck?.customPrompts?.subheaderPrompt
                  : defaultSubheaderPrompt
              }
            ></EditableText>

            <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size80 }}>
              Extra
            </CustomText>
            <EditableText
              preset="body2"
              testID="back"
              style={{ marginBottom: spacing.size160 }}
              onSubmit={(value) => deck.customPrompts.setExtraPrompt(value)}
              multiline={true}
              initialValue={
                deck?.customPrompts?.extraPrompt !== null
                  ? deck?.customPrompts?.extraPrompt
                  : defaultExtraPrompt
              }
            ></EditableText>

            <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size80 }}>
              Extra labels
            </CustomText>
            <EditableText
              preset="body2"
              testID="back"
              style={{ marginBottom: spacing.size120 }}
              onSubmit={(value) => deck.customPrompts.setExtraArrayPrompt(value)}
              multiline={true}
              initialValue={
                deck?.customPrompts?.extraArrayPrompt !== null
                  ? deck?.customPrompts?.extraArrayPrompt
                  : defaultExtraArrayPrompt
              }
            ></EditableText>
          </View>
          {/*  <Card
            onPress={() => customPromptModelRef?.current?.present()}
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size160,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size160,
              marginBottom: spacing.size80,
              borderRadius: borderRadius.corner120,
            }}
            ContentComponent={
              <View>
                <CustomText preset="body2Strong">Default prompts</CustomText>
                <CustomText preset="caption1">
                  See preset prompts for defintions and languages
                </CustomText>
              </View>
            }
          ></Card> */}
        </View>

        <BottomSheet ref={customPromptModelRef} customSnap={["85%"]}>
          <ModalHeader title={"Set custom prompts for AI generation fields"}></ModalHeader>
          {defaultPromptOptions.map((option) => {
            return (
              <Option
                key={option}
                title={capitalizeFirstLetter(option)}
                onPress={() => setDeckPromptType(option)}
                option={option}
                currentSelected={defaultPromptType}
              ></Option>
            )
          })}
        </BottomSheet>
        <BottomSheet ref={aiLanguageModelRef} customSnap={["85%"]}>
          <ModalHeader title={"The passed in word is in language"}></ModalHeader>
          {aiLanguageOptions.map((option) => {
            return (
              <Option
                key={option}
                title={capitalizeFirstLetter(option)}
                onPress={(language) => {
                  {
                    setAILanguage(language)
                    deck.setTranslateLanguage(language)
                  }
                }}
                option={option}
                currentSelected={aiLanguage}
              ></Option>
            )
          })}
        </BottomSheet>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
  height: "100%",
}
