import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, View, ViewStyle, Image } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  Card,
  CustomText,
  EditFlashcard,
  Header,
  Icon,
  Screen,
  Text,
  BottomSheet,
} from "app/components"
import { Deck, useStores } from "app/models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AppRoutes } from "app/utils/consts"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { getPaidFlashcardsCountByDeckId } from "app/utils/subscriptionUtils"
import { showSuccessToast } from "app/utils/errorUtils"
import { spacing, custom_palette, typography } from "app/theme"
import { borderRadius } from "app/theme/borderRadius"
import { addCardsToShow } from "app/utils/deckUtils"
import { LinearGradient } from "expo-linear-gradient"

interface DeckHomeScreenProps extends AppStackScreenProps<"DeckHome"> {}

export const DeckHomeScreen: FC<DeckHomeScreenProps> = observer(function DeckHomeScreen() {
  const { deckStore, settingsStore } = useStores()
  const [paidCardsCount, setPaidCardsCount] = useState<Number>(0)
  const selectedDeck = deckStore?.selectedDeck
  const selectedFlashcardModalRef = useRef<BottomSheetModal>()
  const navigation = useNavigation()

  useEffect(() => {
    const setPurchasabeDeck = async () => {
      const paidCount = await getPaidFlashcardsCountByDeckId(selectedDeck?.global_deck_id)
      setPaidCardsCount(paidCount)
    }
    if (selectedDeck?.global_deck_id) {
      setPurchasabeDeck()
    }
  }, [selectedDeck?.global_deck_id])

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
    <Screen style={$root} contentContainerStyle={{ flexGrow: 1 }} preset="scroll">
      <Header
        onRightPress={() => navigation.navigate(AppRoutes.DECK_SETTINGS)}
        rightIcon="settings"
        style={{}}
        title={selectedDeck?.title}
      ></Header>
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: spacing.size160, marginTop: spacing.size60 }}>
          {/*  <CustomText
            style={{ marginBottom: spacing.size240, fontFamily: typography.primary.light }}
            preset="title1"
          >
            {selectedDeck?.title}
          </CustomText> */}

          <Card
            onPress={() => startSession(selectedDeck)}
            style={{
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
                {selectedDeck?.todaysCards?.length + selectedDeck?.cardProgressCount !== 0 && (
                  <View>
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
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "flex-end",
                          marginBottom: spacing.size280,
                        }}
                      >
                        <Icon
                          icon="fluent_play_outline"
                          color={custom_palette.white}
                          size={22}
                        ></Icon>
                      </View>
                    </View>
                    <View style={{ marginBottom: spacing.size160 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: spacing.size40,
                        }}
                      >
                        <CustomText
                          style={{ color: custom_palette.primary60 }}
                          preset="caption1Strong"
                        >
                          Progress:{" "}
                          {Math.trunc(
                            (selectedDeck?.cardProgressCount /
                              (selectedDeck?.todaysCards?.length +
                                selectedDeck?.cardProgressCount)) *
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
                                (selectedDeck?.todaysCards?.length +
                                  selectedDeck?.cardProgressCount)) *
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
                )}
              </View>
            }
          ></Card>

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
            <CustomText preset="body2Strong" presetColors={"secondary"}>
              Flashcards
            </CustomText>
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
                  {/*     <Icon icon="flashcards" style={{ marginRight: spacing.size120 }} size={24}></Icon> */}
                  <View>
                    <CustomText preset="title2" style={{ fontFamily: typography.primary.medium }}>
                      {selectedDeck?.flashcards.length + " cards"}
                    </CustomText>
                  </View>
                </View>
              </View>
            }
          ></Card>

          {!!paidCardsCount && !selectedDeck?.paid_imported ? (
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
                  <Image
                    style={{ height: 36, width: 36, marginRight: spacing.size120 }}
                    source={require("../../assets/icons/diamond.png")}
                  />
                  <View>
                    <CustomText preset="body1">{`Get ${paidCardsCount} more premium cards`}</CustomText>
                    <CustomText
                      presetColors={"secondary"}
                      preset="caption2"
                    >{`Get more of these cards`}</CustomText>
                  </View>
                </View>
              }
            ></Card>
          ) : null}
          <Card
            onPress={() => navigation.navigate(AppRoutes.MUTLI_ADD_AI)}
            style={{
              minHeight: 0,
              elevation: 0,
              marginBottom: spacing.size80,
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
                {/*   <Icon
                icon="fluent_lightbulb"
                style={{ marginRight: spacing.size120 }}
                size={22}
              ></Icon> */}
                <Image
                  style={{ height: 36, width: 36, marginRight: spacing.size120 }}
                  source={require("../../assets/icons/coding.png")}
                />
                <View>
                  <CustomText preset="body1">{`Generate cards with AI`}</CustomText>
                  <CustomText
                    presetColors={"secondary"}
                    preset="caption2"
                  >{`Quickly make a custom deck using AI`}</CustomText>
                </View>
              </View>
            }
          ></Card>
          <Card
            onPress={() => selectedFlashcardModalRef?.current?.present()}
            style={{
              minHeight: 0,
              elevation: 0,
              marginBottom: spacing.size80,
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
                <Image
                  style={{ height: 36, width: 36, marginRight: spacing.size120 }}
                  source={require("../../assets/icons/coding.png")}
                />
                <View>
                  <CustomText preset="body1">{`Add Flashcard`}</CustomText>
                  <CustomText
                    presetColors={"secondary"}
                    preset="caption2"
                  >{`Add a new flashcard`}</CustomText>
                </View>
              </View>
            }
          ></Card>

          <View style={{ flexDirection: "row", gap: spacing.size80 }}>
            <Card
              onPress={() => navigation.navigate(AppRoutes.FREE_STUDY)}
              preset="action"
              ContentComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/*   <Icon icon="repeat_arrow" style={{ marginRight: spacing.size120 }} size={22}></Icon> */}
                  <Image
                    style={{ height: 36, width: 36, marginRight: spacing.size120 }}
                    source={require("../../assets/icons/coding.png")}
                  />
                  <View>
                    <CustomText preset="body1">{"Free study"}</CustomText>
                  </View>
                </View>
              }
            ></Card>
            <Card
              onPress={() => addCardsToShow(selectedDeck, 5, settingsStore.isOffline)}
              preset="action"
              ContentComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ height: 36, width: 36, marginRight: spacing.size120 }}
                    source={require("../../assets/icons/coding.png")}
                  />
                  <View>
                    <CustomText preset="body1">{`Start cards`}</CustomText>
                  </View>
                </View>
              }
            ></Card>
          </View>
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
      <BottomSheet ref={selectedFlashcardModalRef} customSnap={["85"]}>
        <EditFlashcard flashcard={null} deck={selectedDeck}></EditFlashcard>
      </BottomSheet>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
