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
import { spacing, custom_colors, colors } from "app/theme"
import { Card_Progress_Fields, deleteCardProgress } from "app/utils/cardProgressUtils"
import { AppStackParamList, AppRoutes } from "app/utils/consts"
import { showErrorToast } from "app/utils/errorUtils"
import {
  addToFlashcardProgress,
  Flashcard_Fields,
  insertNote,
  removeNote,
} from "app/utils/flashcardUtils"
import { millisecondsToTime } from "app/utils/helperUtls"
import {
  returnRemoteAndLocalMostRecent,
  getRemoteRecentUpdate,
  updateMostRecentLocalId,
  updateConfirmedRemoteId,
} from "app/utils/remote_sync/remoteSyncUtils"
import {
  reloadDefaultSettings,
  loadOrInitalizeSettings,
  toggleSetting,
  Settings_Fields,
} from "app/utils/settingsUtil"
import { calculateNextInterval } from "app/utils/superMemoUtils"
import { differenceInMinutes, addDays } from "date-fns"
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
    const currentFlashcards = deck.sessionCards
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
        Speech.speak(currentFlashcards[0]?.front)
      }
    }

    return (
      <Screen style={$root}>
        <Header
          containerStyle={{ zIndex: 1, elevation: 4 }}
          leftIcon="caretLeft"
          onLeftPress={() => navigation.goBack()}
          title={deck.title}
        ></Header>
        {deck?.sessionCards && deck?.sessionCards?.length > 0 && (
          <View style={$count_container}>
            <Text style={$count_style} text={deck?.sessionCards?.length.toString()} />
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.size320 }}>
              <Icon
                onPress={() => editFlashcard()}
                icon="fluent_edit_outline"
                color={custom_colors.foreground1}
                size={26}
              />
              <Icon
                onPress={() => showNotes()}
                icon="fluent_note_edit"
                color={custom_colors.foreground1}
                size={28}
              />
              <Icon
                icon="sound"
                onPress={() => pronouceCurrentWord()}
                color={custom_colors.foreground1}
                size={28}
              />
            </View>
          </View>
        )}

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
  borderColor: custom_colors.background5,
  // borderBottomWidth: 0.6,
  borderTopWidth: 0.6,
  alignItems: "center",
  paddingHorizontal: spacing.extraLarge,
  paddingTop: spacing.size200,
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

const $modal: ViewStyle = {
  backgroundColor: "white",
  padding: 0,
  borderRadius: 8,
  //animationIn="zoomIn"
  //animationOut="zoomOut"
}

const $buttons_container: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-end",
}

const $modal_header: ViewStyle = {
  paddingBottom: spacing.small,
  paddingHorizontal: spacing.medium,
  marginHorizontal: -spacing.medium,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $modal_header_title: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
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

const $tutorial_title: TextStyle = {
  marginBottom: spacing.medium,
}

const $confirm_leave_container: ViewStyle = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const $confirm_leave_actions: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
}
