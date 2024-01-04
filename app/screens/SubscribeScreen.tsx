import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import {
  BottomMainAction,
  Button,
  Card,
  CustomModal,
  Icon,
  LineWord,
  Loading,
  Screen,
  Text,
  TextField,
} from "../components"
import { custom_colors, spacing, typography } from "app/theme"
import { CustomText } from "app/components/CustomText"
import {
  CardField,
  PlatformPay,
  PlatformPayButton,
  initPaymentSheet,
  usePlatformPay,
  useStripe,
} from "@stripe/stripe-react-native"
import { useStores } from "../models/helpers/useStores"
import { borderRadius } from "app/theme/borderRadius"
import { LinearGradient } from "expo-linear-gradient"
import { showErrorToast, showSuccessToast } from "app/utils/errorUtils"
import { supabase } from "app/services/supabase/supabase"
import {
  getProducts,
  processProductPayment,
  processSubscriptionPayment,
} from "app/utils/subscriptionUtils"
import { isAfter } from "date-fns"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Subscribe: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Subscribe" component={SubscribeScreen} />`
// Hint: Look for the 🔥!
export const HAS_SUBSCRIPTION_TITLE = "You currently have an active subscription"
// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const SubscribeScreen: FC<StackScreenProps<AppStackScreenProps, "Subscribe">> = observer(
  function SubscribeScreen() {
    const { subscriptionStore, settingsStore } = useStores()
    const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay()
    const [loading, setLoading] = useState(false)
    const [endModalVisible, setEndModalVisible] = useState(false)
    const [restartModalVisible, setRestartModalVisible] = useState(false)

    useEffect(() => {
      const getGooglePaySupport = async () => {
        if (!(await isPlatformPaySupported())) {
          showErrorToast("Payment error occurred")
          return
        }
      }
      getGooglePaySupport()
    }, [])

    useEffect(() => {
      const getSubscription = async () => {
        setLoading(true)
        const res = await subscriptionStore.getSubscription()
        setLoading(false)
      }
      getSubscription()
    }, [])

    const fetchSubscriptionPaymentSheet = async (subId: string) => {
      const user = await supabase.auth.getUser()
      const res = await processProductPayment(`sub_${subId}`, user.data.user.id)

      return {
        paymentIntent: res.paymentIntent,
        ephemeralKey: res.ephemeralKey,
        customer: res.customer,
      }
    }

    const fetchSubscriptionMonthlyPaymentSheet = async () => {
      const user = await supabase.auth.getUser()
      const res = await processSubscriptionPayment(user.data.user.id)

      return {
        paymentIntent: res.paymentIntent,
        ephemeralKey: res.ephemeralKey,
        customer: res.customer,
      }
    }

    const endSubscription = async () => {
      if (settingsStore?.isOffline) {
        showErrorToast("Currently offline", "Go online to cancel your subscription")
        return
      }
      setLoading(true)
      if (subscriptionStore?.subscription?.subscription_id) {
        const res = await subscriptionStore.subscription.cancelSubscription()
        if (!res) {
          showErrorToast("Error occured when trying to cancel subscription")
        }
        //TODO add a response for the cancel subscription ->  it can only be the main subscrition cancel
      } else {
        showErrorToast("Error occured when trying to cancel subscription")
      }
      setLoading(false)
    }

    const reactivateSubscription = async () => {
      if (settingsStore?.isOffline) {
        showErrorToast("Currently offline", "Go online to reactivate your subscription")
        return
      }
      setLoading(true)
      if (subscriptionStore?.subscription?.subscription_id) {
        const res = await subscriptionStore.subscription.resumeSubscription()
        if (!res) {
          showErrorToast("Error occured when trying to resume subscription")
        }
      } else {
        console.log("could not resume because no id")
      }
      setLoading(false)
    }

    const initializeSubscriptionPaymentSheet = async () => {
      if (settingsStore?.isOffline) {
        showErrorToast("Currently offline", "Go online to subscribe")
        return
      }
      setLoading(true)
      const {
        paymentIntent: paymentInput,
        ephemeralKey,
        customer,
      } = await fetchSubscriptionMonthlyPaymentSheet()
      const { paymentIntent, error } = await confirmPlatformPayPayment(paymentInput, {
        googlePay: {
          testEnv: true,
          merchantName: "SpacedMemo",
          merchantCountryCode: "US",
          currencyCode: "USD",
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      })
      if (paymentIntent?.status == "Succeeded") {
        subscriptionStore.getSubscription()
      }
      setLoading(false)
    }

    const initializePaymentSheet = async (subLength: string) => {
      if (settingsStore?.isOffline) {
        showErrorToast("Currently offline", "Go online to subscribe")
        return
      }
      setLoading(true)
      const {
        paymentIntent: paymentIntentInput,
        ephemeralKey,
        customer,
      } = await fetchSubscriptionPaymentSheet(subLength)
      const { paymentIntent, error } = await confirmPlatformPayPayment(paymentIntentInput, {
        googlePay: {
          testEnv: true,
          merchantName: "SpacedMemo",
          merchantCountryCode: "US",
          currencyCode: "USD",
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
        },
      })
      if (paymentIntent?.status == "Succeeded") {
        subscriptionStore.getSubscription()
      }
      setLoading(false)
    }

    const FeatureListItem = (props) => {
      const { title, description, icon } = props
      return (
        <View style={{ marginBottom: spacing.size200 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.size40 }}
          >
            <Icon icon={icon} size={20} style={{ marginRight: spacing.size80 }}></Icon>
            <CustomText preset="body2Strong">{title}</CustomText>
          </View>
          <CustomText preset="body2">{description}</CustomText>
        </View>
      )
    }

    const SubscriptionFeaturesList = () => {
      return (
        <View>
          <FeatureListItem
            icon="fluent_lightbulb"
            title={"More decks"}
            description={
              "Key track of more topics by increasing the number of decks you have up to 25."
            }
          ></FeatureListItem>

          <FeatureListItem
            icon="fluent_diamond"
            title={"Many more cards"}
            description={
              "Get access to all the premade flashcards. An additional 1400 need to know SAT words and 700 most frequent words for language learners."
            }
          ></FeatureListItem>

          <FeatureListItem
            icon="robot"
            title={"More AI flashcards"}
            description={
              "Increase the limit for creating flashcards using AI from 50 per month to 1000 per month. Quickly make custom decks using AI."
            }
          ></FeatureListItem>
        </View>
      )
    }

    return (
      <Screen style={$root} contentContainerStyle={{ flexGrow: 1 }} preset="scroll">
        {loading && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
            <Loading></Loading>
          </View>
        )}

        {!subscriptionStore?.hasActiveSubscription() ? (
          <View style={$container}>
            <SubscriptionFeaturesList></SubscriptionFeaturesList>
            <CustomText preset="title3" style={{ marginBottom: spacing.size40 }}>
              Select plan below
            </CustomText>
            <CustomText style={{ marginBottom: spacing.size160 }}>
              Cancel anytime, no fees, simple and hassle free
            </CustomText>
            <Card
              disabled={loading}
              onPress={() => initializeSubscriptionPaymentSheet()}
              style={{
                marginBottom: spacing.size160,
                elevation: 0,
                minHeight: 0,
                paddingHorizontal: spacing.size200,
                paddingVertical: spacing.size120,
              }}
              ContentComponent={
                <View>
                  <CustomText preset="body2Strong">Subscription plan</CustomText>
                  <CustomText preset="body1">$4.99 per month</CustomText>
                </View>
              }
            ></Card>

            <LineWord text="Or save with a plan"></LineWord>
            <Card
              onPress={() => initializePaymentSheet("6")}
              style={{
                marginBottom: spacing.size160,
                elevation: 0,
                minHeight: 0,
                paddingHorizontal: spacing.size200,
                paddingVertical: spacing.size120,
              }}
              ContentComponent={
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <CustomText preset="body2Strong">6 month subscription</CustomText>
                    <CustomText preset="body1">$26.99</CustomText>
                  </View>
                  <View
                    style={{
                      backgroundColor: custom_colors.brandBackground1,
                      paddingHorizontal: spacing.size100,
                      paddingVertical: spacing.size40,
                      borderRadius: borderRadius.corner80,
                      transform: [{ rotate: "20deg" }],
                      position: "absolute",
                      top: -16,
                      right: -30,
                      elevation: 2,
                    }}
                  >
                    <CustomText preset="body2Strong" style={{ color: custom_colors.background1 }}>
                      -10%
                    </CustomText>
                  </View>
                </View>
              }
            ></Card>
            <Card
              onPress={() => initializePaymentSheet("12")}
              style={{
                marginBottom: spacing.size160,
                paddingVertical: spacing.size120,
                elevation: 0,
                minHeight: 0,
                paddingHorizontal: spacing.size200,
              }}
              ContentComponent={
                <View>
                  <CustomText preset="body2Strong">12 month subscription</CustomText>
                  <CustomText preset="body1">$44.99</CustomText>
                  <View
                    style={{
                      backgroundColor: custom_colors.brandBackground1,
                      paddingHorizontal: spacing.size100,
                      paddingVertical: spacing.size40,
                      borderRadius: borderRadius.corner80,
                      transform: [{ rotate: "20deg" }],
                      elevation: 2,
                      position: "absolute",
                      top: -16,
                      right: -30,
                    }}
                  >
                    <CustomText preset="body1Strong" style={{ color: custom_colors.background1 }}>
                      -25%
                    </CustomText>
                  </View>
                </View>
              }
            ></Card>
          </View>
        ) : (
          <View style={$container}>
            {!subscriptionStore?.subscription.cancel_at_end ? (
              <CustomText
                preset="title1"
                style={{ marginBottom: spacing.size200, fontFamily: typography.primary.light }}
              >
                {HAS_SUBSCRIPTION_TITLE}
              </CustomText>
            ) : (
              <CustomText
                preset="title1"
                style={{ marginBottom: spacing.size200, fontFamily: typography.primary.light }}
              >
                Your subscription has been canceled and will end on{" "}
                {subscriptionStore.subscription.end_date.toDateString()}.
              </CustomText>
            )}

            {!subscriptionStore.isSubscribed && (
              <View>
                <CustomText preset="body1" style={{ marginBottom: spacing.size40 }}>
                  Your subcription will end on
                </CustomText>
                <CustomText preset="body1Strong" style={{ marginBottom: spacing.size200 }}>
                  {subscriptionStore?.subscription?.end_date?.toDateString()}
                </CustomText>
              </View>
            )}
            <SubscriptionFeaturesList></SubscriptionFeaturesList>
            {subscriptionStore.isSubscribed && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  left: 0,
                }}
              >
                <BottomMainAction
                  onPress={
                    subscriptionStore?.subscription?.cancel_at_end
                      ? () => setRestartModalVisible(true)
                      : () => setEndModalVisible(true)
                  }
                  label={
                    subscriptionStore?.subscription?.cancel_at_end
                      ? "Reactivate subscription"
                      : "End subscription"
                  }
                ></BottomMainAction>
              </View>
            )}
            <CustomModal
              header={"End subscription"}
              body={`End your current subscription? You subscription will end on ${subscriptionStore?.subscription?.end_date?.toDateString()}`}
              secondaryAction={() => setEndModalVisible(false)}
              mainAction={() => {
                endSubscription()
                setEndModalVisible(false)
              }}
              mainActionLabel={"End subscription"}
              visible={endModalVisible}
            />
            <CustomModal
              header={"Restart subscription"}
              body={
                "Would you like to restart your subscription? Your subscription will continue and you will be rebilled at the end of the current subscription period."
              }
              secondaryAction={() => setRestartModalVisible(false)}
              mainAction={() => {
                reactivateSubscription()
                setRestartModalVisible(false)
              }}
              mainActionLabel={"Restart"}
              visible={restartModalVisible}
            />
          </View>
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
  flex: 1,
}
