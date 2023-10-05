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
  Screen,
  Text,
  TextField,
} from "app/components"
import { spacing } from "app/theme"
import { FlashcardSnapshotIn, useStores } from "app/models"
import { showSuccessToast } from "app/utils/errorUtils"
import { Flashcard_Fields, addFlashcard } from "app/utils/flashcardUtils"
import { getAIDefinition } from "app/utils/openAiUtils"
import { v4 as uuidv4 } from "uuid"

interface MultiAddAiScreenProps extends AppStackScreenProps<"MultiAddAi"> {}

export const MultiAddAiScreen: FC<MultiAddAiScreenProps> = observer(function MultiAddAiScreen() {
  // Pull in one of our MST stores
  const { deckStore } = useStores()
  const [words, setWords] = useState<string[]>([])
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState([])
  const selectedDeck = deckStore.selectedDeck

  const addToWords = (word: string) => {
    if (!words.includes(word)) {
      setWords((prev) => [...prev, word])
    }
  }

  const submitInput = () => {
    if (input) {
      addToWords(input)
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

    for await (const word of words) {
      const data = await getAIDefinition(word)

      if (data) {
        //check if valid flashcard
        if (!data?.definition) return
        const flashcard: FlashcardSnapshotIn = {
          [Flashcard_Fields.ID]: uuidv4(),
          [Flashcard_Fields.DECK_ID]: selectedDeck.id,
          [Flashcard_Fields.FRONT]: word,
          [Flashcard_Fields.BACK]: data.definition,
          [Flashcard_Fields.EXTRA]: data.extra ? data.extra : null,
          [Flashcard_Fields.EXTRA_ARRAY]: data?.synonyms ? data.synonyms : [],
        }
        const addedFlashcard = await addFlashcard(flashcard)
        selectedDeck.addFlashcard(addedFlashcard)
        !!addedFlashcard ? success.push(word) : errors.push(word)
      }
    }
    setResults(success)
    setErrors(errors)
    showSuccessToast(`${success.length} cards generated`)
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <View
        style={{
          flexDirection: "row",
          marginBottom: spacing.size320,
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
            return <FlashcardListItem flashcard={{ front: word }}></FlashcardListItem>
          })}
        </View>
      )}
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: spacing.size200,
}
