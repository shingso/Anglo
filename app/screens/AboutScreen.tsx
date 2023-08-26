import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { CustomText, Screen, Text } from "../components"
import { useNavigation } from "@react-navigation/native"
import { spacing } from "../theme"
import { AppStackParamList, AppRoutes } from "../utils/consts"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `About: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="About" component={AboutScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const AboutScreen: FC<StackScreenProps<AppStackScreenProps, "About">> = observer(
  function AboutScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          <CustomText
            style={$item}
            preset="body2Strong"
            onPress={() => navigation.navigate(AppRoutes.TERMS_OF_SERVICE)}
          >
            Term of Service
          </CustomText>
          <CustomText
            style={$item}
            preset="body2Strong"
            onPress={() => navigation.navigate(AppRoutes.PRIVACY_POLICY)}
          >
            Privacy Policy
          </CustomText>
          <CustomText
            style={$item}
            preset="body2Strong"
            onPress={() => navigation.navigate(AppRoutes.OPEN_SOURCE)}
          >
            Open Source Libraries
          </CustomText>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size160,
}

const $item: ViewStyle = {
  marginBottom: spacing.size280,
}
