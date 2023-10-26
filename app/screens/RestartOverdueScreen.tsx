import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { FlashcardListItem, Screen, StatusLabel, Text } from "app/components"
import { Flashcard, FlashcardModel, useStores } from "app/models"
import { spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface RestartOverdueScreenProps extends AppStackScreenProps<"RestartOverdue"> {}

export const RestartOverdueScreen: FC<RestartOverdueScreenProps> = observer(
  function RestartOverdueScreen() {
    // Pull in one of our MST stores
    const { deckStore } = useStores()
    const selectedDeck = deckStore.selectedDeck
    const overdueCards = selectedDeck.overdueCards

    // Pull in navigation via hook

    const resetOverDueCards = (flashcards: Flashcard[]) => {
      flashcards.forEach((card) => {})
      //loop over overdue cards
      //set the nextshown to null
      //add a card progress for restart
    }

    return (
      <Screen style={$root} safeAreaEdges={["top"]} preset="fixed">
        <View style={$container}>
          <FlatList
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: spacing.size200 }}
            showsVerticalScrollIndicator={false}
            data={overdueCards}
            renderItem={({ item, index }) => (
              <FlashcardListItem key={item.id} flashcard={item}></FlashcardListItem>
            )}
          ></FlatList>
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
  padding: spacing.size200,
}
