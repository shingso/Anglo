import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { CustomText, Screen, Text } from "app/components"
import { getGlobalDecksByUserId } from "app/utils/globalDecksUtils"
import { supabase } from "app/services/supabase/supabase"
import { useNavigation } from "@react-navigation/native"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { spacing } from "app/theme"
import { GlobalDeck, useStores } from "app/models"
import { TouchableOpacity } from "react-native-gesture-handler"
import { StackNavigationProp } from "@react-navigation/stack"
// import { useStores } from "app/models"

interface UserGlobalDecksScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"UserGlobalDecks">> {}

export const UserGlobalDecksScreen: FC<UserGlobalDecksScreenProps> = observer(
  function UserGlobalDecksScreen() {
    // Pull in one of our MST stores
    const { globalDeckStore } = useStores()
    const userGlobalDecks = globalDeckStore.decks

    // Pull in navigation via hook
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()

    useEffect(() => {
      const getUserGlobalDecks = async () => {
        const user = await supabase.auth.getUser()
        if (user?.data?.user?.id) {
          globalDeckStore.getUserGlobalDecks(user?.data?.user?.id)
        }
      }

      getUserGlobalDecks()
    }, [])

    const selectGlobalDeck = (deck: GlobalDeck) => {
      globalDeckStore.selectGlobalDeck(deck)
      navigation.navigate(AppRoutes.USER_GLOBAL_DECKS_EDIT)
    }

    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          {userGlobalDecks.map((deck) => {
            return (
              <TouchableOpacity
                style={{ marginVertical: spacing.size120 }}
                onPress={() => selectGlobalDeck(deck)}
                key={deck.id}
              >
                <CustomText>{deck.title}</CustomText>
                <CustomText>{deck?.private_global_flashcards?.length}</CustomText>
              </TouchableOpacity>
            )
          })}
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  paddingHorizontal: spacing.size200,
}
