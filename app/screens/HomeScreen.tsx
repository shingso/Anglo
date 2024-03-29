import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, Image } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import {
  AddDeckModal,
  Card,
  CustomModal,
  CustomText,
  Header,
  HomeForecast,
  Icon,
  LineWord,
  Loading,
  Screen,
} from "../components"
import { Deck_Fields, addCardsToShow, updateDeckLastAdded } from "../utils/deckUtils"
import { Deck, useStores } from "../models"
import { custom_palette, spacing, typography } from "../theme"
import { useNavigation } from "@react-navigation/native"
import {
  AppRoutes,
  AppStackParamList,
  SortType,
  starterFrenchDeckId,
  starterGermanDeckId,
  starterItalianDeckId,
  starterJapaneseDeckId,
  starterMandarinDeckId,
  starterSATVocabularyDeckId,
  starterSpanishDeckId,
} from "../utils/consts"
import { AppStackScreenProps } from "app/navigators"
import { isSameDay } from "date-fns"

export const HomeScreen: FC<StackScreenProps<AppStackScreenProps<"Home">>> = observer(
  function HomeScreen() {
    const { deckStore, settingsStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [conflictModalVisibile, setConflictModalVisible] = useState(false)
    const [addDeckModalVisible, setAddDeckModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const startNewDailyCardsForDeck = async (deck: Deck) => {
      if (deck?.last_added && isSameDay(deck.last_added, new Date())) {
        return
      }
      addCardsToShow(deck, deck.new_per_day, settingsStore?.isOffline)
      const response = await updateDeckLastAdded(deck)
    }

    useEffect(() => {
      //Add new cards for deck
      deckStore.decks.forEach((deck) => {
        if (deck?.addNewCardsPerDay) {
          startNewDailyCardsForDeck(deck)
        }
      })
    }, [])

    const importStarterDeckById = async (id: string) => {
      navigation.navigate(AppRoutes.DECK_ADD, {
        deck: { [Deck_Fields.ID]: id },
      })
    }

    const DeckItem = (props) => {
      const { title, caption, onPress, source } = props
      return (
        <Card
          onPress={() => (onPress ? onPress() : null)}
          style={{
            minHeight: 0,
            elevation: 0,
          }}
          ContentComponent={
            <View
              style={{
                paddingHorizontal: spacing.size120,
                paddingVertical: spacing.size80,
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.size160,
              }}
            >
              {source && <Image style={{ height: 36, width: 36 }} source={source} />}
              <View>
                <CustomText preset="body2Strong">{title}</CustomText>
                <CustomText style={{ flexShrink: 1 }} preset="caption2" presetColors={"secondary"}>
                  {caption}
                </CustomText>
              </View>
            </View>
          }
        ></Card>
      )
    }

    if (deckStore?.loading) {
      return (
        <Screen safeAreaEdges={["bottom", "top"]}>
          <Loading></Loading>
        </Screen>
      )
    }

    return (
      <Screen safeAreaEdges={["bottom", "top"]} style={$root} preset="scroll">
        <View style={$container}>
          <View
            style={{
              paddingHorizontal: spacing.size240,
              marginVertical: spacing.size160,
              marginBottom: spacing.size200,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Icon onPress={() => navigation.openDrawer()} icon="menu" size={22}></Icon>
          </View>

          {deckStore?.decks?.length > 0 ? (
            <HomeForecast></HomeForecast>
          ) : (
            <View style={{ padding: spacing.size200 }}>
              <View style={{ marginBottom: spacing.size400 }}>
                <CustomText
                  preset="title1"
                  style={{
                    fontFamily: typography.primary.light,
                    marginBottom: spacing.size200,
                  }}
                >
                  Welcome!
                </CustomText>

                <View style={{ marginBottom: spacing.size280 }}>
                  <CustomText
                    presetColors={"secondary"}
                    preset="body2Strong"
                    style={{ marginBottom: spacing.size120 }}
                  >
                    Learn more about spaced memorization
                  </CustomText>

                  <DeckItem
                    source={require("../../assets/icons/qanda.png")}
                    title={"Get the most out of studying"}
                    caption={"Get the most out of your studying"}
                    onPress={() => navigation.navigate(AppRoutes.TUTORIAL)}
                  ></DeckItem>
                </View>

                <CustomText
                  presetColors={"secondary"}
                  preset="body2Strong"
                  style={{ marginBottom: spacing.size120 }}
                >
                  Recommended quick start decks
                </CustomText>

                <View style={{ gap: 8 }}>
                  <DeckItem
                    source={require("../../assets/icons/sat_1600.png")}
                    onPress={() => importStarterDeckById(starterSATVocabularyDeckId)}
                    title={"SAT Vocabulary"}
                    caption={"Common and essential SAT vocabulary words"}
                  ></DeckItem>
                  <DeckItem
                    source={require("../../assets/icons/mexico.png")}
                    onPress={() => importStarterDeckById(starterSpanishDeckId)}
                    title={"Spanish"}
                    caption={"Most frequently used Spanish words"}
                  ></DeckItem>
                  <DeckItem
                    source={require("../../assets/icons/germany.png")}
                    onPress={() => importStarterDeckById(starterGermanDeckId)}
                    title={"German"}
                    caption={"Most frequently used German words"}
                  ></DeckItem>
                  <DeckItem
                    source={require("../../assets/icons/france.png")}
                    onPress={() => importStarterDeckById(starterFrenchDeckId)}
                    title={"French"}
                    caption={"Most frequently used French words"}
                  ></DeckItem>
                  {/*    <DeckItem
                    source={require("../../assets/icons/italy.png")}
                    onPress={() => importStarterDeckById(starterItalianDeckId)}
                    title={"Italian"}
                    caption={"Basic and common Italian words"}
                  ></DeckItem> */}
                </View>

                <LineWord text={"or"}></LineWord>
                <DeckItem
                  source={require("../../assets/icons/custom_deck_icon.png")}
                  onPress={() => setAddDeckModalVisible(true)}
                  title={"Create your own deck"}
                  caption={"Use AI to quickly build a deck."}
                ></DeckItem>
              </View>
            </View>
          )}
          <AddDeckModal
            closeCallback={() => setAddDeckModalVisible(false)}
            addCallback={() => setAddDeckModalVisible(false)}
            visible={addDeckModalVisible}
          ></AddDeckModal>
          <CustomModal
            header={"Conflict Detected!"}
            body={
              "There a difference between your current progress against what we have saved remotely."
            }
            secondaryAction={() => setConflictModalVisible(false)}
            mainAction={() => setConflictModalVisible(false)}
            visible={conflictModalVisibile}
          ></CustomModal>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  height: "100%",
}
