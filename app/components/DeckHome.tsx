import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { AppRoutes } from "app/utils/consts"
import { CustomText } from "./CustomText"
import { Icon } from "./Icon"
import { Deck, useStores } from "app/models"
import { Card } from "./Card"
import { showSuccessToast } from "app/utils/errorUtils"
import { useEffect, useMemo, useState } from "react"
import { StatusLabel } from "./StatusLabel"
import { borderRadius } from "app/theme/borderRadius"
import { LinearGradient } from "expo-linear-gradient"
import {
  getPaidFlashcardsCountByDeckId,
  getProductExistsByProductId,
} from "app/utils/subscriptionUtils"

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
  const { deckStore, boughtDeckStore } = useStores()
  const [paidCardsCount, setPaidCardsCount] = useState<Number>(0)
  const [isPurchasable, setIsPurchasable] = useState<Boolean>(false)
  const selectedDeck = deckStore?.selectedDeck

  useEffect(() => {
    const setPurchasabeDeck = async () => {
      const productExits = await getProductExistsByProductId(deck?.global_deck_id)
      setIsPurchasable(productExits)
      console.log("product res", productExits)
      if (productExits) {
        const paidCount = await getPaidFlashcardsCountByDeckId(deck?.global_deck_id)
        setPaidCardsCount(paidCount)
      }
    }
    if (deck?.global_deck_id) {
      setPurchasabeDeck()
    }
  }, [deck?.global_deck_id])

  const startSession = (deck: Deck) => {
    if (deck?.todaysCards && deck?.todaysCards.length > 0) {
      deckStore.selectDeck(deck)
      selectedDeck.setSessionCards()
      navigation.navigate(AppRoutes.SESSION)
    } else {
      showSuccessToast("There are no more cards for today")
    }
  }

  return (
    <View style={$styles}>
      <View style={{ marginHorizontal: spacing.size160 }}>
        <View style={{ marginTop: spacing.size60 }}>
          {/*     <CustomText style={{ marginBottom: spacing.size240 }} preset="title1">
            {selectedDeck?.title}
          </CustomText> */}

          <Card
            onPress={() => startSession(selectedDeck)}
            style={{
              minHeight: 0,
              elevation: 1,
              marginBottom: spacing.size80,
            }}
            ContentComponent={
              <View
                style={{
                  paddingHorizontal: spacing.size100,
                  paddingTop: spacing.size40,
                  paddingBottom: spacing.size160,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    marginBottom: spacing.size100,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomText style={{ fontSize: 52 }}>
                    {selectedDeck?.todaysCards?.length}
                  </CustomText>
                  <CustomText style={{ marginBottom: spacing.size60 }} preset="title1">
                    {selectedDeck?.cardProgressCount}
                  </CustomText>

                  {/*   <Icon icon="play" color={custom_colors.brandForeground1} size={28}></Icon> */}
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: spacing.size40,
                    }}
                  >
                    <CustomText style={{ color: custom_palette.primary60 }} preset="caption1Strong">
                      {selectedDeck?.cardProgressCount} /{" "}
                      {(selectedDeck?.cardProgressCount || 0) +
                        (selectedDeck?.todaysCards?.length || 0)}
                    </CustomText>
                  </View>
                  <View
                    style={{
                      backgroundColor: custom_palette.grey94,
                      width: "100%",
                      height: 14,
                      borderRadius: borderRadius.corner80,
                    }}
                  >
                    <LinearGradient
                      style={{
                        borderRadius: borderRadius.corner80,
                        width: `${
                          (selectedDeck?.cardProgressCount /
                            (selectedDeck?.todaysCards?.length + selectedDeck?.cardProgressCount)) *
                          100
                        }%`,
                      }}
                      colors={[custom_palette.primary140, custom_palette.primary100]}
                      start={{ x: 0, y: 0.1 }}
                    >
                      <View
                        style={{
                          height: 14,
                          borderRadius: borderRadius.corner80,
                        }}
                      ></View>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            }
          ></Card>

          {/*     <CustomText style={{ marginBottom: spacing.size120 }} preset="title3">
            Study
          </CustomText> */}
          {/*       <View
            style={{ marginBottom: spacing.size100, flexDirection: "row", gap: spacing.size80 }}
          >
            <Card
              onPress={() => startSession(selectedDeck)}
              style={{ flex: 2.2, backgroundColor: custom_colors.brandBackground3 }}
              ContentComponent={
                <View
                  style={{ paddingHorizontal: spacing.size160, paddingVertical: spacing.size80 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      style={{ marginRight: spacing.size60 }}
                      size={16}
                      color={custom_palette.white}
                      icon="fluent_play_circle"
                    ></Icon>
                    <CustomText style={{ color: custom_palette.white }} preset="caption1Strong">
                      CARDS DUE
                    </CustomText>
                  </View>

                  <CustomText
                    style={{ marginBottom: spacing.size60, color: custom_palette.white }}
                    preset="title1"
                  >
                    {selectedDeck?.todaysCards?.length}
                  </CustomText>
                </View>
              }
            ></Card>
            <Card
              style={{ flex: 1.4 }}
              ContentComponent={
                <View
                  style={{ paddingHorizontal: spacing.size160, paddingVertical: spacing.size80 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      style={{ marginRight: spacing.size60 }}
                      size={16}
                      icon="check_circle"
                    ></Icon>
                    <CustomText preset="caption1Strong">PASSED</CustomText>
                  </View>

                  <CustomText style={{ marginBottom: spacing.size60 }} preset="title1">
                    {selectedDeck.flashcards.reduce((prev, card) => {
                      return (
                        prev +
                        card.todaysCardProgresses.filter(
                          (progress) => progress?.retrieval_level >= 1,
                        ).length
                      )
                    }, 0)}
                  </CustomText>
                </View>
              }
            ></Card>
          </View> */}

          <Card
            onPress={() => navigation.navigate(AppRoutes.FREE_STUDY)}
            style={{
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
                <Icon icon="swipe_right" style={{ marginRight: spacing.size120 }} size={22}></Icon>
                <View>
                  <CustomText preset="body1Strong">{"Free study"}</CustomText>
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
          <CustomText
            style={{ marginBottom: spacing.size120, color: custom_colors.foreground2 }}
            preset="body2Strong"
          >
            Flashcards
          </CustomText>
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
            marginBottom: spacing.size80,
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
                <Icon icon="flashcards" style={{ marginRight: spacing.size120 }} size={24}></Icon>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                    <CustomText preset="body1Strong">
                      {selectedDeck?.flashcards.length + " "}
                    </CustomText>
                    <CustomText style={{ color: custom_palette.grey38 }} preset="caption1Strong">
                      cards
                    </CustomText>
                  </View>
                </View>
              </View>
              <StatusLabel
                style={{
                  marginLeft: spacing.size200,
                  backgroundColor: custom_palette.primary80,
                  color: "white",
                }}
                text={selectedDeck?.activeCardsCount?.toString() + " active"}
              ></StatusLabel>
              {/*    <Icon icon="caretRight" color={custom_colors.foreground2} size={22}></Icon> */}
            </View>
          }
        ></Card>

        {!boughtDeckStore.isDeckBought(selectedDeck?.global_deck_id) &&
        isPurchasable &&
        !!paidCardsCount ? (
          <Card
            onPress={() => navigation.navigate(AppRoutes.PURCHASE_DECK)}
            style={{
              minHeight: 0,
              elevation: 1,
              marginBottom: spacing.size80,
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
                  icon="fluent_add_circle"
                  style={{ marginRight: spacing.size120 }}
                  size={22}
                ></Icon>
                <View>
                  <CustomText preset="body2Strong">{`Get ${paidCardsCount} more premium cards`}</CustomText>
                </View>
              </View>
            }
          ></Card>
        ) : null}
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
                paddingHorizontal: spacing.size120,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: spacing.size100,
                }}
              >
                <Icon
                  style={{ marginRight: spacing.size120 }}
                  icon="fluent_settings_outline"
                  size={22}
                ></Icon>
                <CustomText preset="body2Strong">Settings</CustomText>
              </View>
              <View style={{ flexDirection: "row", gap: spacing.size60 }}>
                <StatusLabel
                  text={deckStore?.selectedDeck?.new_per_day + " cards per day"}
                ></StatusLabel>
              </View>
            </View>
          }
        ></Card>
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
