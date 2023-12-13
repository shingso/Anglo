import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps, navigate } from "app/navigators"
import {
  BOTTOM_ACTION_HEIGHT,
  BottomMainAction,
  Button,
  CustomModal,
  CustomText,
  FlashcardListItem,
  Loading,
  Screen,
  Text,
} from "app/components"
import { custom_colors, custom_palette, spacing, typography } from "app/theme"
import { FlashList } from "@shopify/flash-list"

import { importPaidGlobalCards } from "app/utils/globalDecksUtils"
import { useStores } from "../models/helpers/useStores"

import {
  getPaidFlashcardsCountByDeckId,
  getPaidFlashcardsPreview,
} from "app/utils/subscriptionUtils"

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
        setLoading(true)
        const paidCount = await getPaidFlashcardsCountByDeckId(globalDeckId)
        setPaidCardsCount(paidCount)
        const previewRes = await getPaidFlashcardsPreview(globalDeckId)
        setPaidCardsPreview(previewRes)
        setLoading(false)
      }
      if (globalDeckId) {
        setPurchasabeDeck()
      }
    }, [globalDeckId])

    const getPaidGlobalFlashcards = async () => {
      importPaidGlobalCards(globalDeckId, deckStore.selectedDeck)
      setImportPurchasedDeckVisible(false)
      navigation.navigate(AppRoutes.DECK_HOME)
    }

    return (
      <Screen style={$root}>
        <View style={$container}>
          {loading ? (
            <View
              style={{
                zIndex: 1,
                position: "absolute",
                top: 0,
                bottom: 0,
                right: -spacing.size160,
                left: -spacing.size160,
              }}
            >
              <Loading></Loading>
            </View>
          ) : (
            <View style={{ height: "100%" }}>
              <CustomText
                preset="title1"
                style={{ marginBottom: spacing.size40, fontFamily: typography.primary.light }}
              >
                Get even more premium cards
              </CustomText>

              {!subscriptionStore.hasActiveSubscription() && (
                <CustomText style={{ marginBottom: spacing.size120 }} preset="caption1">
                  Subscribe to get access to these cards.
                </CustomText>
              )}
              <CustomText style={{ marginBottom: spacing.size40 }} preset="body1">
                {paidCardsCount.toString()} more cards available!
              </CustomText>
              <CustomText style={{ marginBottom: spacing.size80 }} preset="caption1">
                Heres a look at some of the words you'll get
              </CustomText>
              <FlashList
                showsVerticalScrollIndicator={false}
                data={paidCardsPreview}
                estimatedItemSize={47}
                contentContainerStyle={{ paddingBottom: BOTTOM_ACTION_HEIGHT }}
                keyExtractor={(item) => item.id}
                ListFooterComponent={
                  <View style={{ paddingVertical: spacing.size120 }}>
                    <CustomText preset="body1Strong">
                      and {(paidCardsCount - paidCardsPreview?.length).toString()} more...
                    </CustomText>
                  </View>
                }
                renderItem={({ item }) => {
                  return <FlashcardListItem flashcard={item}></FlashcardListItem>
                }}
              ></FlashList>
            </View>
          )}
        </View>

        <CustomModal
          header={"Import deck"}
          body={"Import the cards into the current deck?"}
          secondaryAction={() => setImportPurchasedDeckVisible(false)}
          mainAction={() => getPaidGlobalFlashcards()}
          visible={importPurchasedDeckVisible}
        ></CustomModal>
        {!loading && (
          <BottomMainAction
            label={subscriptionStore.hasActiveSubscription() ? "Import" : "Go to subscription"}
            disabled={false}
            onPress={
              subscriptionStore.hasActiveSubscription()
                ? () => setImportPurchasedDeckVisible(true)
                : () => navigation.navigate(AppRoutes.SUBSCRIBE)
            }
          ></BottomMainAction>
        )}
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
