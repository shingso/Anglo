import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, ViewStyle } from "react-native"
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
    const theme = useTheme()
    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [inputValue, setInputValue] = useState("")

    const handleAddTag = () => {
      if (inputValue.trim() !== "") {
        setTags([...tags, inputValue])
        setInputValue("")
      }
    }

    const handleRemoveTag = (tag) => {
      const updatedTags = tags.filter((item) => item !== tag)
      setTags(updatedTags)
    }
    const [tags, setTags] = useState([])

    return (
      <Screen style={$root} preset="scroll">
        {/*      <Text>Dark mode: {settingsStore?.isDarkMode.toString()}</Text>
        <Switch
          color={"red"}
          value={settingsStore.isDarkMode}
          onValueChange={() => settingsStore.toggleTheme()}
        /> */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexWrap: "wrap",
            flexDirection: "row",
            gap: 8,
          }}
        >
          {tags.map((tag, index) => (
            <CustomTag key={tag + index} text={tag}></CustomTag>
          ))}
          <TextInput
            style={{
              alignSelf: "flex-start",
              borderRadius: borderRadius.corner40,
              paddingHorizontal: spacing.size80,
              paddingVertical: spacing.size20,
              backgroundColor: custom_colors.background1,
            }}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
            placeholder="Tap to edit"
            onSubmitEditing={handleAddTag}
            blurOnSubmit={false}
          />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: spacing.medium,
}
