import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { AppState, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  BottomSheet,
  Button,
  Card,
  CustomTag,
  CustomText,
  EditFlashcard,
  Flashcard,
  FlashcardListItem,
  HEADER_HEIGHT,
  Header,
  Icon,
  Loading,
  ModalHeader,
  PromptSettings,
  Screen,
  Text,
  TextField,
  Option,
} from "app/components"
import { spacing } from "app/theme"
import { Deck, FlashcardSnapshotIn, useStores } from "app/models"
import { showDefaultToast, showSuccessToast } from "app/utils/errorUtils"
import { Flashcard_Fields, addFlashcard } from "app/utils/flashcardUtils"
import { getAIDefintionWithDeckPrompts } from "app/utils/openAiUtils"
import { v4 as uuidv4 } from "uuid"
import { BottomSheetModal, SCREEN_HEIGHT } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { TranslateLanguage, aiLanguageOptions } from "app/utils/consts"
import { capitalizeFirstLetter } from "app/utils/helperUtls"

interface MultiAddAiScreenProps extends AppStackScreenProps<"MultiAddAi"> {}

export const MultiAddAiScreen: FC<MultiAddAiScreenProps> = observer(function MultiAddAiScreen() {
  // Pull in one of our MST stores
  const { deckStore } = useStores()
  const [words, setWords] = useState<string[]>([])
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const [progress, setProgress] = useState(0)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const selectedDeck = deckStore.selectedDeck
  const navigation = useNavigation()
  const customPromptModelRef = useRef<BottomSheetModal>()
  const deckCustomPrompts = selectedDeck?.customPrompts
  const selectedFlashcard = deckStore?.selectedDeck?.selectedFlashcard
  const selectedFlashcardModalRef = useRef<BottomSheetModal>()
  const aiLanguageModelRef = useRef<BottomSheetModal>()
  const [aiLanguage, setAILanguage] = useState(selectedDeck?.translateLanguage)
  // if we leave in the middle we still want to see the response

  useEffect(() => {
    const res = navigation.addListener("beforeRemove", (e) => {
      /*    if (!loading) {
        return
      }
      e.preventDefault() */
      selectedDeck?.aiGeneratedResponse?.setWords(words)
    })
    return res
  }, [navigation, loading])
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match("/inactive|background/") && nextAppState === "active") {
        console.log("App has come to the foreground!")
      }

      appState.current = nextAppState

      console.log("AppState", appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

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

  const selectFlashcard = (flashcard: any) => {
    deckStore.selectedDeck.selectFlashcard(flashcard)
    selectedFlashcardModalRef?.current.present()
  }

  const onBottomSheetDismiss = () => {
    deckStore.selectedDeck.removeSelectedFlashcard()
  }

  const removeWord = (word: string) => {
    setWords((prev) => [...prev.filter((curr) => curr !== word)])
  }

  const setAILanguageSettings = (language: TranslateLanguage) => {
    setAILanguage(language)
    selectedDeck.setTranslateLanguage(language)
  }

  const generateCards = async () => {
    if (words?.length <= 0) return

    const success = []
    const errors = []
    setLoading(true)
    for await (const word of words) {
      const data = await getAIDefintionWithDeckPrompts(selectedDeck, word)
      setProgress((prev) => prev + 1)
      if (data && data?.back) {
        //check if valid flashcard
        const flashcard: FlashcardSnapshotIn = {
          [Flashcard_Fields.ID]: uuidv4(),
          [Flashcard_Fields.DECK_ID]: selectedDeck.id,
          [Flashcard_Fields.FRONT]: word,
          [Flashcard_Fields.BACK]: data.back,
          [Flashcard_Fields.EXTRA]: data.extra ? data.extra : null,
          [Flashcard_Fields.EXTRA_ARRAY]: data?.extra_array ? data.extra_array : [],
        }
        const addedFlashcard = await addFlashcard(flashcard)

        const deckCard = selectedDeck.addFlashcard(addedFlashcard)
        console.log(deckCard)
        !!deckCard ? success.push(deckCard) : errors.push(word)
      } else {
        errors.push(word)
      }
    }
    selectedDeck?.aiGeneratedResponse?.setWords(words)
    selectedDeck?.aiGeneratedResponse?.setErrors(errors)
    selectedDeck?.aiGeneratedResponse?.setSuccess(success)
    setLoading(false)
    setProgress(0)
    setWords([])
    showSuccessToast(`${success.length} cards generated`)
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen contentContainerStyle={{ flexGrow: 1 }} style={$root} preset="scroll">
      <Header></Header>
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
          {!selectedDeck?.aiGeneratedResponse.hasResponse ? (
            <View>
              <CustomText preset="body1" style={{ marginBottom: spacing.size160 }}>
                Generate multiple with AI
              </CustomText>
              <Card
                disabled={true}
                style={{
                  paddingHorizontal: spacing.size160,
                  paddingVertical: spacing.size160,
                  minHeight: 0,
                  elevation: 0,

                  marginBottom: spacing.size160,
                  borderRadius: 16,
                }}
                ContentComponent={
                  <View>
                    <TouchableOpacity onPress={() => customPromptModelRef?.current?.present()}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <CustomText preset="body1">Set custom prompts</CustomText>
                        </View>
                        <Icon
                          icon="caret_right"
                          color="#242424"
                          style={{ marginLeft: spacing.size80 }}
                          size={16}
                        ></Icon>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              ></Card>
              <Card
                disabled={true}
                style={{
                  paddingHorizontal: spacing.size160,
                  paddingVertical: spacing.size160,
                  minHeight: 0,
                  elevation: 0,

                  marginBottom: spacing.size120,
                  borderRadius: 16,
                }}
                ContentComponent={
                  <View>
                    <TouchableOpacity onPress={() => aiLanguageModelRef?.current?.present()}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <CustomText preset="body1">
                            {capitalizeFirstLetter(aiLanguage)}
                          </CustomText>
                        </View>
                        <Icon
                          icon="caret_right"
                          color="#242424"
                          style={{ marginLeft: spacing.size80 }}
                          size={16}
                        ></Icon>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              ></Card>
              <CustomText
                style={{ marginBottom: spacing.size320 }}
                preset="caption1"
                presetColors={"secondary"}
              >
                Add words below to use AI on all the below words. Seperate words with a comma.
                Closing the application will interupt the process. Maximum 30 at a time. Try
                generating serveral cards and checking their responses before making many.
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
                  return (
                    <CustomTag onPress={() => removeWord(word)} key={word} text={word}></CustomTag>
                  )
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
            </View>
          ) : (
            <View>
              <CustomText preset="body1" style={{ marginBottom: spacing.size160 }}>
                Generated Cards
              </CustomText>
              <CustomText preset="body2" style={{ marginBottom: spacing.size20 }}>
                Success
              </CustomText>
              <CustomText preset="caption1" style={{ marginBottom: spacing.size40 }}>
                Cards: {selectedDeck?.aiGeneratedResponse?.success?.length}
              </CustomText>
              {selectedDeck?.aiGeneratedResponse?.success &&
                selectedDeck?.aiGeneratedResponse?.success.length > 0 && (
                  <View style={{ marginBottom: spacing.size200 }}>
                    {selectedDeck?.aiGeneratedResponse?.success.map((card) => {
                      return (
                        <FlashcardListItem
                          key={card?.id}
                          onPress={() => selectFlashcard(card)}
                          flashcard={card}
                        ></FlashcardListItem>
                      )
                    })}
                  </View>
                )}
              <CustomText preset="body2" style={{ marginBottom: spacing.size20 }}>
                Uncompleted
              </CustomText>
              <CustomText preset="caption1" style={{ marginBottom: spacing.size40 }}>
                Cards: {selectedDeck?.aiGeneratedResponse?.uncompleted?.length}
              </CustomText>
              {selectedDeck?.aiGeneratedResponse?.uncompleted &&
                selectedDeck?.aiGeneratedResponse?.uncompleted.length > 0 && (
                  <View style={{ marginBottom: spacing.size200 }}>
                    {selectedDeck?.aiGeneratedResponse?.uncompleted.map((word) => {
                      return (
                        <FlashcardListItem
                          key={word}
                          flashcard={{ front: word }}
                        ></FlashcardListItem>
                      )
                    })}
                  </View>
                )}
              <Button
                onPress={() => selectedDeck.aiGeneratedResponse.clearAll()}
                preset="custom_default"
              >
                Confirm
              </Button>
            </View>
          )}
        </View>
      </View>

      <BottomSheet ref={aiLanguageModelRef} customSnap={["85%"]}>
        <ModalHeader title={"Use selected language for AI generated flashcards"}></ModalHeader>
        {aiLanguageOptions.map((option) => {
          return (
            <Option
              key={option}
              title={option}
              onPress={setAILanguageSettings}
              option={option}
              currentSelected={aiLanguage}
            ></Option>
          )
        })}
      </BottomSheet>

      <BottomSheet
        onDismiss={() => onBottomSheetDismiss()}
        ref={selectedFlashcardModalRef}
        customSnap={["85"]}
      >
        {
          <EditFlashcard
            //onDelete={() => setDeleteFlashcardModalVisible(true)}
            flashcard={selectedFlashcard}
            deck={deckStore.selectedDeck}
          ></EditFlashcard>
        }
      </BottomSheet>
      <BottomSheet ref={customPromptModelRef} customSnap={["85%"]}>
        <ModalHeader title={"Set custom prompts for fields"}></ModalHeader>
        <PromptSettings deck={selectedDeck}></PromptSettings>
      </BottomSheet>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
