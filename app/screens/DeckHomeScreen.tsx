import React, { FC, useEffect, useMemo, useRef, useState } from "react"
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
  Option,
  Text,
  BottomSheet,
  ModalHeader,
  Button,
  BottomMainAction,
  BOTTOM_ACTION_HEIGHT,
} from "app/components"
import { Deck, useStores } from "app/models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { getPaidFlashcardsCountByDeckId } from "app/utils/subscriptionUtils"
import { showSuccessToast } from "app/utils/errorUtils"
import { spacing, custom_palette, typography } from "app/theme"
import { borderRadius } from "app/theme/borderRadius"
import { addCardsToShow } from "app/utils/deckUtils"
import { LinearGradient } from "expo-linear-gradient"
import { ScrollView } from "react-native-gesture-handler"
import { type } from "@testing-library/react-native/build/user-event/type"
import { StackNavigationProp } from "@react-navigation/stack"
import CircularProgress from "react-native-circular-progress-indicator"

interface DeckHomeScreenProps extends AppStackScreenProps<"DeckHome"> {}

export const DeckHomeScreen: FC<DeckHomeScreenProps> = observer(function DeckHomeScreen() {
  const { deckStore, settingsStore } = useStores()
  const [paidCardsCount, setPaidCardsCount] = useState<Number>(0)
  const selectedDeck = deckStore?.selectedDeck
  const selectedFlashcardModalRef = useRef<BottomSheetModal>()
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const cardsPerDayModelRef = useRef<BottomSheetModal>()
  const [newPerDay, setNewPerDay] = useState(1)

  const numberOfCards = useMemo(
    () =>
      Array(26)
        .fill(0, 1, 26)
        .map((_, index) => index),
    [],
  )

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

  const totalTodaysCards =
    (selectedDeck?.todaysCards?.length || 0) + (selectedDeck?.passedTodaysCardProgress || 0)
  const todaysProgress =
    totalTodaysCards !== 0
      ? Math.trunc((selectedDeck?.passedTodaysCardProgress / totalTodaysCards) * 100)
      : 0

  const startCards = () => {
    addCardsToShow(selectedDeck, newPerDay, settingsStore.isOffline)
    cardsPerDayModelRef?.current?.close()
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
        <View style={{ marginHorizontal: spacing.size200, marginTop: spacing.size60 }}>
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
              paddingVertical: 16,
              paddingHorizontal: 16,
              height: 300,
            }}
            ContentComponent={
              /*  <View
                style={{
                  paddingHorizontal: spacing.size100,
                  paddingTop: spacing.size40,
                  paddingBottom: spacing.size160,
                  justifyContent: "space-between",
                }}
              >
                {totalTodaysCards !== 0 ? (
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
                          Progress: {todaysProgress}%
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
                            width: `${todaysProgress}%`,
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
                ) : (
                  <View>
                    {selectedDeck?.flashcards?.length > 0 ? (
                      <CustomText>No cards due today</CustomText>
                    ) : (
                      <CustomText>Add some flashcards to get started</CustomText>
                    )}
                  </View>
                )}
              </View> */
              <View style={{ justifyContent: "space-between", height: "100%" }}>
                {selectedDeck?.passedTodaysCardProgress !== totalTodaysCards ? (
                  <View style={{ flexDirection: "row", gap: 12, justifyContent: "space-between" }}>
                    <View
                      style={{
                        padding: 16,
                        borderRadius: 8,
                      }}
                    >
                      <CustomText preset="title1" style={{ fontFamily: typography.primary.medium }}>
                        {/* {selectedDeck?.passedTodaysCardProgress + "/" + totalTodaysCards} */}
                        {selectedDeck?.todaysCards?.length}
                      </CustomText>
                      <CustomText preset="caption1">In Progress</CustomText>
                    </View>
                    {/*          <View
                      style={{
                        width: 120,
                        padding: 16,
                        borderRadius: 8,
                      }}
                    >
                      <CustomText preset="title1" style={{ fontFamily: typography.primary.medium }}>
                        {selectedDeck?.passedTodaysCardProgress}
                      </CustomText>
                      <CustomText preset="caption1">Completed</CustomText>
                    </View> */}
                    <CircularProgress
                      inActiveStrokeOpacity={0.2}
                      valueSuffix={"%"}
                      radius={50}
                      value={todaysProgress}
                      title={selectedDeck?.passedTodaysCardProgress + "/" + totalTodaysCards}
                      titleStyle={{ color: "black", fontFamily: typography.primary.semiBold }}
                    />
                  </View>
                ) : (
                  <CustomText preset="title1" style={{ fontFamily: typography.primary.light }}>
                    Completed
                  </CustomText>
                )}
                <View style={{ flexDirection: "row", gap: 8, alignSelf: "flex-end" }}>
                  <Button
                    preset="custom_secondary_small"
                    onPress={() => cardsPerDayModelRef?.current.present()}
                  >
                    Start more cards
                  </Button>
                  <Button
                    onPress={() => navigation.navigate(AppRoutes.FREE_STUDY)}
                    preset="custom_secondary_small"
                  >
                    Free study
                  </Button>
                </View>
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
            <CustomText preset="title2" style={{ fontFamily: typography.primary.light }}>
              Flashcards
            </CustomText>
          </View>
          {/*    <Card
            onPress={() => navigation.navigate(AppRoutes.FLASHCARD_LIST)}
            style={{
              marginBottom: spacing.size80,
              minHeight: 0,
              elevation: 0,
            }}
            ContentComponent={
              
            }
          ></Card>
 */}
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
              <View>
                <CustomText preset="title2" style={{ fontFamily: typography.primary.medium }}>
                  {selectedDeck?.flashcards.length + " cards"}
                </CustomText>
                <CustomText preset="caption2" style={{ fontFamily: typography.primary.medium }}>
                  {selectedDeck?.flashcards.filter((card) => !!card?.next_shown).length +
                    " cards started"}
                </CustomText>
              </View>
            </View>
            <Button
              preset="custom_outline_small"
              onPress={() => navigation.navigate(AppRoutes.FLASHCARD_LIST)}
            >
              View all
            </Button>
          </View>
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
                    style={{ height: 28, width: 28, marginRight: spacing.size120 }}
                    source={require("../../assets/icons/diamond.png")}
                  />
                  <View>
                    <CustomText preset="body1">{`Get ${paidCardsCount} more premium cards`}</CustomText>
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
        </View>
      </View>
      <BottomSheet ref={selectedFlashcardModalRef} customSnap={["85"]}>
        <EditFlashcard
          flashcard={selectedDeck?.selectedFlashcard}
          deck={selectedDeck}
        ></EditFlashcard>
      </BottomSheet>
      <BottomSheet ref={cardsPerDayModelRef} customSnap={["85"]}>
        <ModalHeader title={"Number of cards to start"}></ModalHeader>
        <ScrollView
          contentContainerStyle={{ paddingBottom: BOTTOM_ACTION_HEIGHT + spacing.size160 }}
          showsVerticalScrollIndicator={false}
        >
          {numberOfCards.map((num) => (
            <Option
              key={num}
              onPress={setNewPerDay}
              title={num}
              option={num}
              currentSelected={newPerDay}
            ></Option>
          ))}
        </ScrollView>
        <View style={{ marginHorizontal: -16 }}>
          <BottomMainAction label={"Start"} onPress={() => startCards()}></BottomMainAction>
        </View>
      </BottomSheet>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
