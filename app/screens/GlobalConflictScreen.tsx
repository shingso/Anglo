import React, { FC } from "react"
import { Observer, observer } from "mobx-react-lite"
import { FlatList, Switch, View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, Header, Screen, Text } from "app/components"
import { useNavigation } from "@react-navigation/native"

import { spacing } from "app/theme/spacing"
import { Flashcard_Fields, updateFlashcardByGlobalFlashcard } from "app/utils/flashcardUtils"
import { IStateTreeNode, getSnapshot } from "mobx-state-tree"
import { Global_Flashcard_Fields } from "../utils/globalFlashcardsUtils"
import { updateDeck } from "app/utils/deckUtils"
import { useStores } from "../models/helpers/useStores"
import { ConflictTypes } from "../models/GlobalFlashcard"

interface GlobalConflictScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"GlobalConflict">> {}

export const GlobalConflictScreen: FC<GlobalConflictScreenProps> = observer(
  function GlobalConflictScreen() {
    // Pull in one of our MST stores
    const { deckStore } = useStores()
    const selectedDeck = deckStore?.selectedDeck
    const conflicts = selectedDeck?.globalConflicts
    const navigation = useNavigation()

    const confirmResolution = () => {
      //if there are any conflicts left

      const includedConflicts = conflicts.filter((conflict) => conflict.include)
      const updateConflicts = []
      const insertConflicts = []

      includedConflicts.forEach((conflict) => {
        if (conflict?.conflictType === ConflictTypes.UPDATE) {
          updateConflicts.push(conflict)
        } else if (conflict.conflictType === ConflictTypes.INSERT) {
          delete conflict[Global_Flashcard_Fields.ID]
          conflict[Flashcard_Fields.DECK_ID] = selectedDeck.id
          insertConflicts.push(conflict)
        }
      })
      console.log(includedConflicts)
      if (updateConflicts.length > 0) {
        updateConflicts.forEach((conflict) => {
          updateFlashcardByGlobalFlashcard(conflict)
        })
      }

      if (insertConflicts.length > 0) {
        //     upsertMultipleFlashcards(insertConflicts)
      }
      const updatedDeckGlobalSync = {
        last_global_sync: new Date(),
        deck_id: selectedDeck.id,
      }
      //TODO make this set to the last global of the deck instead
      updateDeck(updatedDeckGlobalSync)
      selectedDeck.updateDeck(updatedDeckGlobalSync)
    }
    return (
      <Screen style={$root}>
        <Header title={"Updates"}></Header>
        <View style={$container}>
          <FlatList
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            data={deckStore?.selectedDeck?.globalConflicts.slice() || []}
            renderItem={({ item, index }) => (
              <Observer>
                {() => (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{item.id}</Text>
                    <Text>{item.include.toString()}</Text>
                    <Switch value={item.include} onValueChange={() => item.toggleInclude()} />
                  </View>
                )}
              </Observer>
            )}
          ></FlatList>
          <Button onPress={() => confirmResolution()} preset="custom_outline">
            Confirm
          </Button>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
