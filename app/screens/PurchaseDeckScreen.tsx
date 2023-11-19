import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps, navigate } from "app/navigators"
import { Button, CustomModal, CustomText, FlashcardListItem, Screen, Text } from "app/components"
import { custom_colors, custom_palette, spacing, typography } from "app/theme"

import { getGlobalDeckById } from "app/utils/globalDecksUtils"
import { FlatList } from "react-native-gesture-handler"
import { importPaidGlobalCards } from "app/utils/globalDecksUtils"
import { useStores } from "../models/helpers/useStores"
import { supabase } from "app/services/supabase/supabase"
import {
  PlatformPay,
  PlatformPayButton,
  confirmPlatformPayPayment,
} from "@stripe/stripe-react-native"
import {
  getPaidFlashcardsCountByDeckId,
  getPaidFlashcardsPreview,
  processProductPayment,
} from "app/utils/subscriptionUtils"
import { Deck, DeckSnapshotIn, Flashcard, FlashcardSnapshotIn } from "app/models"
import { updateDeck } from "app/utils/deckUtils"
import { useNavigation } from "@react-navigation/native"
import { AppRoutes } from "app/utils/consts"

interface PurchaseDeckScreenProps
  extends NativeStackScreenProps<AppStackScreenProps<"PurchaseDeck">> {}

export const PurchaseDeckScreen: FC<PurchaseDeckScreenProps> = observer(
  function PurchaseDeckScreen() {
    const { deckStore, subscriptionStore } = useStores()
    const [paidCardsPreview, setPaidCardsPreview] = useState([])
    const [paidCardsCount, setPaidCardsCount] = useState<number>(0)
    const selectedDeck = deckStore?.selectedDeck
    const globalDeckId = selectedDeck?.global_deck_id
    const [importPurchasedDeckVisible, setImportPurchasedDeckVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    useEffect(() => {
      const setPurchasabeDeck = async () => {
        const paidCount = await getPaidFlashcardsCountByDeckId(globalDeckId)
        setPaidCardsCount(paidCount)
        const previewRes = await getPaidFlashcardsPreview(globalDeckId)
        setPaidCardsPreview(previewRes)
      }
      if (globalDeckId) {
        setPurchasabeDeck()
      }
    }, [globalDeckId])

    const getPaidGlobalFlashcards = async () => {
      importPaidGlobalCards(globalDeckId, deckStore.selectedDeck)
      setImportPurchasedDeckVisible(false)
    }

    return (
      <Screen style={$root}>
        <View style={$container}>
          <CustomText
            preset="title1"
            style={{ marginBottom: spacing.size40, fontFamily: typography.primary.light }}
          >
            Get even more premium cards
          </CustomText>
          <CustomText style={{ marginBottom: spacing.size120 }} preset="caption1">
            Subscribe to get access to these cards.
          </CustomText>
          <CustomText style={{ marginBottom: spacing.size40 }} preset="body1">
            {paidCardsCount.toString()} more cards available!
          </CustomText>
          <CustomText style={{ marginBottom: spacing.size80 }} preset="caption1">
            Heres a look at some of the words you'll get
          </CustomText>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={paidCardsPreview}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <View style={{ paddingVertical: spacing.size120 }}>
                <CustomText preset="body1Strong">
                  and {(paidCardsCount - paidCardsPreview?.length).toString()} more...
                </CustomText>
              </View>
            }
            renderItem={({ item }) => {
              return (
                <View key={item.id}>
                  <FlashcardListItem flashcard={item}></FlashcardListItem>
                </View>
              )
            }}
          ></FlatList>

          <CustomModal
            header={"Import deck"}
            body={"Import the cards into the current deck?"}
            secondaryAction={() => setImportPurchasedDeckVisible(false)}
            mainAction={() => getPaidGlobalFlashcards()}
            visible={importPurchasedDeckVisible}
          ></CustomModal>

          {!subscriptionStore.hasActiveSubscription() ? (
            <Button
              preset="custom_default"
              onPress={() => navigation.navigate(AppRoutes.SUBSCRIBE)}
            >
              Go to subscription
            </Button>
          ) : (
            <Button onPress={() => setImportPurchasedDeckVisible(true)} preset="custom_default">
              Import
            </Button>
          )}
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
