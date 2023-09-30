import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, Card, CustomText, Icon, Screen, Text } from "../components"
import { colors, spacing, typography } from "../theme"
import { Education_Levels, User, updateUser } from "../utils/userUtils"
import { importGlobalDeckById } from "app/utils/globalDecksUtils"
import { useStores } from "app/models"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `UserSetup: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="UserSetup" component={UserSetupScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const UserSetupScreen: FC<StackScreenProps<AppStackScreenProps, "UserSetup">> = observer(
  function UserSetupScreen() {
    // Pull in one of our MST stores

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { deckStore } = useStores()
    const promoDeckId = "340a0dc1-3767-455d-a8f6-cad938ea9827"

    const educationList = Object.values(Education_Levels).map((level) => {
      return {
        label: level,
        value: level,
      }
    })

    const updateUserData = (user: User) => {
      updateUser(user)
    }

    const importSATVocabDeck = async () => {
      const deck = await importGlobalDeckById(promoDeckId, "SAT Vocabulary")
      if (deck && deck?.id) {
        deckStore.addDeckFromRemote(deck?.id)
      }
    }

    return (
      <Screen safeAreaEdges={["top", "bottom"]} style={$root}>
        <View style={$container}>
          <CustomText preset="title1">Do you know your vocabulary?</CustomText>
          <CustomText></CustomText>
          <Card
            onPress={() => importSATVocabDeck()}
            style={{
              minHeight: 0,
              elevation: 1,
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
                <View>
                  <CustomText preset="body1Strong">
                    {"Get started with a premium 300 cards SAT vocabulary deck."}
                  </CustomText>
                </View>
              </View>
            }
          ></Card>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size160,
  paddingBottom: spacing.size560,
  height: "100%",
}
