import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  Button,
  CustomModal,
  CustomText,
  FlashcardListItem,
  Icon,
  Screen,
  StatusLabel,
  Text,
} from "app/components"
import {
  Flashcard,
  FlashcardModel,
  FlashcardSnapshotIn,
  QueryFunctions,
  useStores,
} from "app/models"
import { custom_colors, custom_palette, spacing } from "app/theme"
import { Flashcard_Fields, updateFlashcard } from "app/utils/flashcardUtils"
import { v4 as uuidv4 } from "uuid"

interface RestartOverdueScreenProps extends AppStackScreenProps<"RestartOverdue"> {}

export const RestartOverdueScreen: FC<RestartOverdueScreenProps> = observer(
  function RestartOverdueScreen() {
    // Pull in one of our MST stores
    const { deckStore, settingsStore } = useStores()
    const selectedDeck = deckStore.selectedDeck
    const overdueCards = selectedDeck.overdueCards
    const [selectedCards, setSelectedCard] = useState<Flashcard[]>([])
    const [confirmModalVisibile, setConfirmModalVisible] = useState(false)
    // Pull in navigation via hook

    useEffect(() => {
      setSelectedCard(overdueCards)
    }, [])

    const addToSelectedFlashcard = (card: Flashcard) => {
      if (selectedCards.find((curr) => curr.id === card.id)) {
        return
      }
      setSelectedCard((prev) => [...prev, card])
    }

    const removeFromSelectedFlashcard = (card: Flashcard) => {
      setSelectedCard((prev) => [...prev.filter((curr) => curr.id !== card.id)])
    }

    const resetOverDueCards = (flashcards: Flashcard[]) => {
      flashcards.forEach(async (card) => {
        const resetFlashcard: FlashcardSnapshotIn = {
          [Flashcard_Fields.ID]: card.id,
          [Flashcard_Fields.NEXT_SHOWN]: null,
        }
        card.updateFlashcard(resetFlashcard)
        if (settingsStore.isOffline) {
          selectedDeck.addToQueuedQueries({
            id: uuidv4(),
            variables: JSON.stringify(resetFlashcard),
            function: QueryFunctions.UPSERT_FLASHCARDS,
          })
        } else {
          const res = await updateFlashcard(resetFlashcard)
        }
      })

      setConfirmModalVisible(false)
    }

    return (
      <Screen style={$root} safeAreaEdges={["top"]} preset="fixed">
        <View style={$container}>
          <Button
            onPress={() => setConfirmModalVisible(true)}
            preset="custom_default"
            style={{ marginVertical: spacing.size120 }}
          >
            Reset cards
          </Button>
          <CustomText style={{ marginBottom: spacing.size80 }}>
            Cards selected: {selectedCards?.length}
          </CustomText>
          {overdueCards?.length > 0 ? (
            <FlatList
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: spacing.size200 }}
              showsVerticalScrollIndicator={false}
              data={overdueCards}
              renderItem={({ item, index }) => (
                <FlashcardListItem
                  onPress={() =>
                    selectedCards.includes(item)
                      ? removeFromSelectedFlashcard(item)
                      : addToSelectedFlashcard(item)
                  }
                  key={item.id}
                  flashcard={item}
                  LeftComponent={
                    selectedCards.includes(item) ? (
                      <Icon
                        size={20}
                        color={custom_colors.successForeground1}
                        icon="circle_check_filled"
                      ></Icon>
                    ) : (
                      <Icon size={20} color={custom_palette.grey50} icon="circle"></Icon>
                    )
                  }
                ></FlashcardListItem>
              )}
            ></FlatList>
          ) : (
            <CustomText>No overdue cards</CustomText>
          )}
        </View>

        <CustomModal
          header={"Reset Cards"}
          body={selectedCards.length.toString() + " cards will be reset"}
          secondaryAction={() => setConfirmModalVisible(false)}
          mainActionLabel={"Reset"}
          mainAction={() => resetOverDueCards(selectedCards)}
          visible={confirmModalVisibile}
        />
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
