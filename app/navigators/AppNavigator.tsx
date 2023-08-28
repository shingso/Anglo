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
  GlobalDecksScreen,
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
  UserGlobalDecksScreen,
  UserGlobalDeckEditScreen,
  TutorialScreen,
  FreeStudyScreen,
  FreeStudySessionScreen,
  DeckHomeScreen,
} from "../screens"
import { supabase } from "../services/supabase/supabase"
import { custom_colors, custom_palette, spacing, typography } from "../theme"
import { navigate, navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useNavigation } from "@react-navigation/native"
import { Button, CustomModal, CustomText, DeckHome, Header, Text, TextField } from "../components"
import { Deck, useStores } from "../models"
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native"
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"
import merge from "deepmerge"
import { Provider as PaperProvider } from "react-native-paper"
import { adaptNavigationTheme } from "react-native-paper"
import { useNetInfo } from "@react-native-community/netinfo"
import Toast from "react-native-toast-message"
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer"
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
          return (
            <Header
              leftIcon="caretLeft"
              title={props?.options?.title}
              onLeftPress={() => props.navigation.goBack()}
            ></Header>
          )
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
        options={{ title: "User Setup" }}
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
          return (
            <Header
              leftIcon="caretLeft"
              title={props?.options?.title}
              onLeftPress={() => props.navigation.goBack()}
            ></Header>
          )
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
      headerTitleAlign: "center",
      headerTitleStyle: { fontSize: 18, fontFamily: typography.primary.bold },
      header: (props) => {
        return <Header leftIcon="caretLeft" onLeftPress={() => props.navigation.goBack()}></Header>
      },
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
              leftIcon="caretLeft"
              onLeftPress={() => props.navigation.goBack()}
            ></Header>
          )
        },
      }}
    >
      <Drawer.Screen name={AppRoutes.HOME} component={DrawerHome} />
      <Stack.Screen
        options={{
          headerShown: true,
        }}
        name={AppRoutes.SETTINGS}
        component={SettingsScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
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
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name={AppRoutes.FLASHCARD_LIST}
        component={FlashcardListScreen}
      />

      <Stack.Screen
        name={AppRoutes.DECK_SETTINGS}
        options={{
          headerShown: false,
        }}
        component={DeckSettingsScreen}
      />
      <Stack.Screen name={AppRoutes.GLOBAL_DECKS} component={GlobalDecksScreen} />
      <Stack.Screen
        name={AppRoutes.DECK_ADD}
        options={{
          headerShown: true,
        }}
        component={DeckAddScreen}
      />
      <Stack.Screen
        name={AppRoutes.ABOUT_STACK}
        options={{
          headerShown: false,
        }}
        component={AboutStackScreens}
      />
      <Stack.Screen
        name={AppRoutes.DECK_HOME}
        options={{
          headerShown: false,
        }}
        component={DeckHomeScreen}
      />
      <Stack.Screen
        name={AppRoutes.SUBSCRIBE}
        options={{
          headerShown: true,
          headerTitle: "Smarter",
        }}
        component={SubscribeScreen}
      />
      <Stack.Screen
        name={AppRoutes.USER_GLOBAL_DECKS}
        options={{
          headerShown: true,
          headerTitle: "Your Public Decks",
        }}
        component={UserGlobalDecksScreen}
      />
      <Stack.Screen
        name={AppRoutes.USER_GLOBAL_DECKS_EDIT}
        options={{
          headerShown: false,
          title: "Global Deck Edit",
        }}
        component={UserGlobalDeckEditScreen}
      />
      <Stack.Screen
        name={AppRoutes.PURCHASE_DECK}
        options={{
          headerShown: true,
        }}
        component={PurchaseDeckScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.GLOBAL_FLASHCARDS}
        component={GlobalFlashcardsScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.GLOBAL_CONFLICT}
        component={GlobalConflictScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.PROGRESS_CONFLICT}
        component={ProgressConflictScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.SESSION}
        component={SessionScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={AppRoutes.FREE_STUDY_SESSION}
        component={FreeStudySessionScreen}
      />
    </Stack.Navigator>
  )
}

const AppStack = observer(function AppStack() {
  const netInfo = useNetInfo()
  const { deckStore } = useStores()
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!netInfo.isConnected && netInfo.isConnected !== null) {
      Toast.show({
        type: "error",
        text1: "No internet connection found.",
        topOffset: 80,
      })
    }
  }, [netInfo])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === "PASSWORD_RECOVERY") {
        // redirect user to the page where it creates a new password
        // we need to do something here
        console.log("WE ARE IN PASS RECOV")
      }

      if (_event === "SIGNED_IN") {
        console.log("we are signing in")
        deckStore.getDecks()
      }
      setSession(session)
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return session ? HomeScreens() : LoginStackScreens()
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { settingsStore } = useStores()
  const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  })
  const CombinedDefaultTheme = merge(MD3DarkTheme, LightTheme)
  const CombinedDarkTheme = merge(MD3LightTheme, DarkTheme)
  const [currentTheme, setCurrentTheme] = useState(
    settingsStore.isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme,
  )
  useEffect(() => {
    setCurrentTheme(settingsStore.isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme)
  }, [settingsStore.isDarkMode])

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <PaperProvider theme={currentTheme}>
      <NavigationContainer
        ref={navigationRef}
        theme={settingsStore.isDarkMode ? DarkTheme : DefaultTheme}
        {...props}
      >
        <AppStack />
      </NavigationContainer>
    </PaperProvider>
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
