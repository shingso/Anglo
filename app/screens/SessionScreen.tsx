import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Dimensions, FlatList, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import {
  BottomModal,
  BottomSheet,
  Button,
  Card,
  CustomModal,
  CustomSwipeCards,
  CustomText,
  EditFlashcard,
  Header,
  Icon,
  Screen,
  SwipeCards,
  Text,
  TextField,
} from "../components"
import {
  CardProgress,
  CardProgressSnapshotIn,
  Flashcard,
  QueryFunctions,
  useStores,
} from "../models"
import { colors, custom_colors, custom_palette, spacing } from "../theme"
import { useNavigation } from "@react-navigation/native"
import {
  loadOrInitalizeSettings,
  reloadDefaultSettings,
  Settings_Fields,
  toggleSetting,
} from "../utils/settingsUtil"
import * as Speech from "expo-speech"
import {
  Flashcard_Fields,
  addToFlashcardProgress,
  insertNote,
  removeNote,
  updateFlashcard,
} from "../utils/flashcardUtils"
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import { getSnapshot } from "mobx-state-tree"
//import * as Speech from "expo-speech"

import { millisecondsToTime } from "../utils/helperUtls"
import Modal from "react-native-modal"
import { AppRoutes, AppStackParamList, AppStackScreenProps, SCREEN_WIDTH } from "../utils/consts"
import { Card_Progress_Fields, deleteCardProgress } from "../utils/cardProgressUtils"
import {
  getRemoteRecentUpdate,
  returnRemoteAndLocalMostRecent,
  updateConfirmedRemoteId,
  updateMostRecentLocalId,
} from "app/utils/remote_sync/remoteSyncUtils"
import { showErrorToast } from "app/utils/errorUtils"
import { calculateNextInterval } from "app/utils/superMemoUtils"
import { addDays, addMinutes, differenceInMinutes, subMinutes } from "date-fns"
import { borderRadius } from "app/theme/borderRadius"
import { v4 as uuidv4 } from "uuid"

export const SessionScreen: FC<StackScreenProps<AppStackScreenProps<"Session">>> = observer(
  function SessionScreen() {
    const { deckStore, settingsStore } = useStores()
    const deck = deckStore.selectedDeck
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [sessionStats, setSessionStats] = useState({
      right: 0,
      left: 0,
      up: 0,
      totalSwipes: 0,
      longestElapsed: 0,
      //how many have moved onto the next level? because just right might be failed + success
    })
    const currentFlashcards = deck.sessionCards
    const currentFlashcard = currentFlashcards?.length > 0 ? currentFlashcards[0] : null
    const [newNote, setNewNote] = useState("")
    const notesModalRef = useRef<BottomSheetModal>()
    const tutorialModalRef = useRef<BottomSheetModal>()
    const selectedFlashcardModalRef = useRef<BottomSheetModal>()
    const data = useMemo(
      () => (!!currentFlashcard && !!currentFlashcard?.notes ? currentFlashcard.notes : null),
      [currentFlashcard],
    )
    const [previousProgressId, setPreviousProgressId] = useState(null)
    const [sessionProgressLog, setSessionProgressLog] = useState([])

    useEffect(() => {
      reloadDefaultSettings()
      const loadSettings = async () => {
        const settings = await loadOrInitalizeSettings()
        if (settings?.showSessionTutorial != null && settings.showSessionTutorial) {
          tutorialModalRef?.current.present()
        }
      }
      //this is to make the tutorial modal pop up
      //loadSettings()

      //we need to set the initial previous id for the undo button
      const loadPreviousProgressId = async () => {
        const { localId } = await returnRemoteAndLocalMostRecent()
        //console.log("we have the local id here!!!", localId)
        if (localId) {
          setPreviousProgressId(localId)
        }
      }
      loadPreviousProgressId()
    }, [])

    const navigateHome = () => {
      navigation.navigate(AppRoutes.DECKS)
    }

    const editFlashcard = () => {
      selectedFlashcardModalRef?.current.present()
    }

    const applySessionResponse = async (
      flashcard: Flashcard,
      retrievalLevel: number,
      nextShown: Date,
    ): Promise<any> => {
      let timeElapsed = 0
      const mostRecentProgress = flashcard?.mostRecentProgress
      if (mostRecentProgress) {
        timeElapsed = differenceInMinutes(new Date(), mostRecentProgress.created_at)
      }

      const progress: CardProgressSnapshotIn = {
        [Card_Progress_Fields.ID]: uuidv4(),
        [Card_Progress_Fields.CREATED_AT]: new Date(),
        [Card_Progress_Fields.TIME_ELAPSED]: timeElapsed,
        [Card_Progress_Fields.FLASHCARD_ID]: flashcard.id,
        [Card_Progress_Fields.RETRIEVAL_LEVEL]: retrievalLevel,
        [Card_Progress_Fields.NEXT_SHOWN]: nextShown,
      }

      const updatedFlashcard = {
        [Flashcard_Fields.ID]: flashcard.id,
        [Flashcard_Fields.NEXT_SHOWN]: nextShown,
      }
      if (settingsStore.isOffline) {
        deck.addToQueuedQueries({
          id: uuidv4(),
          variables: JSON.stringify(progress),
          function: QueryFunctions.INSERT_CARD_PROGRESS,
        })
      }
      //TODO write a trigger that updates the flashcard with the card progress
      flashcard.updateFlashcard(updatedFlashcard)
      flashcard.addToCardProgress(progress)
      // const flashcardResponse = await updateFlashcard(updatedFlashcard)
      const response = await addToFlashcardProgress(progress)
      return progress
    }

    const rightSwipe = async () => {
      deckStore.selectedDeck.reshuffleFirstCard()
      const progress = await applySessionResponse(currentFlashcard, 0, currentFlashcard?.next_shown)
      addProgressToLog(progress)
      setSessionStats((prev) => ({
        ...prev,
        right: prev.right + 1,
        totalSwipes: prev.totalSwipes + 1,
      }))
    }

    const leftSwipe = async () => {
      deckStore.selectedDeck.removeFirstSessionCard()
      const nextInterval = calculateNextInterval(currentFlashcard, 2)
      const nextShown = addDays(new Date(), nextInterval)
      const progress = await applySessionResponse(currentFlashcard, 2, nextShown)
      addProgressToLog(progress)
      setSessionStats((prev) => ({
        ...prev,
        left: prev.left + 1,
        longestElapsed:
          progress?.[Card_Progress_Fields.TIME_ELAPSED] > prev.longestElapsed
            ? progress?.[Card_Progress_Fields.TIME_ELAPSED]
            : prev.longestElapsed,
        totalSwipes: prev.totalSwipes + 1,
      }))
    }

    const upSwipe = async () => {
      const nextInterval = calculateNextInterval(currentFlashcard, 1)
      const nextShown = addDays(new Date(), nextInterval)

      if (nextInterval === 0) {
        deckStore.selectedDeck.reshuffleFirstCard()
      } else {
        deckStore.selectedDeck.removeFirstSessionCard()
      }
      const progress = await applySessionResponse(currentFlashcard, 1, nextShown)
      addProgressToLog(progress)
      setSessionStats((prev) => ({
        ...prev,
        up: prev.left + 1,
        longestElapsed:
          progress?.[Card_Progress_Fields.TIME_ELAPSED] > prev.longestElapsed
            ? progress?.[Card_Progress_Fields.TIME_ELAPSED]
            : prev.longestElapsed,
        totalSwipes: prev.totalSwipes + 1,
      }))
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

    const undo = async () => {
      if (!sessionProgressLog || sessionProgressLog?.length === 0) {
        showErrorToast("Error", "Could not undo")
      }

      const lastProgressLog = sessionProgressLog[sessionProgressLog?.length - 1]
      //if we find it inside the queue array then we delete it else can can query this statement

      const deletedRemote = await deleteCardProgress(lastProgressLog)
      //TODO confirm deck was deleted/add error handling if it was not deleted
      deckStore.selectedDeck.deleteCardProgress(lastProgressLog)
      //we can assume that it exists because it doesnt exists in the logs

      //if it does exits in the queued queries then all we need to do is remove it
      //else we can fire the delete card progress -> if it exists -> if we are offline/fails -> add to the quied queries

      const undoTimeShown = subMinutes(
        new Date(),
        lastProgressLog?.[Card_Progress_Fields.TIME_ELAPSED],
      )
      const undoFlashcard = deckStore?.selectedDeck?.getFlashcardById(lastProgressLog.flashcard_id)
      const updatedFlashcard = {
        [Flashcard_Fields.ID]: undoFlashcard.id,
        [Flashcard_Fields.NEXT_SHOWN]: undoTimeShown,
      }
      const flashcardResponse = await updateFlashcard(updatedFlashcard)
      //setFlashcardNextShown(undoFlashcard, undoTimeShown)
      //remove the processed undo progress from log
      setSessionProgressLog((prev) => {
        return [...prev.filter((progress) => progress.id !== lastProgressLog.id)]
      })
      deckStore.selectedDeck.addFlashcardToSession(lastProgressLog.flashcard_id)

      //Fix all of the sync data
      // - Set it to the last card progress that was inserted before it -> we can find this out by...looking at the deckstore
      // or we can ge tit by looking at the local store in general

      //if this works then it syncs both
      const remoteSyncData = await getRemoteRecentUpdate()
      if (remoteSyncData) {
        console.log(remoteSyncData)
        updateMostRecentLocalId(remoteSyncData.last_progress_id)
        updateConfirmedRemoteId(remoteSyncData.last_progress_id)
        // we also need to set the last progressId -> last progress id is the prev prev session
        //this is only usefull when we are local only...
      }
    }

    const showBackCallBack = () => {
      if (deckStore?.selectedDeck?.playSoundAutomatically) {
        pronouceCurrentWord()
      }
    }

    const addProgressToLog = (progressId: CardProgressSnapshotIn) => {
      setSessionProgressLog((prev) => {
        return [progressId]
      })
    }
    const hasSessionCards = deck?.sessionCards && deck?.sessionCards?.length > 0
    return (
      <Screen style={$root}>
        <Header title={deck.title}></Header>
        {hasSessionCards && (
          <View style={$count_container}>
            <CustomText
              preset="body1Strong"
              text={deck?.sessionCards?.length.toString()}
            ></CustomText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.size280 }}>
              <Icon
                onPress={() => undo()}
                disabled={sessionProgressLog.length === 0}
                icon="undo"
                color={
                  sessionProgressLog.length === 0
                    ? custom_colors.foreground3
                    : custom_colors.foreground1
                }
                size={30}
              />
              <Icon onPress={() => editFlashcard()} icon="fluent_edit_outline" size={26} />
              <Icon onPress={() => showNotes()} icon="notes" size={28} />
              <Icon icon="play_sound" onPress={() => pronouceCurrentWord()} size={28} />
            </View>
          </View>
        )}

        {hasSessionCards ? (
          <SwipeCards
            currentDeck={deckStore.selectedDeck}
            swipeRight={() => rightSwipe()}
            swipeLeft={() => leftSwipe()}
            swipeUp={() => upSwipe()}
            cards={deck.sessionCards}
            showBackCallback={() => showBackCallBack()}
          ></SwipeCards>
        ) : (
          <CustomSwipeCards
            swipeLeft={() => navigateHome()}
            swipeRight={() => navigateHome()}
            children={
              <View style={$sessions_statistics}>
                <CustomText preset="body1">Lorum</CustomText>
                <View
                  style={{
                    borderColor: custom_palette.grey82,
                    borderWidth: 1.2,
                    width: "100%",
                    padding: spacing.size120,
                    borderRadius: borderRadius.corner80,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      style={{ marginRight: spacing.size80 }}
                      icon="fluent_lightbulb"
                      size={20}
                    ></Icon>
                    <CustomText>Cards passed : {sessionStats.left}</CustomText>
                  </View>
                </View>
                <View
                  style={{
                    borderColor: custom_palette.grey82,
                    borderWidth: 1.2,
                    width: "100%",
                    padding: spacing.size120,
                    borderRadius: borderRadius.corner80,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      style={{ marginRight: spacing.size80 }}
                      icon="fluent_lightbulb"
                      size={20}
                    ></Icon>
                    <CustomText>Total card reviewed: {sessionStats.totalSwipes}</CustomText>
                  </View>
                </View>
                <View
                  style={{
                    borderColor: custom_palette.grey82,
                    borderWidth: 1.2,
                    width: "100%",
                    padding: spacing.size120,
                    borderRadius: borderRadius.corner80,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      style={{ marginRight: spacing.size80 }}
                      icon="fluent_lightbulb"
                      size={20}
                    ></Icon>
                    <CustomText>
                      Longest Elapsed: {millisecondsToTime(sessionStats?.longestElapsed * 60000)}
                    </CustomText>
                  </View>
                </View>
                {/* <CustomText style={{ marginBottom: spacing.size200 }} preset="title2">
                  Horray! You have just learned more words
                </CustomText>
                <CustomText>Passed</CustomText>
                <CustomText>{sessionStats.left}</CustomText>
                <CustomText>Redo: {sessionStats.right}</CustomText>
                <CustomText>Total card reviewed: {sessionStats.totalSwipes}</CustomText>
                <CustomText>
                  Largest Elapsed: {millisecondsToTime(sessionStats?.longestElapsed * 60000)}
                </CustomText>
                <CustomText style={{ marginTop: "auto" }} preset="caption1Strong">
                  Swipe to go back home
                </CustomText> */}
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
  //borderTopWidth: 0.6,
  alignItems: "center",
  paddingHorizontal: spacing.extraLarge,
  paddingTop: spacing.size200,
}

const $sessions_statistics: ViewStyle = {
  height: "100%",
  gap: spacing.size100,
}

const $text_input_wrapper: ViewStyle = {
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
