import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ListRenderItemInfo, Switch, TextStyle, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import {
  BottomSheet,
  Button,
  Card,
  CustomModal,
  CustomRadioButton,
  CustomSwitch,
  CustomText,
  HEADER_HEIGHT,
  Header,
  Icon,
  LineWord,
  ModalHeader,
  PromptSettings,
  Screen,
  Text,
  Option,
  TextField,
  EditableText,
} from "../components"
import { Deck, DeckSnapshotIn, useStores } from "../models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { Deck_Fields, deleteDeck, newPerDayList, updateDeck } from "../utils/deckUtils"
import { colors, custom_colors, custom_palette, spacing, typography } from "../theme"
import {
  AppStackParamList,
  AppRoutes,
  SoundOptions,
  soundLanguageOptions,
  languageLabels,
  SoundLanguage,
  TranslateLanguage,
  soundSettingOptions,
  SCREEN_HEIGHT,
  startOptions,
  startOptionLabels,
  soundSettingOptionsLabels,
} from "../utils/consts"
import { BottomSheetFlatList, BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet"
import { FlatList, ScrollView } from "react-native-gesture-handler"

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
      deckStore.selectedDeck.playSoundAutomatically,
    )
    const [playSoundAuto, setPlaySoundAuto] = useState(deckStore.selectedDeck.addNewCardsPerDay)

    useEffect(() => {
      setPlaySoundAuto(deckStore.selectedDeck.playSoundAutomatically)
      setAddNewCardsPerDay(deckStore.selectedDeck.addNewCardsPerDay)
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

    const toggleFlipFlashcard = (flip: boolean) => {
      setFlipFlashcard(flip)
      selectedDeck.setFlipFlashcard(flip)
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
              testID="cards_per_day"
              style={{
                paddingHorizontal: spacing.size160,
                paddingVertical: spacing.size120,
                minHeight: 0,
                elevation: 0,
                marginTop: spacing.size80,
                marginBottom: spacing.size80,
                borderRadius: 16,
              }}
              ContentComponent={
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => openCardsPerDay()}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <CustomText
                        preset="body1"
                        presetColors={addNewCardsPerDay ? "brand" : "secondary"}
                      >
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
                  <CustomSwitch
                    isOn={addNewCardsPerDay}
                    onToggle={() => {
                      selectedDeck.toggleAddNewCardsPerDay()
                      setAddNewCardsPerDay(!addNewCardsPerDay)
                    }}
                  ></CustomSwitch>
                </View>
              }
            ></Card>
            <Card
              testID="start_mode"
              style={{
                paddingHorizontal: spacing.size160,
                paddingVertical: spacing.size120,
                minHeight: 0,
                elevation: 0,
                marginBottom: spacing.size80,
                borderRadius: 16,
              }}
              ContentComponent={
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => startModeModelRef?.current?.present()}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <CustomText
                        preset="body1"
                        presetColors={addNewCardsPerDay ? "brand" : "secondary"}
                      >
                        {startOptionLabels[startMode]}
                      </CustomText>
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
              style={{ paddingHorizontal: spacing.size120 }}
              preset="caption1"
              presetColors={"secondary"}
            >
              If toggled on, random cards will automatically be added every day. Cards will not be
              added if study days are skipped
            </CustomText>
          </View>
          <Card
            testID="flip_flashcard"
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size120,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size80,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CustomText preset="body1" presetColors={flipFlashcard ? "brand" : "secondary"}>
                  Flip flashcard
                </CustomText>
                <CustomSwitch
                  testID="flipFlashcardToggle"
                  isOn={flipFlashcard}
                  onToggle={() => toggleFlipFlashcard(!flipFlashcard)}
                ></CustomSwitch>
              </View>
            }
          ></Card>
          <Card
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size120,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size80,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => openCardsPerDay()}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View>
                      <CustomText preset="body1">Play sound automatically</CustomText>
                      <CustomText preset="caption2" presetColors={"secondary"}>
                        Sound will play when back is shown.
                      </CustomText>
                    </View>
                  </View>
                </TouchableOpacity>
                <CustomSwitch
                  testID="playSoundAutoToggle"
                  isOn={playSoundAuto}
                  onToggle={() => {
                    selectedDeck.togglePlaySoundAutomatically()
                    setPlaySoundAuto(!playSoundAuto)
                  }}
                ></CustomSwitch>
              </View>
            }
          ></Card>

          <Card
            disabled={true}
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size120,
              minHeight: 0,
              elevation: 0,
              marginTop: spacing.size80,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View>
                <TouchableOpacity onPress={() => soundLanguageModelRef?.current?.present()}>
                  <View
                    style={{
                      marginBottom: spacing.size160,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <CustomText preset="body1">{languageLabels[languageSettings]}</CustomText>
                      <CustomText preset="caption2" presetColors={"secondary"}>
                        Language sound will be played in.
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
                <View
                  style={{
                    borderBottomColor: "#242424",
                    borderBottomWidth: 0.3,
                    marginBottom: spacing.size120,
                  }}
                />
                <TouchableOpacity onPress={() => soundFieldModelRef?.current?.present()}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <CustomText preset="body1">Front</CustomText>
                      <CustomText preset="caption2" presetColors={"secondary"}>
                        Field of the card that will be read.
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

          {/*     <Card
            disabled={true}
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
                <TouchableOpacity onPress={() => aiLanguageModelRef?.current?.present()}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <CustomText preset="body1" style={{ marginBottom: spacing.size20 }}>
                        {aiLanguage?.charAt(0)?.toUpperCase() + aiLanguage?.slice(1)}
                      </CustomText>
                      <CustomText preset="caption2" presetColors={"secondary"}>
                        AI will create the response in selected language.
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

          <Card
            testID="start_mode"
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size120,
              minHeight: 0,
              elevation: 0,
              marginBottom: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.CUSTOM_PROMPTS)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomText preset="body1">Set AI custom prompts</CustomText>
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
            onPress={() => setCofirmDeleteModalVisible(true)}
            style={{
              marginTop: spacing.size80,
              minHeight: 0,
              elevation: 0,
            }}
            ContentComponent={
              <View
                style={{
                  paddingHorizontal: spacing.size80,
                  paddingVertical: spacing.size40,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <CustomText style={{ color: theme.colors.dangerForeground1 }} preset="body1">
                    {"Delete deck"}
                  </CustomText>
                  <CustomText style={{ color: theme.colors.dangerForeground1 }} preset="caption2">
                    {"Warning this action cannot be undone."}
                  </CustomText>
                </View>
                {/*     <Icon icon="fluent_delete" size={22} color={theme.colors.dangerForeground1}></Icon> */}
              </View>
            }
          ></Card>
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
              <CustomText preset="caption1" style={{ marginBottom: spacing.size40 }}>
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
