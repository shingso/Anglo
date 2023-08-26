import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, FlashcardListItem, Icon, Screen, Text } from "app/components"
import { FlashcardModel, useStores } from "app/models"
import { getSnapshot, IStateTreeNode } from "mobx-state-tree"
import { useNavigation } from "@react-navigation/native"
import { custom_palette, spacing } from "app/theme"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { StackNavigationProp } from "@react-navigation/stack"

interface FreeStudyScreenProps extends NativeStackScreenProps<AppStackScreenProps<"FreeStudy">> {}

export const FreeStudyScreen: FC<FreeStudyScreenProps> = observer(function FreeStudyScreen() {
  // Pull in one of our MST stores

  const { deckStore } = useStores()
  const flashcards = deckStore?.selectedDeck?.flashcards ? deckStore?.selectedDeck?.flashcards : []
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const [unselectedFlashcards, setUnselectedFlashcards] = useState([])

  const addToUnselectedFlashcards = (flashcardId: string) => {
    setUnselectedFlashcards((prev) => {
      return [...prev, flashcardId]
    })
  }

  const removeFromUnselectedFlashcards = (flashcardId: string) => {
    setUnselectedFlashcards((prev) => {
      return [...prev.filter((id) => id != flashcardId)]
    })
  }

  const clearUnselectedFlashcards = () => {
    setUnselectedFlashcards([])
  }

  const setActiveFlashcards = () => {
    const activeFlashcards = flashcards.filter((card) => !!card?.next_shown).map((card) => card.id)
    setUnselectedFlashcards(activeFlashcards)
  }

  const setInactiveFlashcards = () => {
    const inactiveFlashcards = flashcards.filter((card) => !card?.next_shown).map((card) => card.id)
    setUnselectedFlashcards(inactiveFlashcards)
  }

  const goToFreeStudySession = () => {
    const selectedFlashcards = flashcards.filter((card) => !unselectedFlashcards.includes(card.id))
    deckStore.selectedDeck.setCustomSessioncards(selectedFlashcards)
    navigation.navigate(AppRoutes.FREE_STUDY_SESSION)
  }

  return (
    <Screen style={$root} preset="fixed">
      <View style={$container}>
        <View style={{ flexDirection: "row", gap: spacing.size100 }}>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => clearUnselectedFlashcards()}
            preset="custom_default_small"
          >
            All
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setActiveFlashcards()}
            preset="custom_secondary_small"
          >
            Active
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => setInactiveFlashcards()}
            preset="custom_secondary_small"
          >
            Inactive
          </Button>
          <Button
            style={{ marginBottom: spacing.size120 }}
            onPress={() => goToFreeStudySession()}
            preset="custom_secondary_small"
          >
            Start
          </Button>
        </View>
        <FlatList
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          data={getSnapshot(flashcards as IStateTreeNode)}
          renderItem={({ item, index }) => (
            <FlashcardListItem
              onPress={() =>
                !unselectedFlashcards.includes(item.id)
                  ? addToUnselectedFlashcards(item.id)
                  : removeFromUnselectedFlashcards(item.id)
              }
              RightComponent={
                !unselectedFlashcards.includes(item.id) ? (
                  <Icon size={20} icon="fluent_add"></Icon>
                ) : null
              }
              key={item.id}
              flashcard={item}
            ></FlashcardListItem>
          )}
        ></FlatList>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: custom_palette.grey94,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
