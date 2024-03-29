import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { CustomModal } from "./CustomModal"
import { TextField } from "./TextField"
import { SubscriptionStore, useStores } from "app/models"
import { showErrorToast } from "app/utils/errorUtils"
import { useState } from "react"
import { addDeck } from "app/utils/deckUtils"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AppRoutes, AppStackParamList, freeLimitDeck } from "app/utils/consts"
import { StackNavigationProp } from "@react-navigation/stack"
import { CustomText } from "./CustomText"

export interface AddDeckModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  visible: boolean
  closeCallback: Function
  addCallback: Function
}

/**
 * Describe your component here
 */
export const AddDeckModal = observer(function AddDeckModal(props: AddDeckModalProps) {
  const { style, visible, closeCallback, addCallback } = props
  const { deckStore, subscriptionStore, settingsStore } = useStores()
  const $styles = [$container, style]
  const [deckTitle, setDeckTitle] = useState("")
  const [error, setError] = useState(null)
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
  const theme = useTheme()
  const canMakeDeckPastFreeLimit = (): boolean => {
    if (subscriptionStore.hasActiveSubscription()) {
      return true
    }
    if (deckStore?.decks?.length && deckStore.decks.length >= freeLimitDeck) {
      return false
    }
    return true
  }

  const addNewDeck = async (title: string) => {
    const addedDeck = await addDeck({ title })
    //TODO add query to backend if offline
    if (addedDeck) {
      deckStore.addDeck(addedDeck)
    }
    setDeckTitle("")
  }

  const confirmAddNewDeck = (title) => {
    setError(null)

    if (settingsStore.isOffline) {
      setError("Go online to add a new deck")
      return
    }

    if (!title) {
      setError("Enter a title for your new deck")
      return
    }

    if (canMakeDeckPastFreeLimit()) {
      addNewDeck(title)
    }
    if (closeCallback) {
      addCallback()
    }
  }

  const closeModal = () => {
    if (closeCallback) {
      closeCallback()
    }
    setError(null)
    setDeckTitle("")
  }

  const goToSubscribe = () => {
    if (closeCallback) {
      closeCallback()
    }
    navigation.navigate(AppRoutes.SUBSCRIBE)
  }

  return (
    <View>
      {canMakeDeckPastFreeLimit() ? (
        <CustomModal
          header={"New deck"}
          body={"Choose a title for your new deck"}
          secondaryAction={() => closeModal()}
          mainAction={() => confirmAddNewDeck(deckTitle)}
          children={
            <View>
              {error ? (
                <CustomText
                  preset="caption1Strong"
                  style={{ color: theme.colors.dangerForeground1 }}
                >
                  {error}
                </CustomText>
              ) : null}
              <TextField
                placeholder="Title"
                value={deckTitle}
                onChangeText={setDeckTitle}
              ></TextField>
            </View>
          }
          visible={visible}
        />
      ) : (
        <CustomModal
          header={"Deck limit reached"}
          body={"Subscribe to add more decks"}
          secondaryAction={() => closeModal()}
          mainActionLabel={"Subscribe"}
          mainAction={() => goToSubscribe()}
          visible={visible}
        />
      )}
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
