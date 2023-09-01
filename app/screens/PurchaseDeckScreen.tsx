import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CustomText, FlashcardListItem, Screen, Text } from "app/components"
import { custom_colors, custom_palette, spacing } from "app/theme"

import { getGlobalDeckById } from "app/utils/globalDecksUtils"
import { FlatList } from "react-native-gesture-handler"
import { importPurchasedCards, insertFlashcardsAndReturn } from "app/utils/boughtDecksUtils"
import { useStores } from "../models/helpers/useStores"
import { supabase } from "app/services/supabase/supabase"
import {
  PlatformPay,
  PlatformPayButton,
  confirmPlatformPayPayment,
} from "@stripe/stripe-react-native"
import { processProductPayment } from "app/utils/subscriptionUtils"

interface PurchaseDeckScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"PurchaseDeck">> {}

export const PurchaseDeckScreen: FC<PurchaseDeckScreenProps> = observer(
  function PurchaseDeckScreen() {
    // Pull in one of our MST stores
    const { deckStore } = useStores()
    const [paidCards, setPaidCards] = useState([])

    useEffect(() => {
      const setPaidFlashcards = async () => {
        const cards = await getGlobalDeckById("29ff0039-6e9a-4d03-846e-330b14b51fea")
        const paidCard = cards?.global_flashcards?.filter((card) => !card.free)
        setPaidCards(paidCard)
      }
      setPaidFlashcards()
    }, [])

    const fetchPaymentSheetParamsBuyDeck = async (deckId: string) => {
      console.log("we are here")
      const user = await supabase.auth.getUser()

      const res = await processProductPayment(`deck_${deckId}`, user.data.user.id)
      console.log("res", res)

      return {
        paymentIntent: res.paymentIntent,
        ephemeralKey: res.ephemeralKey,
        customer: res.customer,
      }
    }

    const initializePaymentSheet = async () => {
      console.log("runnning!!@#@@#4")
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParamsBuyDeck(
        "29ff0039-6e9a-4d03-846e-330b14b51fea",
      )

      const { error } = await confirmPlatformPayPayment(paymentIntent, {
        googlePay: {
          testEnv: true,
          merchantName: "Anglo",
          merchantCountryCode: "US",
          currencyCode: "USD",
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      })

      console.log("error", error)
    }

    const getPaidGlobalFlashcards = async () => {
      //importPurchasedCards(deckStore.selectedDeck.id, "29ff0039-6e9a-4d03-846e-330b14b51fea")
      const addedFlashcards = await insertFlashcardsAndReturn(
        deckStore.selectedDeck.id,
        "29ff0039-6e9a-4d03-846e-330b14b51fea",
      )
      if (addedFlashcards && addedFlashcards?.length > 0) {
        deckStore.selectedDeck.addMutlipleFlashcards(addedFlashcards)
      }
    }

    return (
      <Screen style={$root}>
        <View style={$container}>
          <CustomText preset="title3">Get more premium cards</CustomText>
          <CustomText preset="body1">{paidCards?.length} cards</CustomText>
          <FlatList
            data={paidCards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View key={item.id}>
                  <FlashcardListItem flashcard={item}></FlashcardListItem>
                </View>
              )
            }}
          ></FlatList>
          <PlatformPayButton
            type={PlatformPay.ButtonType.Pay}
            onPress={() => initializePaymentSheet()}
            style={{
              width: "100%",
              height: 50,
            }}
          />
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
  height: "100%",
}
