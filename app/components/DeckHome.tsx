import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { AppRoutes } from "app/utils/consts"

import { CustomText } from "./CustomText"
import { Icon } from "./Icon"
import { Deck, useStores } from "app/models"
import { Card } from "./Card"
import { showSuccessToast } from "app/utils/errorUtils"
import { useEffect, useState } from "react"
import { getGlobalDeckById, getGlobalPaidFlashcardsByDeckId } from "app/utils/globalDecksUtils"
import { millisecondsToTime } from "app/utils/helperUtls"

export interface DeckHomeProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  deck: Deck
  navigation: any
}

/**
 * Describe your component here
 */
export const DeckHome = observer(function DeckHome(props: DeckHomeProps) {
  const { style, deck, navigation } = props
  const $styles = [$container, style]
  const { deckStore } = useStores()
  const [paidCards, setPaidCards] = useState([])
  useEffect(() => {
    const setPaidFlashcards = async () => {
      const cards = await getGlobalDeckById(deck.global_deck_id)
      //  const value = await getGlobalPaidFlashcardsByDeckId(deck.global_deck_id)
      //   console.log("how many cards", value)
      const paidCard = cards?.global_flashcards?.filter((card) => !card.free)
      setPaidCards(paidCard)
    }

    if (deck?.global_deck_id) {
      setPaidFlashcards()
    }
  }, [deck.global_deck_id])

  const startSession = (deck: Deck) => {
    if (deck?.todaysCards && deck?.todaysCards.length > 0) {
      deckStore.selectDeck(deck)
      deckStore.selectedDeck.setSessionCards()
      navigation.navigate(AppRoutes.SESSION)
    } else {
      showSuccessToast("Good Job!", "There are no more cards for today")
    }
  }

  return (
    <View style={$styles}>
      <View style={{ marginHorizontal: spacing.size160 }}>
        <View style={{ marginTop: spacing.size200 }}>
          <CustomText style={{ marginBottom: spacing.size160 }} preset="body1Strong">
            Today
          </CustomText>
          <Card
            onPress={() => startSession(deckStore.selectedDeck)}
            style={{
              minHeight: 0,
              elevation: 2,
            }}
            ContentComponent={
              <View
                style={{
                  paddingHorizontal: spacing.size200,
                  paddingVertical: spacing.size80,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/*   <Icon
                      icon="fluent_play_outline"
                      style={{ marginRight: spacing.size120 }}
                      size={28}
                    ></Icon> */}
                <View>
                  <CustomText style={{ marginBottom: spacing.size60 }} preset="body2">
                    {deckStore.selectedDeck.todaysCards.length} cards due
                  </CustomText>
                  <CustomText style={{ marginBottom: spacing.size60 }} preset="body2">
                    {deckStore.selectedDeck.flashcards.reduce((prev, card) => {
                      return prev + card.todaysCardProgresses.length
                    }, 0)}{" "}
                    swipes
                  </CustomText>
                  <CustomText style={{ marginBottom: spacing.size60 }} preset="body2">
                    {deckStore.selectedDeck.flashcards.reduce((prev, card) => {
                      return (
                        prev +
                        card.todaysCardProgresses.filter((progress) => progress?.passed).length
                      )
                    }, 0)}{" "}
                    passed
                  </CustomText>
                  <CustomText style={{ marginBottom: spacing.size60 }} preset="body2">
                    {millisecondsToTime(
                      deckStore.selectedDeck.flashcards.reduce((prev, card) => {
                        let maxElapsed = 0
                        card.todaysCardProgresses.forEach((progress) => {
                          if (progress?.time_elapsed) {
                            maxElapsed = Math.max(progress.time_elapsed, maxElapsed)
                          }
                        })
                        return Math.max(prev, maxElapsed)
                      }, 0) * 60000,
                    )}{" "}
                    longest recall
                  </CustomText>
                </View>
              </View>
            }
          ></Card>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: spacing.size200,
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: spacing.size80,
          }}
        >
          <CustomText preset="body1Strong">Flashcards</CustomText>
          {/*   <CustomText
                  style={{ color: custom_colors.brandForeground1 }}
                  preset="caption1Strong"
                >
                  View all
                </CustomText> */}
        </View>

        <Card
          onPress={() => navigation.navigate(AppRoutes.FLASHCARD_LIST)}
          style={{
            marginTop: spacing.size160,
            minHeight: 0,
            elevation: 1,
          }}
          ContentComponent={
            <View
              style={{
                paddingHorizontal: spacing.size120,
                paddingVertical: spacing.size80,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  icon="fluent_lightbulb"
                  style={{ marginRight: spacing.size120 }}
                  size={22}
                ></Icon>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                    <CustomText preset="body1Strong">
                      {deckStore.selectedDeck.flashcards.length + " "}
                    </CustomText>
                    <CustomText preset="body2">cards</CustomText>
                  </View>
                </View>
              </View>
              {/*    <Icon icon="caretRight" color={custom_colors.foreground2} size={22}></Icon> */}
            </View>
          }
        ></Card>
        {deckStore?.selectedDeck?.global_deck_id ? (
          <Card
            onPress={() => navigation.navigate(AppRoutes.PURCHASE_DECK)}
            style={{
              marginTop: spacing.size80,
              minHeight: 0,
              elevation: 1,
            }}
            ContentComponent={
              <View
                style={{
                  paddingHorizontal: spacing.size120,
                  paddingVertical: spacing.size80,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  icon="fluent_add_cards"
                  style={{ marginRight: spacing.size120 }}
                  size={22}
                ></Icon>
                <View>
                  <CustomText preset="body2Strong">{`Get ${paidCards.length} more premium cards`}</CustomText>
                </View>
                {/*          TODO Add this back to not show the purchase deck option when the deck is already purchased */}
                {/* deckStore?.selectedDeck?.isDeckBought(boughtDeckStore.boughtDecks.map((deck) => deck.bought_deck_id)*/}
              </View>
            }
          ></Card>
        ) : null}
        <Card
          onPress={() => navigation.navigate(AppRoutes.FREE_STUDY)}
          style={{
            marginTop: spacing.size80,
            minHeight: 0,
            elevation: 1,
          }}
          ContentComponent={
            <View
              style={{
                paddingHorizontal: spacing.size120,
                paddingVertical: spacing.size80,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                icon="fluent_add_cards"
                style={{ marginRight: spacing.size120 }}
                size={22}
              ></Icon>
              <View>
                <CustomText preset="body2Strong">{"Free study"}</CustomText>
              </View>
            </View>
          }
        ></Card>

        <View
          style={{
            flexDirection: "row",
            marginTop: spacing.size280,
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: spacing.size80,
          }}
        >
          <CustomText style={{ marginBottom: spacing.size160 }} preset="body1Strong">
            Settings
          </CustomText>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Card
            onPress={() => navigation.navigate(AppRoutes.DECK_SETTINGS)}
            style={{
              minHeight: 0,
              elevation: 1,
              flex: 1,
              marginBottom: 2,
            }}
            ContentComponent={
              <View
                style={{
                  paddingVertical: spacing.size80,
                  paddingHorizontal: spacing.size80,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    style={{ marginRight: spacing.size120 }}
                    icon="fluent_settings_outline"
                    size={22}
                  ></Icon>
                  <CustomText preset="body2Strong">
                    {deckStore.selectedDeck.new_per_day} cards added per day
                  </CustomText>
                </View>
              </View>
            }
          ></Card>
        </View>
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
