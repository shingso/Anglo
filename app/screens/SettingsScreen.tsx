import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Switch, TextInput, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { Button, CustomTag, Screen, Text } from "../components"
import { useStores } from "../models"

import { useTheme } from "@react-navigation/native"

import { custom_colors, spacing } from "../theme"
import { supabase } from "../services/supabase/supabase"
import { borderRadius } from "app/theme/borderRadius"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Settings: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Settings" component={SettingsScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const SettingsScreen: FC<StackScreenProps<AppStackScreenProps, "Settings">> = observer(
  function SettingsScreen() {
    const { settingsStore } = useStores()
    return (
      <Screen style={$root} preset="scroll">
        <Text>Dark mode: {settingsStore?.isDarkMode.toString()}</Text>
        <Switch
          value={settingsStore.isDarkMode}
          onValueChange={() => settingsStore.toggleTheme()}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: spacing.medium,
}
