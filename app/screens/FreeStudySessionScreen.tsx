import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import {
  BottomSheet,
  CustomSwipeCards,
  CustomText,
  EditFlashcard,
  Header,
  Icon,
  Screen,
  SwipeCards,
  Text,
  TextField,
} from "app/components"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useStores, Flashcard, CardProgressSnapshotIn } from "app/models"
import { spacing, custom_colors, colors, typography } from "app/theme"
import { Card_Progress_Fields, deleteCardProgress } from "app/utils/cardProgressUtils"
import { AppStackParamList, AppRoutes } from "app/utils/consts"
import { showErrorToast } from "app/utils/errorUtils"
import { Flashcard_Fields, insertNote, removeNote } from "app/utils/flashcardUtils"
import { getSnapshot } from "mobx-state-tree"
import * as Speech from "expo-speech"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface FreeStudySessionScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"FreeStudySession">> {}

export const FreeStudySessionScreen: FC<FreeStudySessionScreenProps> = observer(
  function FreeStudySessionScreen() {
    const { deckStore } = useStores()
    const deck = deckStore.selectedDeck
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const currentFlashcards = deck?.sessionCards
    const currentFlashcard = currentFlashcards?.length > 0 ? currentFlashcards[0] : null
    const [newNote, setNewNote] = useState("")
    const notesModalRef = useRef<BottomSheetModal>()
    const selectedFlashcardModalRef = useRef<BottomSheetModal>()
    const data = useMemo(
      () => (!!currentFlashcard && !!currentFlashcard?.notes ? currentFlashcard.notes : null),
      [currentFlashcard],
    )

    const navigateHome = () => {
      navigation.navigate(AppRoutes.DECKS)
    }
    const editFlashcard = () => {
      selectedFlashcardModalRef?.current.present()
    }

    const rightSwipe = async () => {
      deckStore.selectedDeck.reshuffleFirstCard()
    }

    const leftSwipe = async () => {
      deckStore.selectedDeck.removeFirstSessionCard()
    }

    const upSwipe = async () => {
      deckStore.selectedDeck.removeFirstSessionCard()
    }

    const addNewNote = () => {
      currentFlashcard.addNote(newNote)
      insertNote(currentFlashcard?.id, newNote)
      clearNote()
    }

    const deleteNote = (text: string) => {
      removeNote(currentFlashcard?.id, text)
      currentFlashcard.deleteNote(text)
    }

    const clearNote = () => {
      setNewNote("")
    }

    const showNotes = () => {
      notesModalRef?.current?.present()
    }

    const pronouceCurrentWord = () => {
      Speech.stop()
      if (currentFlashcards && currentFlashcards.length > 0) {
        const soundOption = deckStore?.selectedDeck?.soundOption
        const languageOption = deckStore?.selectedDeck?.playSoundLanguage
        if (currentFlashcards[0]?.[soundOption.toString()]) {
          Speech.speak(currentFlashcards[0]?.[soundOption.toString()], { language: languageOption })
        }
      }
    }

    return (
      <Screen style={$root}>
        <Header
          title={deck.title}
          customHeader={
            <View style={$count_container}>
              <CustomText
                preset="title2"
                style={{ marginRight: spacing.size320, fontFamily: typography.primary.normal }}
                text={deck?.sessionCards?.length.toString()}
              ></CustomText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.size280 }}>
                <Icon onPress={() => editFlashcard()} icon="fluent_edit_outline" size={24} />
                <Icon onPress={() => showNotes()} icon="notes" size={24} />
                <Icon icon="play_sound" onPress={() => pronouceCurrentWord()} size={25} />
              </View>
            </View>
          }
        ></Header>
        {deck?.sessionCards && deck?.sessionCards?.length > 0 ? (
          <SwipeCards
            currentDeck={deckStore.selectedDeck}
            swipeRight={() => rightSwipe()}
            swipeLeft={() => leftSwipe()}
            swipeUp={() => upSwipe()}
            cards={deck.sessionCards}
          ></SwipeCards>
        ) : (
          <CustomSwipeCards
            swipeLeft={() => navigateHome()}
            swipeRight={() => navigateHome()}
            children={
              <View style={$sessions_statistics}>
                <CustomText style={{ marginBottom: spacing.size200 }} preset="title2">
                  Horray! You have just learned more words
                </CustomText>
                <CustomText style={{ marginTop: "auto" }} preset="caption1Strong">
                  Swipe to go back home
                </CustomText>
              </View>
            }
          ></CustomSwipeCards>
        )}

        <BottomSheet ref={notesModalRef} customSnap={["70%", "90%"]}>
          <TextField
            autoCorrect={false}
            autoComplete="off"
            placeholder="Add note"
            /*         LeftAccessory={(props) => (
            <Icon containerStyle={props.style} size={20} icon="edit_filled"></Icon>
          )} */
            RightAccessory={(props) => (
              <Icon
                onPress={() => clearNote()}
                containerStyle={props.style}
                color={colors.palette.neutral500}
                size={20}
                icon="cancel"
              ></Icon>
            )}
            inputWrapperStyle={$text_input_wrapper}
            containerStyle={$modal_text_field}
            value={newNote}
            onChangeText={setNewNote}
            onSubmitEditing={() => addNewNote()}
          ></TextField>
          <View>
            <FlatList
              data={data ? getSnapshot(data) : []}
              keyExtractor={(i, index) => i + index}
              renderItem={(i) => {
                return (
                  <View style={$notes_container}>
                    <Text>{i.item}</Text>
                    <Icon onPress={() => deleteNote(i.item)} size={24} icon="delete"></Icon>
                  </View>
                )
              }}
            />
          </View>
        </BottomSheet>
        <BottomSheet
          onDismiss={() => deckStore.selectedDeck.removeSelectedFlashcard()}
          ref={selectedFlashcardModalRef}
          customSnap={["85"]}
        >
          <EditFlashcard
            deck={deckStore.selectedDeck}
            flashcard={
              deckStore.selectedDeck.sessionCards?.length > 0
                ? deckStore.selectedDeck.sessionCards[0]
                : null
            }
          ></EditFlashcard>
        </BottomSheet>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $count_container: ViewStyle = {
  flexDirection: "row",
  alignContent: "center",
  justifyContent: "space-between",
  alignItems: "center",
}

const $sessions_statistics: ViewStyle = {
  height: "100%",
  padding: spacing.size160,
}

const $count_style: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  marginRight: 2,
  lineHeight: 24,
  textAlignVertical: "center",
}

const $text_input_wrapper: ViewStyle = {
  //backgroundColor: "white",
  borderWidth: 0,
}

const $modal_text_field: ViewStyle = {
  marginVertical: spacing.medium,
}

const $notes_container: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignContent: "center",
  marginBottom: spacing.large,
}
