import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import {
  Button,
  CustomText,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components"
import { custom_colors, spacing } from "../theme"
import { supabase } from "../services/supabase/supabase"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `SignUp: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="SignUp" component={SignUpScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const SignUpScreen: FC<StackScreenProps<AppStackScreenProps, "SignUp">> = observer(
  function SignUpScreen() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signUp = async (email: string, password: string) => {
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      console.log("DATA " + data.session, "ERROR " + error)
    }
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    const PasswordRightAccessory = useMemo(
      () =>
        function PasswordRightAccessory(props: TextFieldAccessoryProps) {
          return (
            <Icon
              icon={isPasswordHidden ? "view" : "hidden"}
              color={custom_colors.background6}
              containerStyle={props.style}
              size={20}
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            />
          )
        },
      [isPasswordHidden],
    )

    return (
      <Screen safeAreaEdges={["top"]} style={$root} preset="scroll">
        <CustomText style={{ marginBottom: spacing.size120 }} preset="body1Strong">
          Sign Up
        </CustomText>

        <TextField
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={setEmail}
          containerStyle={$inputContainer}
        ></TextField>
        <TextField
          value={password}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={setPassword}
          secureTextEntry={isPasswordHidden}
          containerStyle={$inputContainer}
          RightAccessory={PasswordRightAccessory}
        ></TextField>
        <Button preset="custom_default" onPress={() => signUp(email, password)}>
          Sign Up
        </Button>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
  padding: spacing.large,
}

const $inputContainer: ViewStyle = {
  marginBottom: spacing.size160,
}
