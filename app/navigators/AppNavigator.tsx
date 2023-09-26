/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { StatusBar, TextStyle, Touchable, useColorScheme, View, ViewStyle } from "react-native"
import { Icon } from "../components/Icon"
import { CustomDrawer } from "../components/CustomDrawer"
import Config from "../config"
import {
  AboutScreen,
  DeckAddScreen,
  DeckSettingsScreen,
  FlashcardListScreen,
  ForgotPasswordScreen,
  GlobalConflictScreen,
  GlobalFlashcardsScreen,
  HomeScreen,
  LoginScreen,
  OpenSourceScreen,
  ProgressConflictScreen,
  PurchaseDeckScreen,
  ResetPasswordScreen,
  SessionScreen,
  SettingsScreen,
  SignUpScreen,
  SubscribeScreen,
  TermsOfServiceScreen,
  UserSetupScreen,
  TutorialScreen,
  FreeStudyScreen,
  FreeStudySessionScreen,
  DeckHomeScreen,
  GlobalDecksScreen,
} from "../screens"
import { supabase } from "../services/supabase/supabase"
import { custom_colors, custom_palette, darkTheme, lightTheme, spacing, typography } from "../theme"
import { navigate, navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useNavigation } from "@react-navigation/native"
import { Button, CustomModal, CustomText, DeckHome, Header, Text, TextField } from "../components"
import { Deck, RootStoreModel, functionsMap, useStores } from "../models"
import { useNetInfo } from "@react-native-community/netinfo"
import Toast from "react-native-toast-message"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { TouchableOpacity } from "react-native-gesture-handler"
import { AppRoutes, AppStackParamList, SCREEN_WIDTH } from "../utils/consts"
import { borderRadius } from "../theme/borderRadius"
import { PrivacyPolicyScreen } from "../screens/About/PrivacyPolicyScreen"
import { getPendingRemoteFunctions } from "../utils/remote_sync/remoteSyncUtils"
import { addDeck } from "../utils/deckUtils"
import * as Linking from "expo-linking"
import { StackScreenProps } from "@react-navigation/stack"
import { showErrorToast } from "app/utils/errorUtils"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */

const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
const TabStack = createBottomTabNavigator<AppStackParamList>()
const Drawer = createDrawerNavigator()

const LoginStackScreens = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          return <Header title={props?.options?.title}></Header>
        },
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.LOGIN}
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.SIGN_UP}
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{ title: "Password Reset" }}
        name={AppRoutes.PASSWORD_RESET}
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        options={{ title: "Password Reset" }}
        name={AppRoutes.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        options={{ title: "Terms of Service" }}
        name={AppRoutes.TERMS_OF_SERVICE}
        component={TermsOfServiceScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.USER_SETUP}
        component={UserSetupScreen}
      />
    </Stack.Navigator>
  )
}

const AboutStackScreens = () => {
  return (
    <Stack.Navigator
      initialRouteName={AppRoutes.ABOUT}
      screenOptions={{
        header: (props) => {
          return <Header title={props?.options?.title}></Header>
        },
      }}
    >
      <Stack.Screen
        name={AppRoutes.ABOUT}
        options={{
          headerShown: true,
          title: "About",
        }}
        component={AboutScreen}
      />
      <Stack.Screen
        name={AppRoutes.TERMS_OF_SERVICE}
        options={{
          headerShown: true,
          title: "Terms of Service",
        }}
        component={TermsOfServiceScreen}
      />
      <Stack.Screen
        name={AppRoutes.PRIVACY_POLICY}
        options={{
          headerShown: true,
          title: "Privacy Policy",
        }}
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name={AppRoutes.OPEN_SOURCE}
        options={{
          title: "Open Source Libraries",
          headerShown: true,
        }}
        component={OpenSourceScreen}
      />
    </Stack.Navigator>
  )
}

const DrawerHome = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer navigation={props.navigation}></CustomDrawer>}
    screenOptions={{
      headerShown: false,
      swipeEdgeWidth: 0,
    }}
  >
    <Drawer.Screen name={AppRoutes.DECKS} component={HomeScreen} />
  </Drawer.Navigator>
)

const HomeScreens = () => {
  return (
    <Stack.Navigator
      initialRouteName={AppRoutes.HOME}
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 18, fontFamily: typography.primary.bold },
        header: (props) => {
          return (
            <Header
              title={(props.options.headerTitle as string) ?? (props.route.name as string)}
              leftIcon="caret_left"
              onLeftPress={() => props.navigation.goBack()}
            ></Header>
          )
        },
      }}
    >
      <Drawer.Screen name={AppRoutes.HOME} component={DrawerHome} />
      <Stack.Screen name={AppRoutes.SETTINGS} component={SettingsScreen} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={AppRoutes.TUTORIAL}
        component={TutorialScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name={AppRoutes.FREE_STUDY}
        component={FreeStudyScreen}
      />
      <Stack.Screen name={AppRoutes.FLASHCARD_LIST} component={FlashcardListScreen} />

      <Stack.Screen name={AppRoutes.DECK_SETTINGS} component={DeckSettingsScreen} />
      <Stack.Screen name={AppRoutes.GLOBAL_DECKS} component={GlobalDecksScreen} />
      <Stack.Screen
        name={AppRoutes.DECK_ADD}
        options={{
          headerShown: true,
        }}
        component={DeckAddScreen}
      />
      <Stack.Screen name={AppRoutes.ABOUT_STACK} component={AboutStackScreens} />
      <Stack.Screen name={AppRoutes.DECK_HOME} component={DeckHomeScreen} />
      <Stack.Screen
        name={AppRoutes.SUBSCRIBE}
        options={{
          headerShown: true,
          headerTitle: "Smarter",
        }}
        component={SubscribeScreen}
      />

      <Stack.Screen
        name={AppRoutes.PURCHASE_DECK}
        options={{
          headerShown: true,
        }}
        component={PurchaseDeckScreen}
      />
      <Stack.Screen name={AppRoutes.GLOBAL_FLASHCARDS} component={GlobalFlashcardsScreen} />
      <Stack.Screen name={AppRoutes.GLOBAL_CONFLICT} component={GlobalConflictScreen} />
      <Stack.Screen name={AppRoutes.PROGRESS_CONFLICT} component={ProgressConflictScreen} />
      <Stack.Screen name={AppRoutes.SESSION} component={SessionScreen} />
      <Stack.Screen name={AppRoutes.FREE_STUDY_SESSION} component={FreeStudySessionScreen} />
    </Stack.Navigator>
  )
}

const AppStack = observer(function AppStack() {
  const netInfo = useNetInfo()
  const navigation = useNavigation()
  const { deckStore, settingsStore, authStore } = useStores()

  useEffect(() => {
    if (netInfo.isConnected === null) {
      return
    }

    settingsStore.setIsOffline(!netInfo.isConnected)

    if (!netInfo.isConnected) {
      Toast.show({
        type: "error",
        text1: "No internet connection found.",
        topOffset: 80,
      })
    }

    if (netInfo.isConnected) {
      deckStore?.decks?.forEach((deck) => {
        if (deck?.queuedQueries && deck?.queuedQueries?.length > 0) {
          deck.queuedQueries.forEach(async (query) => {
            let variables = undefined
            const func = functionsMap[query.function]
            if (query?.variables) {
              variables = JSON.parse(query.variables)
            }
            const res = await func(variables)
            if (res) {
              deck.removeFromQueries(query)
            }
          })
        }
      })
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        authStore.setAuthToken(session.access_token)
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        // redirect user to the page where it creates a new password
        // we need to do something here
        console.log("WE ARE IN PASS RECOV")
      }

      if (_event === "SIGNED_IN") {
        deckStore.getDecks()
      }

      if (session?.access_token) {
        authStore.setAuthToken(session.access_token)
      }
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return authStore?.authToken ? HomeScreens() : LoginStackScreens()
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { settingsStore } = useStores()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={settingsStore.isDarkMode ? darkTheme : lightTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})

const $deck_item: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.size120,
}

const $deck_selected_item: ViewStyle = {
  //backgroundColor: custom_colors.background6,
}

const $drawer_action: ViewStyle = {
  paddingVertical: spacing.size120,
}

const $action_item_container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
