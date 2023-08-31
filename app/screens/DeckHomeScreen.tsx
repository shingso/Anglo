import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { DeckHome, Header, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface DeckHomeScreenProps extends AppStackScreenProps<"DeckHome"> {}

export const DeckHomeScreen: FC<DeckHomeScreenProps> = observer(function DeckHomeScreen() {
  const { deckStore } = useStores()
  const navigation = useNavigation()
  const selectedDeck = deckStore.selectedDeck

  return (
    <Screen style={$root} preset="scroll">
      <Header
        containerStyle={{ zIndex: 1, elevation: 4 }}
        leftIcon="caretLeft"
        onLeftPress={() => navigation.goBack()}
        title={selectedDeck?.title}
      ></Header>
      <DeckHome navigation={navigation} deck={selectedDeck}></DeckHome>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
