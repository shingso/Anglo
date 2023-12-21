import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import {
  BottomMainAction,
  Button,
  Card,
  CustomModal,
  CustomText,
  FlashcardListItem,
  Header,
  Loading,
  Screen,
  Text,
} from "../components"
import { spacing } from "../theme/spacing"
import { Deck, FlashcardModel, useStores } from "../models"
import { useNavigation } from "@react-navigation/native"
import { colors, custom_colors, typography } from "../theme"
import { AppRoutes, AppStackParamList, freeLimitDeck } from "../utils/consts"
import { getGlobalDeckById, importFreeGlobalDeckById } from "app/utils/globalDecksUtils"
import { showErrorToast } from "app/utils/errorUtils"
import BottomSheet from "@gorhom/bottom-sheet"
import { borderRadius } from "app/theme/borderRadius"
import { FlashList, FlashListProps } from "@shopify/flash-list"
import { addCardsToShow, updateDeckLastAdded } from "app/utils/deckUtils"
import { isSameDay } from "date-fns"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `DeckAdd: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="DeckAdd" component={DeckAddScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const DeckAddScreen: FC<StackScreenProps<AppStackScreenProps, "DeckAdd">> = observer(
  function DeckAddScreen({ route }) {
    const { deck } = route.params
    const { deckStore, subscriptionStore, settingsStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [selectedDeck, setSelectedDeck] = useState(deck)
    const flashcards = selectedDeck?.private_global_flashcards || []
    const [loading, setLoading] = useState(false)
    const [deckLimitModalVisible, setDeckLimitModalVisible] = useState(false)

    const canMakeDeckPastFreeLimit = (): boolean => {
      if (subscriptionStore.hasActiveSubscription()) {
        return true
      }
      if (deckStore?.decks?.length && deckStore.decks.length >= freeLimitDeck) {
        return false
      }
      return true
    }

    useEffect(() => {
      navigation.setOptions({ headerTitle: deck?.title })
      const getGlobalDeck = async (id: string) => {
        const globalDeck = await getGlobalDeckById(id)
        if (globalDeck) {
          setSelectedDeck(globalDeck)
        }
      }
      if (!deck?.private_global_flashcards && deck?.id) {
        getGlobalDeck(deck.id)
      }
    }, [])

    const startNewDailyCardsForDeck = async (deck: Deck) => {
      if (deck?.last_added && isSameDay(deck.last_added, new Date())) {
        return
      }
      addCardsToShow(deck, deck.new_per_day, settingsStore?.isOffline)
      const response = await updateDeckLastAdded(deck)
    }

    const importDeck = async () => {
      if (!canMakeDeckPastFreeLimit()) {
        setDeckLimitModalVisible(true)
        return
      }
      setLoading(true)
      const newDeck = await importFreeGlobalDeckById(selectedDeck.id, selectedDeck.title, newPerDay)
      if (newDeck && newDeck?.id) {
        const deck = await deckStore.addDeckFromRemote(newDeck?.id)
        if (!deck) {
          navigation.navigate(AppRoutes.DECKS)
          showErrorToast("Error adding deck from remote, sign in and out to refresh decks")
          return
        }
        startNewDailyCardsForDeck(deck)
        navigation.navigate(AppRoutes.DECKS)
        return
      }
      showErrorToast("Error importing deck")
      setLoading(false)
    }

    const [startingValue, setStartingValue] = useState(10)
    const [newPerDay, setNewPerDay] = useState(3)

    return (
      <Screen contentContainerStyle={{ flexGrow: 1 }} style={$root}>
        <Header title={deck?.title}></Header>
        <View style={$container}>
          {/*    <View style={{ flexDirection: "row", marginBottom: spacing.size160 }}>
            <Button
              preset="custom_default_small"
              text="Get deck"
              onPress={() => importDeck()}
              disabled={loading}
            ></Button>
          </View>
          <CustomText style={{ marginBottom: spacing.size80 }} preset="title2">
            {selectedDeck.title}
          </CustomText>
 */}
          {selectedDeck?.description ? (
            <CustomText
              style={{ marginBottom: spacing.size200 }}
              preset="caption1"
              presetColors={"secondary"}
            >
              {selectedDeck.description}
            </CustomText>
          ) : null}
          <CustomText preset="body1Strong" style={{ marginBottom: spacing.size80 }}>
            {flashcards?.length} cards
          </CustomText>
          <FlashList
            contentContainerStyle={{ paddingBottom: 120 }}
            estimatedItemSize={44}
            showsVerticalScrollIndicator={false}
            data={flashcards}
            renderItem={({ item }) => <FlashcardListItem flashcard={item}></FlashcardListItem>}
          ></FlashList>
        </View>
        <CustomModal
          header={"Deck limit reached"}
          body={"Subscribe to add more decks"}
          secondaryAction={() => setDeckLimitModalVisible(false)}
          mainActionLabel={"Subscribe"}
          mainAction={() => navigation.navigate(AppRoutes.SUBSCRIBE)}
          visible={deckLimitModalVisible}
        />
        <BottomMainAction
          label="Get deck"
          onPress={() => importDeck()}
          disabled={loading}
        ></BottomMainAction>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
  flex: 1,
}
