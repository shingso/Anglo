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
  Screen,
  Text,
  TextField,
  Option,
  BottomMainAction,
} from "app/components"
import { custom_palette, spacing, typography } from "app/theme"
import { Deck, FlashcardSnapshotIn, useStores } from "app/models"
import { showDefaultToast, showErrorToast, showSuccessToast } from "app/utils/errorUtils"
import { Flashcard_Fields, addFlashcard } from "app/utils/flashcardUtils"
import { getAIDefintionWithDeckPrompts, getRemainingRateLimit } from "app/utils/openAiUtils"
import { v4 as uuidv4 } from "uuid"
import { BottomSheetModal, SCREEN_HEIGHT } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import {
  AppRoutes,
  TranslateLanguage,
  aiLanguageOptions,
  defaultBackPrompt,
  defaultExtraArrayPrompt,
  defaultExtraPrompt,
  defaultSubheaderPrompt,
} from "app/utils/consts"
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
  const aiTutorialRef = useRef<BottomSheetModal>()
  const aiLanguageModelRef = useRef<BottomSheetModal>()
  const [aiLanguage, setAILanguage] = useState(selectedDeck?.translateLanguage)
  const [limitRemaining, setLimitRemaining] = useState(0)
  // if we leave in the middle we still want to see the response
  const wordsLimit = 20
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
    const getRemainingLimit = async () => {
      setLoading(true)
      const data = await getRemainingRateLimit()

      if (data && data?.remaining) {
        setLimitRemaining(data?.remaining)
      }
      setLoading(false)
    }
    getRemainingLimit()
  }, [])

  const addToWords = (word: string) => {
    if (!words.includes(word)) {
      setWords((prev) => [...prev, word])
    }
  }

  const submitInput = () => {
    const wordsLength = words.length
    const overallWordsLimit = Math.min(wordsLimit, limitRemaining)
    if (wordsLength >= overallWordsLimit) {
      showErrorToast("Too many words", `Maximum ${overallWordsLimit} words at a time`)
      return
    }
    if (input) {
      const parsedInput = input?.split(",")
      const addLength = parsedInput?.length
      let wordsToAdd = parsedInput
      const totalWords = wordsLength + addLength
      if (totalWords > overallWordsLimit) {
        const remainingLimit = overallWordsLimit - wordsLength
        wordsToAdd = wordsToAdd.slice(0, remainingLimit)
        showErrorToast(
          "Too many words",
          `Maximum ${overallWordsLimit} words at a time, some words have been removed`,
        )
      }
      wordsToAdd.forEach((word) => {
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
      const { data } = await getAIDefintionWithDeckPrompts(selectedDeck, word)
      setProgress((prev) => prev + 1)
      if (data && data?.back) {
        //check if valid flashcard
        const flashcard: FlashcardSnapshotIn = {
          [Flashcard_Fields.ID]: uuidv4(),
          [Flashcard_Fields.DECK_ID]: selectedDeck.id,
          [Flashcard_Fields.FRONT]: word,
          [Flashcard_Fields.BACK]: data.back,
          [Flashcard_Fields.SUB_HEADER]: data?.sub_header,
          [Flashcard_Fields.EXTRA]: data?.extra ? data.extra : null,
          [Flashcard_Fields.EXTRA_ARRAY]: data?.extra_array ? data.extra_array : [],
        }
        const addedFlashcard = await addFlashcard(flashcard)
        const deckCard = selectedDeck.addFlashcard(addedFlashcard)
        !!deckCard ? success.push(deckCard) : errors.push(word)
        setLimitRemaining(data?.remaining)
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

  return (
    <Screen contentContainerStyle={{ flexGrow: 1 }} style={$root} preset="scroll">
      <Header
        title="AI Generate"
        onRightPress={() => aiTutorialRef?.current?.present()}
        rightIcon="fluent_error_circle"
      ></Header>

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
            <Loading text={!!words?.length ? `${progress} / ${words.length}` : null}></Loading>
          </View>
        )}
        <View style={$container}>
          {!selectedDeck?.aiGeneratedResponse.hasResponse ? (
            <View>
              {limitRemaining !== null && (
                <CustomText style={{ marginBottom: spacing.size120 }}>
                  Remaining rate: {limitRemaining <= 0 ? 0 : limitRemaining}
                </CustomText>
              )}

              {/*   <Card
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
              ></Card> */}

              <CustomText
                style={{ marginBottom: spacing.size40 }}
                preset="caption1Strong"
                presetColors={"secondary"}
              >
                Words to generate: {words.length}
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
              <View style={{ paddingHorizontal: spacing.size40, marginBottom: spacing.size160 }}>
                <CustomText preset="caption1Strong">Back</CustomText>
                <CustomText style={{ marginBottom: spacing.size100 }} preset="caption1">
                  {selectedDeck?.customPrompts?.backPrompt}
                </CustomText>
                <CustomText preset="caption1Strong">Subheader</CustomText>
                <CustomText style={{ marginBottom: spacing.size100 }} preset="caption1">
                  {selectedDeck?.customPrompts?.subheaderPrompt}
                </CustomText>
                <CustomText preset="caption1Strong">Extra </CustomText>
                <CustomText style={{ marginBottom: spacing.size100 }} preset="caption1">
                  {selectedDeck?.customPrompts?.extraPrompt}
                </CustomText>
                <CustomText preset="caption1Strong">Extra labels</CustomText>
                <CustomText style={{ marginBottom: spacing.size100 }} preset="caption1">
                  {selectedDeck?.customPrompts?.extraArrayPrompt}
                </CustomText>
              </View>
              <Card
                onPress={() => navigation.navigate(AppRoutes.CUSTOM_PROMPTS)}
                testID="customPromptsCard"
                style={{
                  paddingHorizontal: spacing.size160,
                  paddingVertical: spacing.size200,
                  minHeight: 0,
                  elevation: 0,

                  marginBottom: spacing.size200,
                  borderRadius: 16,
                }}
                ContentComponent={
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Icon icon="robot" size={20} style={{ marginRight: spacing.size60 }}></Icon>
                        <CustomText preset="body2Strong">Set custom AI flashcards</CustomText>
                      </View>
                      <Icon
                        icon="caret_right"
                        color={custom_palette.grey50}
                        style={{ marginLeft: spacing.size80 }}
                        size={16}
                      ></Icon>
                    </View>
                  </View>
                }
              ></Card>
            </View>
          ) : (
            <View>
              <CustomText
                preset="title2"
                style={{ marginBottom: spacing.size160, fontFamily: typography.primary.light }}
              >
                AI results
              </CustomText>
              <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
                Success
              </CustomText>
              <CustomText preset="caption1" style={{ marginBottom: spacing.size100 }}>
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
              <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
                Error
              </CustomText>
              <CustomText preset="caption1" style={{ marginBottom: spacing.size40 }}>
                Cards: {selectedDeck?.aiGeneratedResponse?.errors?.length}
              </CustomText>
              {selectedDeck?.aiGeneratedResponse?.errors &&
                selectedDeck?.aiGeneratedResponse?.errors.length > 0 && (
                  <View style={{ marginBottom: spacing.size200 }}>
                    {selectedDeck?.aiGeneratedResponse?.errors.map((word) => {
                      return (
                        <FlashcardListItem
                          key={word}
                          flashcard={{ front: word }}
                        ></FlashcardListItem>
                      )
                    })}
                  </View>
                )}
              {!!selectedDeck?.aiGeneratedResponse?.uncompleted &&
                selectedDeck?.aiGeneratedResponse?.uncompleted.length > 0 && (
                  <View>
                    <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
                      Not started
                    </CustomText>
                    <CustomText preset="caption1" style={{ marginBottom: spacing.size40 }}>
                      Cards: {selectedDeck?.aiGeneratedResponse?.uncompleted}
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
                  </View>
                )}
            </View>
          )}
        </View>
      </View>
      {!loading && (
        <BottomMainAction
          label={selectedDeck?.aiGeneratedResponse?.hasResponse ? "Confirm" : "Generate"}
          onPress={
            selectedDeck?.aiGeneratedResponse?.hasResponse
              ? () => selectedDeck.aiGeneratedResponse.clearAll()
              : () => generateCards()
          }
        ></BottomMainAction>
      )}
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
            flashcard={selectedFlashcard}
            deck={deckStore.selectedDeck}
          ></EditFlashcard>
        }
      </BottomSheet>
      <BottomSheet ref={aiTutorialRef} customSnap={["85%"]}>
        <ModalHeader title={"AI flashcard generate tips"}></ModalHeader>
        <CustomText
          style={{ marginBottom: spacing.size160, paddingHorizontal: spacing.size80 }}
          preset="body2"
        >
          - To add multiple words at a time, seperate them with a comma. Copy and paste a list to
          quickly add words.
        </CustomText>
        <CustomText
          style={{ marginBottom: spacing.size160, paddingHorizontal: spacing.size80 }}
          preset="body2"
        >
          - Maximum 30 words at a time.
        </CustomText>
        <CustomText
          style={{ marginBottom: spacing.size160, paddingHorizontal: spacing.size80 }}
          preset="body2"
        >
          - Be as precise as possible with the format of how you want your responses.
        </CustomText>
        <CustomText
          style={{ marginBottom: spacing.size160, paddingHorizontal: spacing.size80 }}
          preset="body2"
        >
          - The extra tags fields can only be used for a list of items. If using your own custom
          prompt ask for a number of things, such as 'two related words'.
        </CustomText>
        <CustomText
          style={{ marginBottom: spacing.size160, paddingHorizontal: spacing.size80 }}
          preset="body2"
        >
          - Try generating serveral cards and checking their responses before making many.
        </CustomText>
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
