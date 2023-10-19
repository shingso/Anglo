import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { AppRoutes, languageLabels } from "app/utils/consts"
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
import { useTheme } from "@react-navigation/native"
import { addCardsToShow } from "app/utils/deckUtils"

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
  const { deckStore, boughtDeckStore, settingsStore } = useStores()
  const [paidCardsCount, setPaidCardsCount] = useState<Number>(0)
  const [isPurchasable, setIsPurchasable] = useState<Boolean>(false)
  const selectedDeck = deckStore?.selectedDeck
  const theme = useTheme()

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
          <CustomText
            style={{ marginBottom: spacing.size240, fontFamily: typography.primary.light }}
            preset="title1"
          >
            {selectedDeck?.title}
          </CustomText>

          <Card
            onPress={() => startSession(selectedDeck)}
            style={{
              minHeight: 300,
              elevation: 0,
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
                    alignItems: "flex-start",
                  }}
                >
                  <CustomText style={{ fontSize: 52 }}>
                    {selectedDeck?.todaysCards?.length}
                  </CustomText>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      backgroundColor: custom_palette.primary80,
                      // backgroundColor: custom_palette.grey74,
                      //borderWidth: 1.2,
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "flex-end",
                      marginBottom: spacing.size280,
                    }}
                  >
                    <Icon icon="fluent_play_outline" color={custom_palette.white} size={22}></Icon>
                  </View>
                  {/*   <CustomText style={{ marginBottom: spacing.size60 }} preset="title1">
                    {selectedDeck?.cardProgressCount}
                  </CustomText> */}

                  {/*   <Icon icon="play" color={custom_colors.brandForeground1} size={28}></Icon> */}
                </View>
                <View style={{ marginTop: 100, marginBottom: spacing.size160 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: spacing.size40,
                    }}
                  >
                    <CustomText style={{ color: custom_palette.primary60 }} preset="caption1Strong">
                      Progress:{" "}
                      {Math.trunc(
                        (selectedDeck?.cardProgressCount /
                          (selectedDeck?.todaysCards?.length + selectedDeck?.cardProgressCount)) *
                          100,
                      )}
                      %
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
                <View style={{ flexDirection: "row", gap: spacing.size80, flexWrap: "wrap" }}>
                  {selectedDeck?.addNewCardsPerDay ? (
                    <StatusLabel
                      text={deckStore?.selectedDeck?.new_per_day + " added cards per day"}
                    ></StatusLabel>
                  ) : (
                    <StatusLabel
                      style={{
                        backgroundColor: theme.colors.dangerBackground1,
                        color: theme.colors.dangerForeground2,
                      }}
                      text={"No cards added automatically"}
                    ></StatusLabel>
                  )}
                  <StatusLabel
                    style={{
                      backgroundColor: custom_palette.primary90,
                      color: "white",
                    }}
                    text={languageLabels[selectedDeck?.playSoundLanguage]}
                  ></StatusLabel>
                  <StatusLabel
                    style={{
                      backgroundColor: custom_palette.primary90,
                      color: "white",
                    }}
                    text={selectedDeck?.soundOption}
                  ></StatusLabel>
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
              elevation: 0,
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
                <Icon icon="repeat_arrow" style={{ marginRight: spacing.size120 }} size={22}></Icon>
                <View>
                  <CustomText preset="body1">{"Free study"}</CustomText>
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
            marginBottom: spacing.size120,
          }}
        >
          <CustomText preset="body1Strong">Flashcards</CustomText>
          {/*     <CustomText style={{ color: custom_colors.brandForeground1 }} preset="caption1Strong">
            View all
          </CustomText> */}
        </View>
        <Card
          onPress={() => navigation.navigate(AppRoutes.FLASHCARD_LIST)}
          style={{
            marginBottom: spacing.size80,
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
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon icon="flashcards" style={{ marginRight: spacing.size120 }} size={24}></Icon>
                <View>
                  <CustomText preset="body1">
                    {selectedDeck?.flashcards.length + " cards"}
                  </CustomText>
                </View>
              </View>
              {/*     <StatusLabel
                style={{
                  marginLeft: spacing.size200,
                  backgroundColor: custom_palette.primary80,
                  color: "white",
                }}
                text={selectedDeck?.activeCardsCount?.toString() + " active"}
              ></StatusLabel> */}
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
              elevation: 0,
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
                  <CustomText preset="body1">{`Get ${paidCardsCount} more premium cards`}</CustomText>
                </View>
              </View>
            }
          ></Card>
        ) : null}
        <Card
          onPress={() => navigation.navigate(AppRoutes.PURCHASE_DECK)}
          style={{
            minHeight: 0,
            elevation: 0,
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
                icon="fluent_lightbulb"
                style={{ marginRight: spacing.size120 }}
                size={22}
              ></Icon>
              <View>
                <CustomText preset="body1">{`Use AI to generate cards`}</CustomText>
              </View>
            </View>
          }
        ></Card>
        <Card
          onPress={() => addCardsToShow(deck, 5, settingsStore.isOffline)}
          style={{
            minHeight: 0,
            elevation: 0,
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
                <CustomText preset="body1">{`Start 5 cards`}</CustomText>
              </View>
            </View>
          }
        ></Card>
        {/*     <Card
          onPress={() => navigation.navigate(AppRoutes.DECK_SETTINGS)}
          style={{
            minHeight: 0,
            elevation: 0,
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
                  icon="settings"
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
        ></Card> */}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  paddingBottom: spacing.size280,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
