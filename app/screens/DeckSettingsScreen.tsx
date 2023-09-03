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
  EditableText,
  Header,
  Icon,
  Screen,
  Text,
  TextField,
} from "../components"
import { Deck, SoundLanguage, SoundOptions, useStores } from "../models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { deleteDeck, newPerDayList, updateDeck } from "../utils/deckUtils"
import { colors, custom_colors, spacing, typography } from "../theme"
import { AppStackParamList, AppRoutes } from "../utils/consts"
import { getGlobalDeckByOriginalId, makeDeckPublic } from "app/utils/globalDecksUtils"
import { showErrorToast, showSuccessToast } from "app/utils/errorUtils"
import { BottomSheetFlatList, BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet"
import { FlatList } from "react-native-gesture-handler"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

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
    const [confirmDeleteModalVisible, setCofirmDeleteModalVisible] = useState(false)
    const cardsPerDayModelRef = useRef<BottomSheetModal>()
    const [soundSettings, setSoundSettings] = useState(selectedDeck?.soundOption)
    const [languageSettings, setLanguageSettings] = useState(selectedDeck?.playSoundLanguage)

    const theme = useTheme()

    const removeDeck = (deck: Deck) => {
      deleteDeck(deck.id)
      navigation.navigate(AppRoutes.DECKS)
      deckStore.deleteDeck(deck)
    }

    const [toggleIsOn, setToggle] = useState(false)
    const [playSoundAuto, setPlaySoundAuto] = useState(false)

    useEffect(() => {
      setPlaySoundAuto(deckStore.selectedDeck.playSoundAutomatically)
    }, [])

    const data = useMemo(
      () =>
        Array(25)
          .fill(0)
          .map((_, index) => index),
      [],
    )

    const openCardsPerDay = () => {
      cardsPerDayModelRef?.current.present()
    }

    const setSoundOption = (option: SoundOptions) => {
      setSoundSettings(option)
      selectedDeck.setSoundOption(option)
    }

    const setPlayLanguageSetting = (language: SoundLanguage) => {
      setLanguageSettings(language)
      selectedDeck.setPlaySoundLanguage(language)
    }

    const updateSelectedDeck = async () => {
      const newDeck: Partial<Deck> = {
        title: deckTitle,
        id: deckStore.selectedDeck.id,
        new_per_day: newPerDay,
      }
      const updatedDeck = await updateDeck(newDeck)
      deckStore.selectedDeck.updateDeck(updatedDeck)
    }

    const makePublic = async () => {
      const deckPublicStatus = await getGlobalDeckByOriginalId(
        deckStore?.selectedDeck?.global_deck_id,
      )
      if (!deckPublicStatus) {
        const res = makeDeckPublic(deckStore?.selectedDeck?.id)
        if (!res) {
          showErrorToast("Error", "Error occurred trying to make the deck public, try again later.")
        } else {
          showSuccessToast(
            "Deck made public",
            "This deck can now be searched publicly, you can manage your deck in the global decks settings",
          )
        }
      }
    }
    const renderItem = useCallback(
      ({ item }) => (
        <TouchableOpacity onPress={() => setNewPerDay(item)}>
          <View
            style={{
              paddingVertical: spacing.size160,
              paddingHorizontal: spacing.size200,
              backgroundColor: item === newPerDay ? custom_colors.background5 : null,
            }}
          >
            <CustomText preset="body2">{item}</CustomText>
          </View>
        </TouchableOpacity>
      ),
      [newPerDay],
    )

    return (
      <Screen style={$root}>
        <Header
          leftIcon="caretLeft"
          onLeftPress={() => navigation.goBack()}
          title={"Settings"}
        ></Header>
        <View style={$container}>
          {/*        <Button
            preset="custom_default_small"
            style={{ marginBottom: spacing.size200 }}
            onPress={() => updateSelectedDeck()}
          >
            Update deck
          </Button>

          {deckStore?.selectedDeck?.global_deck_id && (
            <Button
              style={{ marginBottom: spacing.size160 }}
              preset="custom_outline_small"
              onPress={() => makePublic()}
            >
              Make public
            </Button>
          )}

          <Button
            style={{ marginBottom: spacing.size160 }}
            preset="custom_outline_small"
            onPress={() => deckStore.selectedDeck.clearLastAdded()}
          >
            Clear
          </Button> */}

          <EditableText
            style={{ marginBottom: spacing.size120 }}
            preset="title1"
            placeholder="Title"
            testID="title"
            onSubmit={(value) => setDeckTitle(value)}
            initialValue={deckTitle}
          ></EditableText>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <TouchableOpacity onPress={() => openCardsPerDay()}>
              <View style={{ marginVertical: spacing.medium }}>
                <CustomText style={{ marginBottom: spacing.size20 }} preset="body1Strong">
                  New cards per day
                </CustomText>
                <CustomText preset="body2">
                  {deckStore.selectedDeck.new_per_day} cards added
                </CustomText>
                {/*        <CustomText preset="body2" style={{ color: custom_colors.foreground2 }}>
                  {deckStore.selectedDeck?.last_added?.toString()}
                </CustomText> */}
              </View>
            </TouchableOpacity>
            <CustomSwitch
              isOn={toggleIsOn}
              onToggle={() => {
                setToggle(!toggleIsOn)
              }}
            ></CustomSwitch>
          </View>

          <CustomText
            style={{
              marginBottom: spacing.size80,
            }}
            preset="body1Strong"
          >
            Sound
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.size160,
              marginBottom: spacing.size160,
            }}
          >
            <CustomRadioButton
              selected={soundSettings === SoundOptions.FRONT}
              onPress={() => setSoundOption(SoundOptions.FRONT)}
            ></CustomRadioButton>
            <CustomText preset="body2">Front</CustomText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.size160,
              marginBottom: spacing.size160,
            }}
          >
            <CustomRadioButton
              selected={soundSettings === SoundOptions.BACK}
              onPress={() => setSoundOption(SoundOptions.BACK)}
            ></CustomRadioButton>
            <CustomText preset="body2">Back</CustomText>
          </View>

          <CustomText preset="caption1Strong" style={{ marginBottom: spacing.size160 }}>
            Language
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.size160,
              marginBottom: spacing.size160,
            }}
          >
            <CustomRadioButton
              selected={languageSettings === SoundLanguage.ENGLISH}
              onPress={() => setPlayLanguageSetting(SoundLanguage.ENGLISH)}
            ></CustomRadioButton>
            <CustomText preset="body2">English</CustomText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.size160,
              marginBottom: spacing.size160,
            }}
          >
            <CustomRadioButton
              selected={languageSettings === SoundLanguage.SPANISH_MX}
              onPress={() => setPlayLanguageSetting(SoundLanguage.SPANISH_MX)}
            ></CustomRadioButton>
            <CustomText preset="body2">Spanish</CustomText>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: spacing.size200,
            }}
          >
            <View>
              <CustomText preset="body2" style={{ marginBottom: spacing.size20 }}>
                Play automatically
              </CustomText>
              <CustomText preset="caption2">Play sound when back is revealed</CustomText>
            </View>
            <CustomSwitch
              isOn={playSoundAuto}
              onToggle={() => {
                selectedDeck.togglePlaySoundAutomatically()
                setPlaySoundAuto(!playSoundAuto)
              }}
            ></CustomSwitch>
          </View>
          <Card
            onPress={() => setCofirmDeleteModalVisible(true)}
            style={{
              marginTop: spacing.size80,
              minHeight: 0,
              elevation: 1,
              backgroundColor: theme.colors.dangerBackground1,
              borderColor: theme.colors.dangerBackground2,
              borderWidth: 1,
            }}
            ContentComponent={
              <View
                style={{
                  paddingHorizontal: spacing.size120,
                  paddingVertical: spacing.size40,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  icon="fluent_delete"
                  style={{ marginRight: spacing.size120 }}
                  size={22}
                  color={theme.colors.dangerForeground1}
                ></Icon>
                <View>
                  <CustomText
                    style={{ color: theme.colors.dangerForeground1 }}
                    preset="body2Strong"
                  >
                    {"Delete deck"}
                  </CustomText>
                  <CustomText style={{ color: theme.colors.dangerForeground1 }} preset="caption2">
                    {"Warning this action cannot be undone."}
                  </CustomText>
                </View>
              </View>
            }
          ></Card>
        </View>
        <BottomSheet ref={cardsPerDayModelRef} customSnap={["85"]}>
          <View style={{ marginBottom: spacing.size200, marginTop: spacing.size120 }}>
            <Icon
              onPress={() => cardsPerDayModelRef?.current?.dismiss()}
              style={{ marginBottom: spacing.size120 }}
              size={26}
              icon="x"
            ></Icon>
            <CustomText style={{ marginBottom: spacing.size160 }} preset="body1Strong">
              New cards added per day
            </CustomText>
            <CustomText preset="body2">Set how many random cards will be added per day</CustomText>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(i) => i}
            renderItem={renderItem}
          ></FlatList>
        </BottomSheet>
        <CustomModal
          mainAction={() => removeDeck(deckStore.selectedDeck)}
          secondaryAction={() => setCofirmDeleteModalVisible(false)}
          mainActionLabel={"Delete"}
          visible={confirmDeleteModalVisible}
          header={"Delete deck?"}
          body={"Are you sure you want to delete this deck? This action cannot be undone."}
          children={
            <View style={{ height: 200 }}>
              <CustomText>adsfads</CustomText>
              <TextField
                autoCorrect={false}
                autoComplete="off"
                //value={newNote}
                //onChangeText={setNewNote}
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
}
