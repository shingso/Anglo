import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, View, ViewStyle, Image, TouchableOpacity } from "react-native"
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
  StatusLabel,
  Divider,
} from "app/components"
import { Deck, useStores } from "app/models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AppRoutes, AppStackParamList, startOptionLabels } from "app/utils/consts"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { getPaidFlashcardsCountByDeckId } from "app/utils/subscriptionUtils"
import { showSuccessToast } from "app/utils/errorUtils"
import { spacing, custom_palette, typography, colors, custom_colors } from "app/theme"
import { addCardsToShow } from "app/utils/deckUtils"
import { ScrollView } from "react-native-gesture-handler"
import { StackNavigationProp } from "@react-navigation/stack"

interface DeckHomeScreenProps extends AppStackScreenProps<"DeckHome"> {}

export const DeckHomeScreen: FC<DeckHomeScreenProps> = observer(function DeckHomeScreen() {
  const { deckStore, settingsStore } = useStores()
  const [paidCardsCount, setPaidCardsCount] = useState<Number>(0)
  const selectedDeck = deckStore?.selectedDeck
  const selectedFlashcardModalRef = useRef<BottomSheetModal>()
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const cardsPerDayModelRef = useRef<BottomSheetModal>()
  const [newPerDay, setNewPerDay] = useState(1)
  const theme = useTheme()

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
          <Card
            onPress={() => startSession(selectedDeck)}
            style={{
              elevation: 0,
              marginBottom: spacing.size80,
              paddingVertical: 16,
              paddingHorizontal: 16,
            }}
            ContentComponent={
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: spacing.size160,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon="thinking" size={24} style={{ marginRight: spacing.size60 }}></Icon>
                    <CustomText preset="body1Strong">Study</CustomText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon="play" size={18}></Icon>
                  </View>
                </View>
                {totalTodaysCards > 0 ? (
                  <View style={{ flexDirection: "row", gap: 12, justifyContent: "space-between" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: spacing.size320,
                        alignItems: "center",
                      }}
                    >
                      <View style={{ minWidth: 70 }}>
                        <CustomText
                          preset="title1"
                          style={{ fontFamily: typography.primary.normal }}
                        >
                          {/* {selectedDeck?.passedTodaysCardProgress + "/" + totalTodaysCards} */}
                          {selectedDeck?.todaysCards?.length}
                        </CustomText>
                        <CustomText preset="body2" style={{ fontFamily: typography.primary.light }}>
                          due
                        </CustomText>
                      </View>
                      <View
                        style={{
                          height: "80%",
                          width: 0.8,
                          backgroundColor: theme.colors.foreground3,
                          marginHorizontal: spacing.size320,
                        }}
                      ></View>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            gap: spacing.size80,
                          }}
                        >
                          <CustomText
                            preset="title1"
                            style={{ fontFamily: typography.primary.normal }}
                          >
                            {/* {selectedDeck?.passedTodaysCardProgress + "/" + totalTodaysCards} */}
                            {selectedDeck?.passedTodaysCardProgress}
                          </CustomText>
                          <StatusLabel
                            style={{ marginRight: spacing.size120 }}
                            text={todaysProgress + "%"}
                          ></StatusLabel>
                        </View>
                        <CustomText preset="body2" style={{ fontFamily: typography.primary.light }}>
                          completed
                        </CustomText>
                      </View>
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
                  </View>
                ) : (
                  <View
                    style={{
                      marginBottom: spacing.size320,
                      borderRadius: 8,
                    }}
                  >
                    {/*   <CustomText preset="title1" style={{ fontFamily: typography.primary.medium }}>
                      {selectedDeck?.passedTodaysCardProgress}
                    </CustomText> */}
                    <CustomText preset="body1Strong">You have no cards due today</CustomText>
                  </View>
                )}

                <TouchableOpacity onPress={() => cardsPerDayModelRef?.current.present()}>
                  <View
                    style={{
                      marginBottom: spacing.size200,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon="arrow_up" size={20} style={{ marginRight: spacing.size80 }}></Icon>
                    <CustomText preset="body2">{"Start more cards"}</CustomText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.FREE_STUDY)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      icon="free_study"
                      size={20}
                      style={{ marginRight: spacing.size80 }}
                    ></Icon>
                    <CustomText preset="body2">{"Free study"}</CustomText>
                  </View>
                </TouchableOpacity>
              </View>
            }
          ></Card>
          <Card
            onPress={() => navigation.navigate(AppRoutes.FLASHCARD_LIST)}
            style={{
              paddingHorizontal: spacing.size160,
              paddingVertical: spacing.size200,
              minHeight: 0,
              elevation: 0,
              marginBottom: spacing.size160,
              marginTop: spacing.size80,
              borderRadius: 16,
            }}
            ContentComponent={
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: spacing.size160,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      icon="flashcards"
                      size={24}
                      style={{ marginRight: spacing.size80 }}
                    ></Icon>
                    <CustomText preset="body1Strong">Flashcards</CustomText>
                  </View>
                  <Icon icon="more" size={18}></Icon>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: spacing.size320,
                  }}
                >
                  <View style={{ minWidth: 60 }}>
                    <CustomText preset="title1" style={{ fontFamily: typography.primary.normal }}>
                      {selectedDeck?.flashcards.length}
                    </CustomText>
                    <CustomText preset="body2" style={{ fontFamily: typography.primary.light }}>
                      cards
                    </CustomText>
                  </View>
                  <View
                    style={{
                      height: "80%",
                      width: 0.7,
                      backgroundColor: theme.colors.foreground3,
                      marginHorizontal: spacing.size320,
                    }}
                  ></View>
                  <View>
                    <CustomText preset="title1" style={{ fontFamily: typography.primary.normal }}>
                      {selectedDeck?.flashcards.filter((card) => !!card?.next_shown).length}
                    </CustomText>
                    <CustomText preset="body2" style={{ fontFamily: typography.primary.light }}>
                      started
                    </CustomText>
                  </View>
                </View>

                {/*     <Divider style={{ marginBottom: spacing.size200 }}></Divider> */}
                <TouchableOpacity onPress={() => selectedFlashcardModalRef?.current?.present()}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: spacing.size200,
                    }}
                  >
                    <Icon icon="new" size={20} style={{ marginRight: spacing.size80 }}></Icon>
                    <CustomText preset="body2">{`New flashcard`}</CustomText>
                  </View>
                </TouchableOpacity>

                {/*   <Divider style={{ marginBottom: spacing.size200 }}></Divider> */}
                <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.MUTLI_ADD_AI)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Icon icon="robot" size={20} style={{ marginRight: spacing.size80 }}></Icon>
                    <CustomText preset="body2">{`Generate cards with AI`}</CustomText>
                  </View>
                </TouchableOpacity>

                {!!paidCardsCount && !selectedDeck?.paid_imported && (
                  <TouchableOpacity onPress={() => navigation.navigate(AppRoutes.PURCHASE_DECK)}>
                    <View
                      style={{
                        marginTop: spacing.size200,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        icon="fluent_diamond"
                        size={20}
                        style={{ marginRight: spacing.size80 }}
                      ></Icon>
                      <CustomText preset="body2">{`Get ${paidCardsCount} more cards`}</CustomText>
                    </View>
                  </TouchableOpacity>
                )}
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
