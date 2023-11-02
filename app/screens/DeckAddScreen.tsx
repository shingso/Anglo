import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import { Button, Card, CustomText, FlashcardListItem, Loading, Screen, Text } from "../components"
import { spacing } from "../theme/spacing"
import { Deck, FlashcardModel, useStores } from "../models"
import { useNavigation } from "@react-navigation/native"
import { colors, custom_colors, typography } from "../theme"
import { AppRoutes, AppStackParamList } from "../utils/consts"
import { getGlobalDeckById, importFreeGlobalDeckById } from "app/utils/globalDecksUtils"

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
    const { deckStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [selectedDeck, setSelectedDeck] = useState(deck)
    const flashcards = selectedDeck?.private_global_flashcards || []
    const [loading, setLoading] = useState(false)

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

    const importDeck = async () => {
      const newDeck = await importFreeGlobalDeckById(selectedDeck.id, selectedDeck.title, newPerDay)
      if (newDeck && newDeck?.id) {
        deckStore.addDeckFromRemote(newDeck?.id)
      }
      navigation.navigate(AppRoutes.DECKS)
    }

    const [startingValue, setStartingValue] = useState(10)
    const [newPerDay, setNewPerDay] = useState(3)

    return (
      <Screen style={$root}>
        <View style={{ flexDirection: "row", marginBottom: spacing.size160 }}>
          <Button
            preset="custom_default_small"
            text="Get deck"
            onPress={() => importDeck()}
          ></Button>
        </View>
        <CustomText style={{ marginBottom: spacing.size80 }} preset="title2">
          {selectedDeck.title}
        </CustomText>

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
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          data={flashcards}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id}
              children={<FlashcardListItem flashcard={item}></FlashcardListItem>}
            ></TouchableOpacity>
          )}
        ></FlatList>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: spacing.size200,
}
