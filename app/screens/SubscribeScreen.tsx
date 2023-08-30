import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, Card, Icon, LineWord, Screen, Text } from "../components"
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
  getProducts,
  processProductPayment,
  processSubscriptionPayment,
} from "app/utils/subscriptionUtils"

// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Subscribe: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Subscribe" component={SubscribeScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const SubscribeScreen: FC<StackScreenProps<AppStackScreenProps, "Subscribe">> = observer(
  function SubscribeScreen() {
    // Pull in navigation via hook
    // const navigation = useNavigation()
    const { confirmPayment, presentPaymentSheet } = useStripe()
    const { subscriptionStore } = useStores()
    const [products, setProducts] = useState([])

    const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay()

    useEffect(() => {
      const getGooglePaySupport = async () => {
        const res = await getProducts()
        if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
          showErrorToast("Google pay not supported")
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

    const initializeSubscriptionPaymentSheet = async () => {
      const { paymentIntent, ephemeralKey, customer } = await fetchSubscriptionMonthlyPaymentSheet()
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

    const initializePaymentSheet = async (subLength: string) => {
      const { paymentIntent, ephemeralKey, customer } = await fetchSubscriptionPaymentSheet(
        subLength,
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

    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          <View style={{ marginBottom: spacing.size200 }}>
            {/*          <Icon icon="fluent_redo" size={24} style={{ marginRight: spacing.size80 }}></Icon> */}
            <CustomText preset="body2Strong" style={{ marginBottom: spacing.size20 }}>
              Personalized learning algorithm
            </CustomText>
            <CustomText preset="caption1">
              AI algorithm will be continiously trained and updated with your information, creating
              a more personalized and efficient learning experience.
            </CustomText>
          </View>

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
              Insightful statistics
            </CustomText>
            <CustomText style={{ marginBottom: spacing.size320 }} preset="caption1">
              Visualize the progress you are making with comprehensive statistics.
            </CustomText>
          </View>
          <CustomText style={{ marginBottom: spacing.size160 }}>
            Cancel anytime, no fees, simple and hassle free
          </CustomText>
          <Card
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

          {/*    <PlatformPayButton
            type={PlatformPay.ButtonType.Pay}
            onPress={() => initializePaymentSheet()}
            style={{
              width: "100%",
              height: 50,
            }}
          /> */}
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
