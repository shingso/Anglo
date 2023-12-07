import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import {
  BottomSheet,
  Card,
  CustomModal,
  CustomSwitch,
  CustomText,
  HEADER_HEIGHT,
  Header,
  Icon,
  ModalHeader,
  Screen,
  Option,
  TextField,
  EditableText,
} from "../components"
import { Deck, DeckSnapshotIn, useStores } from "../models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { Deck_Fields, deleteDeck, updateDeck } from "../utils/deckUtils"
import { custom_palette, spacing } from "../theme"
import {
  AppStackParamList,
  AppRoutes,
  SoundOptions,
  soundLanguageOptions,
  languageLabels,
  SoundLanguage,
  soundSettingOptions,
  SCREEN_HEIGHT,
  startOptions,
  startOptionLabels,
  soundSettingOptionsLabels,
} from "../utils/consts"
import { BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet"
import { ScrollView } from "react-native-gesture-handler"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `DeckSettings: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="DeckSettings" component={DeckSettingsScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const DeckSettingsScreen: FC<StackScreenProps<AppStackScreenProps, "DeckSettings">> =
  observer(function DeckSettingsScreen() {
    const { deckStore } = useStores()
    const selectedDeck = deckStore?.selectedDeck
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [newPerDay, setNewPerDay] = useState(deckStore?.selectedDeck?.new_per_day)
    const [deckTitle, setDeckTitle] = useState(deckStore?.selectedDeck?.title)
    const [confirmDelete, setConfirmDelete] = useState("")
    const [confirmDeleteModalVisible, setCofirmDeleteModalVisible] = useState(false)
    const cardsPerDayModelRef = useRef<BottomSheetModal>()
    const soundLanguageModelRef = useRef<BottomSheetModal>()
    const soundFieldModelRef = useRef<BottomSheetModal>()
    const startModeModelRef = useRef<BottomSheetModal>()
    const [startMode, setStartMode] = useState(selectedDeck?.startMode)
    const [soundSettings, setSoundSettings] = useState(selectedDeck?.soundOption)
    const [languageSettings, setLanguageSettings] = useState(selectedDeck?.playSoundLanguage)
    const [flipFlashcard, setFlipFlashcard] = useState(selectedDeck?.flipFlashcard)

    const theme = useTheme()

    const removeDeck = (deck: Deck) => {
      deleteDeck(deck.id)
      navigation.navigate(AppRoutes.DECKS)
      deckStore.deleteDeck(deck)
    }

    const [addNewCardsPerDay, setAddNewCardsPerDay] = useState(
      deckStore.selectedDeck.addNewCardsPerDay,
    )
    const [playSoundAuto, setPlaySoundAuto] = useState(
      deckStore.selectedDeck.playSoundAutomatically,
    )

    useEffect(() => {
      setPlaySoundAuto(deckStore.selectedDeck.playSoundAutomatically)
      setAddNewCardsPerDay(deckStore.selectedDeck.addNewCardsPerDay)
      setFlipFlashcard(deckStore.selectedDeck.flipFlashcard)
    }, [])

    const numberOfCards = useMemo(
      () =>
        Array(26)
          .fill(0)
          .map((_, index) => index),
      [],
    )

    const onSubmitNewCardsPerDay = (newPerDay: number) => {
      setNewPerDay(newPerDay)
      updateSelectedDeck({ [Deck_Fields.NEW_PER_DAY]: newPerDay })
    }

    const onSubmitDeckTitle = (title) => {
      setDeckTitle(title)
      //update the deck name on offline mode or should we even let
      updateSelectedDeck({ [Deck_Fields.TITLE]: title })
    }

    const openCardsPerDay = () => {
      cardsPerDayModelRef?.current.present()
    }

    const setSoundOption = (option: SoundOptions) => {
      setSoundSettings(option)
      selectedDeck.setSoundOption(option)
    }

    const toggleFlipFlashcard = () => {
      selectedDeck.toggleFlipFlashcard()
      setFlipFlashcard(!flipFlashcard)
    }

    const setPlayLanguageSetting = (language: SoundLanguage) => {
      setLanguageSettings(language)
      selectedDeck.setPlaySoundLanguage(language)
    }

    const updateSelectedDeck = async (deck: DeckSnapshotIn) => {
      const newDeck: DeckSnapshotIn = {
        ...deck,
        id: deckStore.selectedDeck.id,
      }
      const updatedDeck = await updateDeck(newDeck)
      deckStore.selectedDeck.updateDeck(updatedDeck)
    }

    const Divider = () => {
      return (
        <View
          style={{
            borderBottomColor: "#242424",
            borderBottomWidth: 0.3,
            marginBottom: spacing.size200,
          }}
        />
      )
    }

    return (
      <Screen style={$root} preset="scroll">
        <Header title={"Settings"}></Header>
        <View style={$container}>
          <EditableText
            style={{ marginBottom: spacing.size120 }}
            preset="title1"
            placeholder="Title"
            testID="title"
            onSubmit={(value) => onSubmitDeckTitle(value)}
            initialValue={deckTitle}
          ></EditableText>
          <View style={{ marginBottom: spacing.size200 }}>
            <Card
              disabled={true}
              style={{
                paddingHorizontal: spacing.size160,
                paddingVertical: spacing.size200,
                minHeight: 0,
                elevation: 0,
                marginTop: spacing.size80,
                borderRadius: 16,
              }}
              ContentComponent={
                <View>
                  <View style={{ marginBottom: spacing.size160 }}>
                    <View
                      style={{
                        marginBottom: spacing.size100,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Icon icon="new" size={20} style={{ marginRight: spacing.size60 }}></Icon>
                        <CustomText preset="body2Strong">New cards per day</CustomText>
                      </View>
                      <CustomSwitch
                        isOn={addNewCardsPerDay}
                        onToggle={() => {
                          selectedDeck.toggleAddNewCardsPerDay()
                          setAddNewCardsPerDay(!addNewCardsPerDay)
                        }}
                      ></CustomSwitch>
                    </View>
                    <CustomText preset="caption2" presetColors={"secondary"}>
                      If toggled on {selectedDeck?.new_per_day} cards will be added in{" "}
                      {startOptionLabels[startMode]} the cards were added.
                    </CustomText>
                  </View>

                  <TouchableOpacity onPress={() => openCardsPerDay()}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: spacing.size200,
                        justifyContent: "space-between",
                      }}
                    >
                      <CustomText preset="body1">
                        {deckStore?.selectedDeck?.new_per_day} cards per day
                      </CustomText>
                      <Icon
                        icon="caret_right"
                        color="#242424"
                        style={{ marginLeft: spacing.size80 }}
                        size={16}
                      ></Icon>
                    </View>
                  </TouchableOpacity>

                  <Divider />
                  <TouchableOpacity onPress={() => startModeModelRef?.current?.present()}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <CustomText preset="body2">{startOptionLabels[startMode]}</CustomText>
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
          </View>
          <Card
            disabled={true}
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size200,
              minHeight: 0,
              elevation: 0,

              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View>
                <View
                  style={{
                    marginBottom: spacing.size160,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon icon="play_sound" size={20} style={{ marginRight: spacing.size60 }}></Icon>
                  <CustomText preset="body2Strong">Sound</CustomText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: spacing.size160,
                  }}
                >
                  <CustomText preset="body2">Play sound automatically</CustomText>
                  <CustomSwitch
                    testID="playSoundAutoToggle"
                    isOn={playSoundAuto}
                    onToggle={() => {
                      selectedDeck.togglePlaySoundAutomatically()
                      setPlaySoundAuto(!playSoundAuto)
                    }}
                  ></CustomSwitch>
                </View>
                <Divider />
                <TouchableOpacity onPress={() => soundLanguageModelRef?.current?.present()}>
                  <View
                    style={{
                      marginBottom: spacing.size200,

                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <CustomText preset="body2">{languageLabels[languageSettings]}</CustomText>
                    </View>
                    <Icon
                      icon="caret_right"
                      color="#242424"
                      style={{ marginLeft: spacing.size80 }}
                      size={16}
                    ></Icon>
                  </View>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity onPress={() => soundFieldModelRef?.current?.present()}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <CustomText preset="body2">
                        {soundSettingOptionsLabels[soundSettings]}
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

          <Card
            testID="flip_flashcard"
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size200,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size80,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View>
                <View
                  style={{
                    marginBottom: spacing.size100,
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
                    <Icon icon="sync" size={20} style={{ marginRight: spacing.size60 }}></Icon>
                    <CustomText preset="body2Strong">Flip flashcard</CustomText>
                  </View>
                  <CustomSwitch
                    testID="flipFlashcardToggle"
                    isOn={flipFlashcard}
                    onToggle={() => toggleFlipFlashcard()}
                  ></CustomSwitch>
                </View>
                <CustomText preset="caption2" presetColors={"secondary"}>
                  Front and back for the flashcard will be flipped during the session.
                </CustomText>
              </View>
            }
          ></Card>

          <Card
            onPress={() => navigation.navigate(AppRoutes.CUSTOM_PROMPTS)}
            testID="customPromptsCard"
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size200,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size80,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View>
                <View
                  style={{
                    marginBottom: spacing.size100,
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
                    <Icon
                      icon="fluent_lightbulb"
                      size={20}
                      style={{ marginRight: spacing.size60 }}
                    ></Icon>
                    <CustomText preset="body2Strong">Set custom AI flashcards</CustomText>
                  </View>
                  <Icon
                    icon="caret_right"
                    color={custom_palette.grey50}
                    style={{ marginLeft: spacing.size80 }}
                    size={16}
                  ></Icon>
                </View>
                <CustomText preset="caption2" presetColors={"secondary"}>
                  Set custom prompts for AI flashcard generation.
                </CustomText>
              </View>
            }
          ></Card>

          <Card
            onPress={() => setCofirmDeleteModalVisible(true)}
            testID="deleteDeckCard"
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size200,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size80,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View>
                <View
                  style={{
                    marginBottom: spacing.size100,
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
                    <Icon
                      icon="fluent_delete"
                      size={20}
                      color={theme.colors.dangerForeground2}
                      style={{ marginRight: spacing.size60 }}
                    ></Icon>
                    <CustomText presetColors={"danger"} preset="body2Strong">
                      Delete deck
                    </CustomText>
                  </View>
                </View>
                <CustomText preset="caption2" presetColors={"secondary"}>
                  Delete this deck and all flashcards. This action cannot be undone.
                </CustomText>
              </View>
            }
          ></Card>

          {/* {!selectedDeck.paid_imported && (
            <Card
              style={{
                paddingHorizontal: spacing.size160,
                paddingVertical: spacing.size160,
                minHeight: 0,
                elevation: 0,
                marginTop: spacing.size80,
                marginBottom: spacing.size80,
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
                    <View>
                      <CustomText preset="body1" presetColors={"secondary"}>
                        Import premium cards
                      </CustomText>
                      <CustomText preset="caption2" presetColors={"secondary"}>
                        There are cards you haven't imported yet
                      </CustomText>
                    </View>
                    <Icon
                      icon="caret_right"
                      color="#242424"
                      style={{ marginLeft: spacing.size80 }}
                      size={16}
                    ></Icon>
                  </View>
                </View>
              }
            ></Card>
          )} */}
        </View>
        <BottomSheet ref={cardsPerDayModelRef} customSnap={["85"]}>
          <ModalHeader title={"Number of cards to be automatically added each day"}></ModalHeader>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 240 }}
            showsVerticalScrollIndicator={false}
          >
            {numberOfCards.map((num) => (
              <Option
                key={num}
                title={num}
                onPress={onSubmitNewCardsPerDay}
                option={num}
                currentSelected={newPerDay}
              ></Option>
            ))}
          </ScrollView>
        </BottomSheet>
        <BottomSheet ref={soundLanguageModelRef} customSnap={["85%"]}>
          <ModalHeader title={"Sound will play in the selected language"}></ModalHeader>
          <View>
            {soundLanguageOptions.map((option) => {
              return (
                <Option
                  key={option}
                  title={languageLabels[option]}
                  onPress={setPlayLanguageSetting}
                  option={option}
                  currentSelected={languageSettings}
                ></Option>
              )
            })}
          </View>
        </BottomSheet>

        <BottomSheet ref={soundFieldModelRef} customSnap={["85%"]}>
          <ModalHeader title={"Sound will play for the selected field"}></ModalHeader>
          <View>
            {soundSettingOptions.map((option) => {
              return (
                <Option
                  key={option}
                  title={soundSettingOptionsLabels[option]}
                  onPress={setSoundOption}
                  option={option}
                  currentSelected={soundSettings}
                ></Option>
              )
            })}
          </View>
        </BottomSheet>

        <BottomSheet ref={startModeModelRef} customSnap={["85%"]}>
          <ModalHeader title={"Cards per day will be added based on"}></ModalHeader>
          <View>
            {startOptions.map((option) => {
              return (
                <Option
                  key={option}
                  title={startOptionLabels[option]}
                  onPress={setStartMode}
                  option={option}
                  currentSelected={startMode}
                ></Option>
              )
            })}
          </View>
        </BottomSheet>

        <CustomModal
          mainAction={() => removeDeck(deckStore.selectedDeck)}
          secondaryAction={() => setCofirmDeleteModalVisible(false)}
          mainActionLabel={"Delete"}
          visible={confirmDeleteModalVisible}
          header={"Delete deck?"}
          mainActionDisabled={confirmDelete !== "Delete"}
          body={"Are you sure you want to delete this deck? This action cannot be undone."}
          children={
            <View>
              <CustomText preset="caption1" style={{ marginBottom: spacing.size80 }}>
                Enter "Delete" to confirm
              </CustomText>
              <TextField
                onChangeText={setConfirmDelete}
                autoCorrect={false}
                autoComplete="off"
                placeholder="Delete"
              ></TextField>
            </View>
          }
        ></CustomModal>
      </Screen>
    )
  })

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
  height: "100%",
  //TODO figure better way to determine this height
  minHeight: SCREEN_HEIGHT - HEADER_HEIGHT,
}
