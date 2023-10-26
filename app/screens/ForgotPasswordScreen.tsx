import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Button, CustomText, Screen, Text, TextField } from "../components"
import { supabase } from "../services/supabase/supabase"
import { spacing } from "../theme"
import Toast from "react-native-toast-message"
import { makeRedirectUri } from "expo-auth-session"
import { showErrorToast, showSuccessToast } from "app/utils/errorUtils"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `ForgotPassword: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const ForgotPasswordScreen: FC<StackScreenProps<AppStackScreenProps, "ForgotPassword">> =
  observer(function ForgotPasswordScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()

    const [email, setEmail] = useState("")

    const recoverEmail = async (email: string) => {
      const redirectUrl = makeRedirectUri({
        path: "reset",
      })

      let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/auth/callback",
      })

      if (data) {
        showSuccessToast(
          "Password reset email sent",
          "Please wait a moment for the email to appear and check your junk inbox.",
        )
      } else {
        showErrorToast("Error", "Password reset email could not be sent")
      }

      // we need to make them go to the redirect when they click on email
    }

    const updatePasswordRecovery = async (email: string, password: string) => {
      const { data, error } = await supabase.auth.updateUser({
        email: email,
        password: password,
      })
    }

    return (
      <Screen style={$root} preset="scroll">
        <CustomText style={{ marginBottom: spacing.size120 }} preset="title3">
          Let's get you back into your account.
        </CustomText>
        <CustomText style={{ marginBottom: spacing.size200 }} preset="body2">
          A password reset email will be set to the email
        </CustomText>
        <TextField
          placeholder="Email"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
          containerStyle={$inputContainer}
        ></TextField>
        <Button preset="custom_default" onPress={() => recoverEmail(email)}>
          Send Email
        </Button>
      </Screen>
    )
  })

const $root: ViewStyle = {
  flex: 1,
  padding: spacing.large,
}

const $inputContainer: ViewStyle = {
  marginBottom: spacing.large,
}
