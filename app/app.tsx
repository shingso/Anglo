/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useEffect, useRef, useState } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { useInitialRootStore, useStores } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import {
  colors,
  customFontsToLoad,
  custom_colors,
  custom_palette,
  darkTheme,
  lightTheme,
  spacing,
  typography,
} from "./theme"
import { setupReactotron } from "./services/reactotron"
import Config from "./config"
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { View, ViewStyle } from "react-native"
import { borderRadius } from "./theme/borderRadius"
import { CustomText, Icon } from "./components"
import { StripeProvider } from "@stripe/stripe-react-native"
import * as NavigationBar from "expo-navigation-bar"

NavigationBar.setPositionAsync("absolute")

// Set up Reactotron, which is a free desktop app for inspecting and debugging
// React Native apps. Learn more here: https://github.com/infinitered/reactotron
setupReactotron({
  // clear the Reactotron window when the app loads/reloads
  clearOnLoad: true,
  // generally going to be localhost
  host: "localhost",
  // Reactotron can monitor AsyncStorage for you
  useAsyncStorage: true,
  // log the initial restored state from AsyncStorage
  logInitialState: true,
  // log out any snapshots as they happen (this is useful for debugging but slow)
  logSnapshots: false,
})

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    Sign_Up: "Sign_Up",
    Password_Reset: {
      path: "password_reset",
    },
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  Linking.getInitialURL().then((initialUrl) => {
    if (initialUrl) Linking.openURL(initialUrl)
  })

  const [areFontsLoaded] = useFonts(customFontsToLoad)
  const { deckStore, settingsStore } = useStores()
  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.

    deckStore.removeSelectedDeck()
    setTimeout(hideSplashScreen, 500)
  })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  const DefaultToastBody = (props) => {
    const { text1, text2 } = props
    return (
      <View style={{ paddingRight: spacing.size200 }}>
        {text1 && !text2 && (
          <CustomText style={{ color: custom_palette.white }} preset="body2">
            {text1}
          </CustomText>
        )}
        {text1 && text2 && (
          <View>
            <CustomText style={{ color: custom_palette.white }} preset="body2Strong">
              {text1}
            </CustomText>
            <CustomText style={{ color: custom_palette.white }} preset="caption1">
              {text2}
            </CustomText>
          </View>
        )}
      </View>
    )
  }

  const toastConfig = {
    default: (props) => (
      <View style={$custom_toast}>
        <DefaultToastBody text1={props.text1} text2={props.text2}></DefaultToastBody>
      </View>
    ),
    success: (props) => (
      <View style={[$custom_toast, $success_toast]}>
        <DefaultToastBody text1={props.text1} text2={props.text2}></DefaultToastBody>
      </View>
    ),
    error: (props) => (
      <View style={[$custom_toast, $error_toast]}>
        <DefaultToastBody text1={props.text1} text2={props.text2}></DefaultToastBody>
      </View>
    ),
  }

  // otherwise, we're ready to render the app
  return (
    <>
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: settingsStore.isDarkMode
            ? darkTheme.colors.canvas
            : lightTheme.colors.canvas,
        }}
      >
        <StripeProvider
          publishableKey={Config.STRIPE_API_PK}
          //TODO stripe settings
          merchantIdentifier="merchant.com.spacedmemo"
          //urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <ErrorBoundary catchErrors={Config.catchErrors}>
              <AppNavigator
                linking={linking}
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
              />
            </ErrorBoundary>
          </SafeAreaProvider>
        </StripeProvider>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </>
  )
}

export default App

const $custom_toast: ViewStyle = {
  width: "90%",
  paddingHorizontal: spacing.size240,
  paddingVertical: spacing.size160,
  borderRadius: borderRadius.corner120,
  backgroundColor: custom_colors.brandBackground2,
  elevation: 2,
  //borderWidth: 0.5,
  //borderColor: custom_colors.background6,
  flexDirection: "row",
  alignItems: "center",
}

const $error_toast: ViewStyle = {
  //backgroundColor: custom_colors.dangerBackground1,
  backgroundColor: custom_palette.red20,
}

const $success_toast: ViewStyle = {
  borderRadius: borderRadius.corner120,
  backgroundColor: custom_colors.brandBackground2,
}
