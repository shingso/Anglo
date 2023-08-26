import React, { FC, useCallback, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"

import { Button, Card, CustomText, Screen, Text } from "../components"
import { spacing } from "../theme/spacing"
import { Deck, FlashcardModel, useStores } from "../models"
import { useNavigation } from "@react-navigation/native"
import { Deck_Fields, addCardsToShow, getDeck, newPerDayList } from "../utils/deckUtils"
import { colors, custom_colors, typography } from "../theme"
import { supabase } from "../services/supabase/supabase"
import { ScrollView } from "react-native-gesture-handler"
import { AppRoutes, AppStackParamList } from "../utils/consts"
import { getSnapshot, IStateTreeNode } from "mobx-state-tree"

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
    const { deckStore } = useStores()
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()

    const { deck } = route.params
    const flashcards = deck.global_flashcards
    useEffect(() => {
      navigation.setOptions({ headerTitle: deck?.title })
    }, [])

    const importDeck = async () => {
      cloneDeck(deck.id, deck.title)
      navigation.navigate(AppRoutes.DECKS)
    }

    const [startingValue, setStartingValue] = useState(10)
    const [newPerDay, setNewPerDay] = useState(3)

    const addNewRemoteDeckToStore = async (id: string) => {
      const deckResponse = await getDeck(id)

      if (deckResponse) {
        deckStore.addDeck(deckResponse)
      }
    }

    const cloneDeck = async (deck_id: String, deck_title: String) => {
      let { data: deck, error } = await supabase.rpc("clone_deck", {
        deck_id: deck_id,
        deck_title: deck_title,
        [Deck_Fields.NEW_PER_DAY]: newPerDay,
      })
      if (deck?.id) {
        const res = await addNewRemoteDeckToStore(deck.id)
        const localDeck = deckStore.getDeckById(deck.id)
        addCardsToShow(localDeck, startingValue)
      }
    }

    return (
      <Screen style={$root}>
        <CustomText style={{ marginBottom: spacing.size80 }} preset="title2">
          {deck.title}
        </CustomText>
        <View style={{ flexDirection: "row", marginBottom: spacing.size160 }}>
          <Button
            preset="custom_default_small"
            text="Get deck"
            onPress={() => importDeck()}
          ></Button>
        </View>
        {deck?.description ? (
          <CustomText style={{ marginBottom: spacing.size200 }} preset="caption1">
            {deck.description}
          </CustomText>
        ) : null}

        {/*  <View style={{ marginVertical: spacing.medium }}>
          <CustomText preset="body1strong">Initial Starting</CustomText>
          <CustomText preset="caption1">How many cards do you plan on studying now?</CustomText>
        </View>

        <View style={{ marginVertical: spacing.medium }}>
          <CustomText preset="body1strong">Cards Per Day</CustomText>
          <CustomText preset="caption1">The amount of new cards added per day</CustomText>
        </View> */}
        <CustomText preset="body1strong" style={{ marginBottom: spacing.size80 }}>
          {flashcards.length} cards
        </CustomText>
        <FlatList
          contentContainerStyle={{ paddingBottom: 200 }}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          data={flashcards}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{ paddingVertical: spacing.size20 }}
              key={item.id}
              children={
                <Card
                  style={{
                    width: "100%",
                    padding: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    elevation: 0,
                    borderRadius: 4,
                    paddingHorizontal: spacing.size160,
                    paddingVertical: spacing.size120,
                    minHeight: 0,
                  }}
                  ContentComponent={<CustomText preset="body2">{item.front}</CustomText>}
                ></Card>
              }
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
  backgroundColor: custom_colors.background5,
}

const $dropdown: ViewStyle = {
  borderWidth: 0,
}

const $dropdownContainer: ViewStyle = {
  borderWidth: 0,
  borderTopWidth: 1,
  borderTopColor: colors.border,
}

const $dropdownSelectedContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
}

const $dropdownSelectedLabel: TextStyle = {
  color: colors.white,
  fontFamily: typography.primary.medium,
}
