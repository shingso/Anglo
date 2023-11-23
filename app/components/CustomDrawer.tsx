import * as React from "react"
import { View, ViewStyle, Image, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, custom_palette, spacing, typography } from "app/theme"
import { useStores } from "app/models"
import { supabase } from "app/services/supabase/supabase"
import { getPendingRemoteFunctions } from "app/utils/remote_sync/remoteSyncUtils"
import { CustomText } from "./CustomText"
import { Icon } from "./Icon"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AppRoutes } from "app/utils/consts"

import { useState } from "react"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types"
import { showErrorToast } from "app/utils/errorUtils"

import { AddDeckModal } from "./AddDeckModal"

export interface CustomDrawerProps {
  navigation: DrawerNavigationHelpers
}

export const CustomDrawer = observer(function CustomDrawer(props: CustomDrawerProps) {
  const { navigation } = props
  const { authStore, settingsStore } = useStores()
  const [newDeckModalVisbile, setNewDeckModalVisible] = useState(false)

  const theme = useTheme()

  const closeModal = () => {
    setNewDeckModalVisible(false)
    navigation.closeDrawer()
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
        <Icon icon={icon} style={{ marginRight: spacing.size200 }} size={24}></Icon>
        <CustomText
          onPress={() => (onPress ? onPress() : null)}
          style={$drawer_action}
          preset="body2"
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
        paddingBottom: spacing.size560,
        backgroundColor: theme.colors.background2,
      }}
      {...props}
    >
      <View>
        <AddDeckModal
          visible={newDeckModalVisbile}
          addCallback={() => closeModal()}
          closeCallback={() => closeModal()}
        ></AddDeckModal>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderBottomColor: custom_palette.grey74,
            marginBottom: spacing.size240,
          }}
        >
          <Image
            style={{ height: 48, width: 48, marginLeft: -12 }}
            source={require("../../ignite/templates/splash-screen/logo.png")}
          ></Image>
          <CustomText preset="body1Strong">Spaced Memo</CustomText>
        </View>
        <DrawerItem
          icon="fluent_add_circle"
          onPress={() =>
            settingsStore?.isOffline
              ? showErrorToast("Currently offline", "Go online to add a new deck")
              : setNewDeckModalVisible(true)
          }
          text="New deck"
        ></DrawerItem>
        <DrawerItem
          icon="fluent_globe_search"
          onPress={() =>
            settingsStore?.isOffline
              ? showErrorToast("Currently offline", "Go online to view global decks")
              : navigation.navigate(AppRoutes.GLOBAL_DECKS)
          }
          text="Search decks"
        ></DrawerItem>
        <DrawerItem
          icon="fluent_lightbulb"
          onPress={() => navigation.navigate(AppRoutes.SUBSCRIBE)}
          text="Subscribe"
        ></DrawerItem>
        {settingsStore?.isDarkMode ? (
          <DrawerItem
            icon="sun"
            onPress={() => settingsStore.toggleTheme()}
            text="Light mode"
          ></DrawerItem>
        ) : (
          <DrawerItem
            icon="moon"
            onPress={() => settingsStore.toggleTheme()}
            text="Dark mode"
          ></DrawerItem>
        )}
        <DrawerItem
          icon="fluent_question_book"
          onPress={() => navigation.navigate(AppRoutes.ABOUT_STACK)}
          text="About"
        ></DrawerItem>
      </View>
      <View>
        <DrawerItem icon="fluent_sign_out" onPress={() => signOut()} text="Sign out"></DrawerItem>
      </View>
    </DrawerContentScrollView>
  )
})

const $drawer_action: TextStyle = {
  paddingVertical: spacing.size120,
  fontFamily: typography.primary.medium,
}

const $action_item_container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
