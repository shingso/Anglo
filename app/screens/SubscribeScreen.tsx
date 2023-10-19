import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, Card, Icon, LineWord, Loading, Screen, Text } from "../components"
import { custom_colors, spacing } from "app/theme"
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
  cancelSubscription,
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

    useEffect(() => {
      const getGooglePaySupport = async () => {
        const res = await getProducts()
        if (!(await isPlatformPaySupported())) {
          showErrorToast("Google pay error")
          return
        } else {
          //showSuccessToast("Google pay supported")
        }
      }
      getGooglePaySupport()
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
      if (subscriptionStore?.subscription?.subscription_id) {
        const res = await subscriptionStore.subscription.cancelSubscription()
        if (!res) {
          showErrorToast("Error occured when trying to cancel subscription")
        }
        //TODO add a response for the cancel subscription ->  it can only be the main subscrition cancel
      } else {
        console.log("could not end because no id")
      }
    }

    const reactivateSubscription = async () => {
      if (settingsStore?.isOffline) {
        showErrorToast("Currently offline", "Go online to reactivate your subscription")
        return
      }
      if (subscriptionStore?.subscription?.subscription_id) {
        const res = await subscriptionStore.subscription.resumeSubscription()
        if (!res) {
          showErrorToast("Error occured when trying to resume subscription")
        }
      } else {
        console.log("could not resume because no id")
      }
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
      if (paymentIntent?.status == "Succeeded") {
        subscriptionStore.getSubscription()
      }
      setLoading(false)
    }

    const SubscriptionFeaturesList = () => {
      return (
        <View>
          <View style={{ marginBottom: spacing.size200 }}>
            {/*          <Icon icon="fluent_redo" size={24} style={{ marginRight: spacing.size80 }}></Icon> */}
            <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
              Unlimited deck size
            </CustomText>
            <CustomText preset="caption1">
              Keep track of as many topics as want with unlimited deck space.
            </CustomText>
          </View>

          <View style={{ marginBottom: spacing.size200 }}>
            {/*          <Icon icon="fluent_redo" size={24} style={{ marginRight: spacing.size80 }}></Icon> */}
            <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
              Customizable sound settings
            </CustomText>
            <CustomText preset="caption1">
              Play the back, extra sentence, or a combination of sounds in different languages.
            </CustomText>
          </View>

          <View style={{ marginBottom: spacing.size200 }}>
            {/*          <Icon icon="fluent_redo" size={24} style={{ marginRight: spacing.size80 }}></Icon> */}
            <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
              AI Flashcards
            </CustomText>
            <CustomText preset="caption1">Autogenerate flashcards using AI</CustomText>
          </View>
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
            <CustomText style={{ marginBottom: spacing.size160 }}>
              Cancel anytime, no fees, simple and hassle free
            </CustomText>
            <SubscriptionFeaturesList></SubscriptionFeaturesList>
            <Card
              disabled={loading}
              onPress={() => initializeSubscriptionPaymentSheet()}
              style={{
                marginBottom: spacing.size160,
                elevation: 4,
                minHeight: 0,
                paddingHorizontal: spacing.size200,
                paddingVertical: spacing.size120,
              }}
              ContentComponent={
                <View>
                  <CustomText preset="body2Strong">Subscription plan</CustomText>
                  <CustomText preset="body1">$3.99 per month</CustomText>
                </View>
              }
            ></Card>

            <LineWord text="Or save with a plan"></LineWord>
            <Card
              onPress={() => initializePaymentSheet("6")}
              style={{
                marginBottom: spacing.size160,
                elevation: 4,
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
                    <CustomText preset="body1">$19.95</CustomText>
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
                      -20%
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
                elevation: 4,
                minHeight: 0,
                paddingHorizontal: spacing.size200,
              }}
              ContentComponent={
                <View>
                  <CustomText preset="body2Strong">12 month subscription</CustomText>
                  <CustomText preset="body1">$29.99</CustomText>
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
                      -45%
                    </CustomText>
                  </View>
                </View>
              }
            ></Card>

            {/*    <PlatformPayButtonc
            type={PlatformPay.ButtonType.Pay}
            onPress={() => initializePaymentSheet()}
            style={{
              width: "100%",
              height: 50,
            }}
          /> */}
          </View>
        ) : (
          <View style={$container}>
            <CustomText preset="title2" style={{ marginBottom: spacing.size200 }}>
              {HAS_SUBSCRIPTION_TITLE}
            </CustomText>

            {subscriptionStore.subscription.cancel_at_end && (
              <CustomText preset="body1" style={{ marginBottom: spacing.size200 }}>
                You subscription has been canceled, you will continue to have subscription benefits
                till the end of the current period.
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
              <View>
                {!subscriptionStore.subscription.cancel_at_end ? (
                  <Card
                    onPress={() => endSubscription()}
                    style={{
                      marginBottom: spacing.size160,
                      elevation: 4,
                      minHeight: 0,
                      paddingHorizontal: spacing.size200,
                      paddingVertical: spacing.size120,
                    }}
                    ContentComponent={
                      <CustomText preset="body2Strong">Cancel Subscription</CustomText>
                    }
                  ></Card>
                ) : (
                  <Card
                    onPress={() => reactivateSubscription()}
                    style={{
                      marginBottom: spacing.size160,
                      elevation: 4,
                      minHeight: 0,
                      paddingHorizontal: spacing.size200,
                      paddingVertical: spacing.size120,
                    }}
                    ContentComponent={
                      <CustomText preset="body2Strong">Reactive subscription</CustomText>
                    }
                  ></Card>
                )}
              </View>
            )}
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
}
