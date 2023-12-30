import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import {
  Button,
  CustomText,
  Header,
  Icon,
  LineWord,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components"
import { custom_colors, spacing, typography } from "../theme"
import { supabase } from "../services/supabase/supabase"
import { makeRedirectUri } from "expo-auth-session"
import { AuthProviders } from "./LoginScreen"
import * as WebBrowser from "expo-web-browser"
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

    const signInWithSocialAuth = async (provider: AuthProviders) => {
      const extractParamsFromUrl = (url: string) => {
        const params = new URLSearchParams(url.split("#")[1])
        const data = {
          access_token: params.get("access_token"),
          expires_in: parseInt(params.get("expires_in") || "0"),
          refresh_token: params.get("refresh_token"),
          token_type: params.get("token_type"),
          provider_token: params.get("provider_token"),
        }
        return data
      }
      const redirectUrl = makeRedirectUri()
      const oAuthResult = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (!oAuthResult) return
      const signInResult = await WebBrowser.openAuthSessionAsync(
        oAuthResult?.data?.url,
        redirectUrl,
      )

      if (signInResult?.type === "success") {
        const data = extractParamsFromUrl(signInResult.url)
        supabase.auth.setSession({
          access_token: data?.access_token,
          refresh_token: data?.refresh_token,
        })
      }
    }

    return (
      <Screen style={$root} preset="scroll">
        <Header title={"Sign up"}></Header>

        <View style={$container}>
          <View style={{ width: 300, marginBottom: spacing.size320 }}>
            <CustomText
              preset="title1"
              style={{ marginBottom: spacing.size40, fontFamily: typography.primary.semiBold }}
            >
              Get more out of your studying
            </CustomText>
          </View>

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
          <LineWord text="or"></LineWord>
          <Button
            preset="custom_outline"
            style={{
              marginBottom: spacing.size160,
              height: 44,
              borderColor: custom_colors.foreground3,
            }}
            textStyle={{ fontSize: 16, lineHeight: 26, color: custom_colors.foreground3 }}
            LeftAccessory={(props) => (
              <Icon color={null} containerStyle={props.style} icon="google_logo" size={22}></Icon>
            )}
            onPress={() => signInWithSocialAuth(AuthProviders.GOOGLE)}
          >
            Continue with Google
          </Button>
          <Button
            preset="custom_outline"
            style={{
              marginBottom: spacing.size160,
              height: 44,
              backgroundColor: "black",
              borderWidth: 0,
            }}
            textStyle={{ fontSize: 16, lineHeight: 26, color: "white" }}
            LeftAccessory={(props) => (
              <Icon containerStyle={props.style} icon="apple_logo" color="white" size={22}></Icon>
            )}
            onPress={() => signInWithSocialAuth(AuthProviders.APPLE)}
          >
            Continue with Apple
          </Button>
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

const $inputContainer: ViewStyle = {
  marginBottom: spacing.size200,
}
