import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, CustomText, Screen, Text, TextField } from "../components"
import { supabase } from "../services/supabase/supabase"
import { spacing } from "app/theme"
import { showErrorToast } from "app/utils/errorUtils"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `ResetPassword: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /loru>`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ResetPasswordScreen: FC<StackScreenProps<AppStackScreenProps, "ResetPassword">> =
  observer(function ResetPasswordScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [newPassword, setNewPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const updatePassword = async (password: string) => {
      if (newPassword !== passwordConfirm) {
        showErrorToast("Error", "Passwords do not match")
        return
      }

      const { data, error } = await supabase.auth.updateUser({
        password: password,
      })
    }
    return (
      <Screen style={$root} preset="scroll">
        <View style={$container}>
          <CustomText style={{ marginBottom: spacing.size160 }}>Reset your password</CustomText>
          <TextField
            label="New password"
            value={newPassword}
            autoCapitalize="none"
            secureTextEntry={true}
            containerStyle={{ marginBottom: spacing.size160 }}
            onChangeText={setNewPassword}
          ></TextField>
          <TextField
            secureTextEntry={true}
            label="Reenter password"
            value={passwordConfirm}
            autoCapitalize="none"
            containerStyle={{ marginBottom: spacing.size280 }}
            onChangeText={setPasswordConfirm}
          ></TextField>
          <Button preset="custom_default" onPress={() => updatePassword(newPassword)}>
            Reset Password
          </Button>
        </View>
      </Screen>
    )
  })

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size200,
}
