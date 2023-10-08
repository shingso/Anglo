import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  Button,
  CustomTag,
  CustomText,
  Flashcard,
  FlashcardListItem,
  HEADER_HEIGHT,
  Loading,
  Screen,
  Text,
  TextField,
} from "app/components"
import { spacing } from "app/theme"
import { FlashcardSnapshotIn, useStores } from "app/models"
import { showDefaultToast, showSuccessToast } from "app/utils/errorUtils"
import { Flashcard_Fields, addFlashcard } from "app/utils/flashcardUtils"
import { getAIDefinition } from "app/utils/openAiUtils"
import { v4 as uuidv4 } from "uuid"
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet"

interface MultiAddAiScreenProps extends AppStackScreenProps<"MultiAddAi"> {}

export const MultiAddAiScreen: FC<MultiAddAiScreenProps> = observer(function MultiAddAiScreen() {
  // Pull in one of our MST stores
  const { deckStore } = useStores()
  const [words, setWords] = useState<string[]>([])
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState([])
  const [progress, setProgress] = useState(0)
  const selectedDeck = deckStore.selectedDeck

  const addToWords = (word: string) => {
    /*   if (words?.length > 25) {
      showDefaultToast("Maximum 25 cards at a time")
      return
    }
 */
    if (!words.includes(word)) {
      setWords((prev) => [...prev, word])
    }
  }

  const submitInput = () => {
    if (input) {
      const parsedInput = input?.split(",")
      parsedInput.forEach((word) => {
        addToWords(word?.trim())
      })
      setInput("")
    }
  }

  const removeWord = (word: string) => {
    setWords((prev) => [...prev.filter((curr) => curr !== word)])
  }

  const generateCards = async () => {
    if (words?.length <= 0) return

    const success = []
    const errors = []
    setLoading(true)
    for await (const word of words) {
      const data = await getAIDefinition(word)
      setProgress((prev) => prev + 1)
      if (data) {
        //check if valid flashcard
        if (!data?.back) return
        const flashcard: FlashcardSnapshotIn = {
          [Flashcard_Fields.ID]: uuidv4(),
          [Flashcard_Fields.DECK_ID]: selectedDeck.id,
          [Flashcard_Fields.FRONT]: word,
          [Flashcard_Fields.BACK]: data.back,
          [Flashcard_Fields.EXTRA]: data.extra ? data.extra : null,
          [Flashcard_Fields.EXTRA_ARRAY]: data?.extra_array ? data.extra_array : [],
        }
        const addedFlashcard = await addFlashcard(flashcard)
        selectedDeck.addFlashcard(addedFlashcard)
        !!addedFlashcard ? success.push(word) : errors.push(word)
      }
    }
    setLoading(false)
    setResults(success)
    setErrors(errors)
    setProgress(0)
    showSuccessToast(`${success.length} cards generated`)
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen contentContainerStyle={{ flexGrow: 1 }} style={$root} preset="scroll">
      <View style={{ height: "100%" }}>
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: -20,
              bottom: 0,
              left: -20,
              zIndex: 1,
            }}
          >
            <Loading text={`${progress} / ${words.length}`}></Loading>
          </View>
        )}
        <View style={$container}>
          <CustomText preset="body1" style={{ marginBottom: spacing.size160 }}>
            Generate multiple with AI
          </CustomText>
          <CustomText
            style={{ marginBottom: spacing.size320 }}
            preset="caption1"
            presetColors={"secondary"}
          >
            Add words below to use AI on all the below words. Seperate words with a comma. Closing
            the application will interupt the process. Maximum 30 at a time. Try generating serveral
            cards and checking their responses before making many.
          </CustomText>
          <CustomText
            style={{ marginBottom: spacing.size80 }}
            preset="caption1Strong"
            presetColors={"secondary"}
          >
            Words to add: {words.length}
          </CustomText>

          <View
            style={{
              flexDirection: "row",
              marginBottom: spacing.size200,
              flexWrap: "wrap",
              gap: spacing.size80,
            }}
          >
            {words.map((word) => {
              return <CustomTag onPress={() => removeWord(word)} key={word} text={word}></CustomTag>
            })}
          </View>

          <TextField
            placeholder="Add words to create multiple flashcards with AI"
            onChangeText={setInput}
            value={input}
            blurOnSubmit={false}
            containerStyle={{ marginBottom: spacing.size400 }}
            onSubmitEditing={submitInput}
          ></TextField>

          <Button onPress={() => generateCards()} preset="custom_default">
            Generate cards
          </Button>

          {results && (
            <View style={{ marginTop: spacing.size200 }}>
              {results.map((word) => {
                return (
                  <FlashcardListItem key={word} flashcard={{ front: word }}></FlashcardListItem>
                )
              })}
            </View>
          )}
        </View>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
