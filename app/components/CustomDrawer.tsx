import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useStores } from "app/models"
import { supabase } from "app/services/supabase/supabase"
import { addDeck } from "app/utils/deckUtils"
import { getPendingRemoteFunctions } from "app/utils/remote_sync/remoteSyncUtils"
import { CustomText } from "./CustomText"
import { Icon } from "./Icon"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
import { CustomModal } from "./CustomModal"
import { TextField } from "./TextField"
import { StackNavigationProp } from "@react-navigation/stack"
import { useState } from "react"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types"
import { showErrorToast } from "app/utils/errorUtils"

export interface CustomDrawerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  navigation: DrawerNavigationHelpers
}

/**
 * Describe your component here
 */
export const CustomDrawer = observer(function CustomDrawer(props: CustomDrawerProps) {
  const { navigation } = props
  const { deckStore, subscriptionStore, authStore, settingsStore } = useStores()
  const [newDeckModalVisbile, setNewDeckModalVisible] = useState(false)
  const [deckLimitModalVisbile, setDeckLimitModalVisible] = useState(false)
  const [deckTitle, setDeckTitle] = useState("")
  const theme = useTheme()
  const selectDeck = (deck) => {
    deckStore.selectDeck(deck)
    navigation.navigate(AppRoutes.DECK_HOME)
    navigation.closeDrawer()
  }

  const freeLimitDeck = 2
  const canMakeDeckPastFreeLimit = (): boolean => {
    if (subscriptionStore.hasActiveSubscription()) {
      return true
    }
    if (deckStore?.decks?.length && deckStore.decks.length > freeLimitDeck) {
      return false
    }
    return true
  }

  const confirmAddNewDeck = (title) => {
    if (canMakeDeckPastFreeLimit()) {
      addNewDeck(title)
    } else {
      setDeckLimitModalVisible(true)
    }
  }

  const addNewDeck = async (title: string) => {
    const addedDeck = await addDeck({ title })
    if (addedDeck) {
      deckStore.addDeck(addedDeck)
    }
    setDeckTitle("")
    setNewDeckModalVisible(false)
  }

  const closeModal = () => {
    setDeckTitle("")
    setNewDeckModalVisible(false)
  }

  const signOut = async () => {
    if (settingsStore?.isOffline) {
      showErrorToast("Currently offline", "Go online to sign out")
      return
    }
    const pendingRemoteFunctions = await getPendingRemoteFunctions()
    if (pendingRemoteFunctions && pendingRemoteFunctions.length > 0) {
      console.log("there are pending actions before we leave")
    }
    authStore.logout()
    supabase.auth.signOut()
  }

  const DrawerItem = ({ icon, text, onPress }) => {
    return (
      <View style={$action_item_container}>
        <Icon icon={icon} style={{ marginRight: spacing.size200 }} size={22}></Icon>
        <CustomText
          onPress={() => (onPress ? onPress() : null)}
          style={$drawer_action}
          preset="body2Strong"
        >
          {text}
        </CustomText>
      </View>
    )
  }

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ justifyContent: "space-between", flex: 1 }}
      style={{
        padding: spacing.size160,
        paddingVertical: spacing.size320,
        backgroundColor: theme.colors.background2,
      }}
      {...props}
    >
      <View>
        <CustomModal
          header={"New deck"}
          body={"Choose a title for your new deck"}
          secondaryAction={() => closeModal()}
          mainAction={() => confirmAddNewDeck(deckTitle)}
          children={
            <TextField
              placeholder="Title"
              value={deckTitle}
              onChangeText={setDeckTitle}
            ></TextField>
          }
          visible={newDeckModalVisbile}
        ></CustomModal>

        <CustomModal
          header={"Deck limit reached"}
          body={
            "In our deck slots available. If you'd like more slots, consider upgrading to premium."
          }
          secondaryAction={() => setDeckLimitModalVisible(false)}
          mainAction={() => navigation.navigate(AppRoutes.SUBSCRIBE)}
          visible={deckLimitModalVisbile}
        ></CustomModal>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: custom_palette.grey74,
            marginBottom: spacing.size240,
          }}
        >
          <CustomText
            preset="title1"
            style={{
              marginBottom: spacing.size160,
            }}
          >
            Anglo
          </CustomText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            //borderBottomWidth: 0.5,
            //borderBottomColor: custom_palette.grey74,
            //marginBottom: spacing.size80,
            paddingBottom: spacing.size80,
          }}
        >
          <CustomText preset="body1">Decks</CustomText>
          <View style={{ gap: 16, flexDirection: "row" }}>
            <Icon
              size={24}
              onPress={() => navigation.navigate(AppRoutes.TUTORIAL)}
              icon="fluent_lightbulb"
            ></Icon>
            <Icon
              size={24}
              onPress={() =>
                settingsStore?.isOffline
                  ? showErrorToast("Currently offline", "Go online to add a new deck")
                  : setNewDeckModalVisible(true)
              }
              icon="fluent_add_circle"
            ></Icon>
            <Icon
              size={24}
              onPress={() =>
                settingsStore?.isOffline
                  ? showErrorToast("Currently offline", "Go online to view global decks")
                  : navigation.navigate(AppRoutes.GLOBAL_DECKS)
              }
              icon="fluent_globe_search"
            ></Icon>
          </View>
        </View>
        {deckStore.decks.map((deck) => {
          return (
            <TouchableOpacity onPress={() => selectDeck(deck)} key={deck.id}>
              <View
                style={[
                  $deck_item,
                  deckStore?.selectedDeck?.id === deck.id ? $deck_selected_item : {},
                ]}
              >
                <View
                  style={{
                    // padding: 2,
                    // paddingHorizontal: spacing.size20,
                    // borderRadius: 4,
                    // borderWidth: 1.8,
                    marginRight: spacing.size280,
                    minWidth: 16,
                    //    justifyContent: "center",
                    //   alignItems: "center",
                  }}
                >
                  <CustomText preset="caption1Strong">{deck?.todaysCards?.length}</CustomText>
                </View>
                <CustomText preset="body2Strong">{deck?.title}</CustomText>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
      <View>
        <DrawerItem
          icon="fluent_lightbulb"
          onPress={() => navigation.navigate(AppRoutes.SUBSCRIBE)}
          text="Smarter"
        ></DrawerItem>
        <DrawerItem
          icon="fluent_settings_outline"
          onPress={() => navigation.navigate(AppRoutes.SETTINGS)}
          text="Settings"
        ></DrawerItem>
        <DrawerItem
          icon="fluent_question_book"
          onPress={() => navigation.navigate(AppRoutes.ABOUT_STACK)}
          text="About"
        ></DrawerItem>
        <DrawerItem icon="fluent_sign_out" onPress={() => signOut()} text="Sign out"></DrawerItem>
      </View>
    </DrawerContentScrollView>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $deck_item: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.size120,
}

const $deck_selected_item: ViewStyle = {}

const $drawer_action: ViewStyle = {
  paddingVertical: spacing.size120,
}

const $action_item_container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
