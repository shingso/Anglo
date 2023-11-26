import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Animated, Dimensions, FlatList, Image, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import {
  BottomSheet,
  CustomSwipeCards,
  CustomText,
  EditFlashcard,
  Header,
  Icon,
  ModalHeader,
  Screen,
  SwipeCards,
  Text,
  TextField,
} from "../components"
import { CardProgressSnapshotIn, Flashcard, QueryFunctions, useStores } from "../models"
import { colors, custom_colors, custom_palette, spacing, typography } from "../theme"
import { useNavigation, useTheme } from "@react-navigation/native"
import { loadOrInitalizeSettings, reloadDefaultSettings } from "../utils/settingsUtil"
import { pronouceFlashcardWithDeckSettings } from "../utils/soundUtils"
import {
  Flashcard_Fields,
  addToFlashcardProgress,
  flipFrontAndBackFlashcard,
  insertNote,
  removeNote,
  updateFlashcard,
} from "../utils/flashcardUtils"
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet"
import { getSnapshot } from "mobx-state-tree"
//import * as Speech from "expo-speech"

import { millisecondsToTime } from "../utils/helperUtls"
import Modal from "react-native-modal"
import { AppRoutes, AppStackParamList, SCREEN_WIDTH } from "../utils/consts"
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
import { AppStackScreenProps } from "app/navigators"
import { ExpandingDot } from "react-native-animated-pagination-dots"
import { ScrollView } from "react-native-gesture-handler"

export const SessionScreen: FC<StackScreenProps<AppStackScreenProps<"Session">>> = observer(
  function SessionScreen() {
    const { deckStore, settingsStore } = useStores()
    const deck = deckStore.selectedDeck
    const theme = useTheme()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [sessionStats, setSessionStats] = useState({
      right: 0,
      left: 0,
      up: 0,
      totalSwipes: 0,
      longestElapsed: 0,
      //how many have moved onto the next level? because just right might be failed + success
    })
    const currentFlashcards = deck?.sessionCards
    const currentFlashcard = currentFlashcards?.length > 0 ? currentFlashcards[0] : null
    const [newNote, setNewNote] = useState("")
    const notesModalRef = useRef<BottomSheetModal>()
    const tutorialModalRef = useRef<BottomSheetModal>()
    const selectedFlashcardModalRef = useRef<BottomSheetModal>()
    const data = useMemo(
      () => (!!currentFlashcard && !!currentFlashcard?.notes ? currentFlashcard.notes : null),
      [currentFlashcard],
    )

    const cards = deck?.flipFlashcard
      ? deck.sessionCards.map((card) => flipFrontAndBackFlashcard(card))
      : deck.sessionCards
    const [sessionProgressLog, setSessionProgressLog] = useState<CardProgressSnapshotIn[]>([])
    const slides = [
      {
        key: "one",
        image: require("../../assets/images/girl_looking_at_phone.png"),
        title: "Smart cards",
        text: "When using these flashcards, cards will automatically be placed in a pile for review based on your response.",
        backgroundColor: "#22bcb5",
      },
      {
        key: "two",
        image: require("../../assets/images/girl_looking_at_phone.png"),
        title: "The card",
        text: "Tap the card to reveal the back",
        backgroundColor: "#22bcb5",
      },
      {
        key: "two",
        image: require("../../assets/images/girl_looking_at_phone.png"),
        title: "You know it!",
        text: "If you know the back of the card easily, swipe the card left",
        backgroundColor: "#22bcb5",
      },
      {
        key: "three",
        image: require("../../assets/images/girl_looking_at_phone.png"),
        title: "You know it, but weren't confident about it",
        text: "If you got the back correct, but was unsure or took some time recalling, swipe the card up.",
        backgroundColor: "#22bcb5",
      },
      {
        key: "four",
        image: require("../../assets/images/girl_looking_at_phone.png"),
        title: "Forgot card",
        text: "If you don't know the back, swipe left",
      },
      {
        key: "five",
        image: require("../../assets/images/girl_looking_at_phone.png"),
        title: "Review cards at intervals",
        text: "As your recall of the card gets better, the card will be scheduled for longer.",
        backgroundColor: "#22bcb5",
      },
    ]

    useEffect(() => {
      if (settingsStore?.showSessionTutorial) {
        tutorialModalRef?.current.present()
        settingsStore.setShowSessionTutorial(false)
      }
    }, [])

    const navigateHome = () => {
      navigation.navigate(AppRoutes.DECKS)
    }

    const editFlashcard = () => {
      selectedFlashcardModalRef?.current.present()
    }
    const scrollX = useRef(new Animated.Value(0)).current
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

      if (settingsStore.isOffline) {
        deck.addToQueuedQueries({
          id: uuidv4(),
          variables: JSON.stringify(progress),
          function: QueryFunctions.INSERT_CARD_PROGRESS,
        })
      }
      //Add to card progress automatically updates the flashcard next shown
      flashcard.addToCardProgress(progress)
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
      if (currentFlashcards && currentFlashcards.length > 0) {
        pronouceFlashcardWithDeckSettings(deckStore.selectedDeck, currentFlashcards[0])
      }
    }

    const undo = async () => {
      if (!sessionProgressLog || sessionProgressLog?.length === 0) {
        showErrorToast("Could not undo")
      }

      const lastProgressLog = sessionProgressLog[sessionProgressLog?.length - 1]
      //if we find it inside the queue array then we delete it else can can query this statement
      //TODO confirm deck was deleted/add error handling if it was not deleted
      //TODO this can still cause a problem if the session lost connection mid way as in it was online -> then offline -> undo
      //in this case we would need to add the delete card progress into our array -> for now we might be able to reply that we could not undo
      if (settingsStore.isOffline) {
        deckStore.selectedDeck.removeFromQueriesByProgressId(lastProgressLog?.id)
      } else {
        const deletedRemote = await deleteCardProgress(lastProgressLog)
        const undoTimeShown = subMinutes(
          new Date(),
          lastProgressLog?.[Card_Progress_Fields.TIME_ELAPSED],
        )
        const undoFlashcard = deckStore?.selectedDeck?.getFlashcardById(
          lastProgressLog.flashcard_id,
        )
        const updatedFlashcard = {
          [Flashcard_Fields.ID]: undoFlashcard.id,
          [Flashcard_Fields.NEXT_SHOWN]: undoTimeShown,
          [Flashcard_Fields.DECK_ID]: deckStore.selectedDeck.id,
        }
        const flashcardResponse = await updateFlashcard(updatedFlashcard)
      }

      setSessionProgressLog((prev) => {
        return [...prev.filter((progress) => progress.id !== lastProgressLog.id)]
      })

      deckStore.selectedDeck.addFlashcardToSession(lastProgressLog.flashcard_id)
      deckStore.selectedDeck.deleteCardProgress(lastProgressLog)
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
    const { width, height } = Dimensions.get("screen")

    const ScrollViewComponent = (props) => {
      const { title, body, image } = props
      return (
        <View
          style={{
            width: width - 32,
            height: "100%",
            padding: spacing.size160,
          }}
        >
          <CustomText
            preset="title1"
            style={{ fontFamily: typography.primary.light, marginBottom: spacing.size160 }}
          >
            {title}
          </CustomText>
          {/* <Image
            resizeMethod="resize"
            style={{ width: "100%", height: 200, marginVertical: spacing.size240 }}
            source={image}
          ></Image> */}
          <CustomText preset="body1">{body}</CustomText>
        </View>
      )
    }

    const addProgressToLog = (progressId: CardProgressSnapshotIn) => {
      setSessionProgressLog((prev) => {
        return [progressId]
      })
    }

    const hasSessionCards = deck?.sessionCards && deck?.sessionCards?.length > 0
    return (
      <Screen style={$root}>
        <Header
          customHeader={
            <View style={$count_container}>
              <CustomText
                preset="title2"
                style={{ marginLeft: spacing.size120, fontFamily: typography.primary.normal }}
                text={deck?.sessionCards?.length.toString()}
              ></CustomText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.size280 }}>
                <Icon
                  onPress={() => tutorialModalRef?.current?.present()}
                  icon="fluent_error_circle"
                  size={24}
                />
                <Icon
                  onPress={() => undo()}
                  disabled={sessionProgressLog.length === 0}
                  icon="undo"
                  color={
                    sessionProgressLog.length === 0
                      ? theme.colors.foreground3
                      : theme.colors.foreground1
                  }
                  size={24}
                />
                <Icon onPress={() => editFlashcard()} icon="fluent_edit_outline" size={24} />
                <Icon onPress={() => showNotes()} icon="notes" size={24} />
                <Icon icon="play_sound" onPress={() => pronouceCurrentWord()} size={25} />
              </View>
            </View>
          }
        ></Header>
        {hasSessionCards ? (
          <SwipeCards
            currentDeck={deckStore.selectedDeck}
            swipeRight={() => rightSwipe()}
            swipeLeft={() => leftSwipe()}
            swipeUp={() => upSwipe()}
            cards={cards}
            showBackCallback={() => showBackCallBack()}
          ></SwipeCards>
        ) : (
          <CustomSwipeCards
            swipeLeft={() => navigateHome()}
            swipeRight={() => navigateHome()}
            children={
              <View style={$sessions_statistics}>
                <CustomText preset="title1" style={{ fontFamily: typography.primary.light }}>
                  The progress you've made
                </CustomText>
                <View style={{ gap: spacing.size160 }}>
                  <View>
                    <CustomText preset="body1">{sessionStats.left}</CustomText>
                    <CustomText preset="caption1">Cards passed</CustomText>
                  </View>
                  <View>
                    <CustomText preset="body1">{sessionStats.totalSwipes}</CustomText>
                    <CustomText preset="caption1">Total swipes</CustomText>
                  </View>
                  <View>
                    <CustomText preset="body1">
                      {millisecondsToTime(sessionStats?.longestElapsed * 60000)}
                    </CustomText>
                    <CustomText preset="caption1">Longest recall period</CustomText>
                  </View>
                </View>
              </View>
            }
          ></CustomSwipeCards>
        )}

        <BottomSheet ref={notesModalRef} customSnap={["70%", "90%"]}>
          <TextField
            autoCorrect={false}
            autoComplete="off"
            placeholder="Add note"
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
        <BottomSheet ref={tutorialModalRef} customSnap={["85"]}>
          <ModalHeader title={"How to get the most out of this application"}></ModalHeader>
          <ScrollView
            horizontal={true}
            scrollEventThrottle={16}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
          >
            {slides.map((slide) => {
              return (
                <ScrollViewComponent
                  key={slide.title}
                  title={slide.title}
                  body={slide.text}
                  image={slide.image}
                ></ScrollViewComponent>
              )
            })}
          </ScrollView>

          <ExpandingDot
            data={slides}
            expandingDotWidth={30}
            scrollX={scrollX}
            inActiveDotOpacity={0.6}
            dotStyle={{
              width: 10,
              height: 10,
              backgroundColor: custom_palette.primary150,
              borderRadius: 5,
              marginHorizontal: 5,
            }}
            containerStyle={{ left: 36, bottom: 120 }}
          />
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

  flex: 1,
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
