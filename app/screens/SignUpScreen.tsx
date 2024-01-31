import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
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
import { showErrorToast } from "app/utils/errorUtils"
import { useNavigation } from "@react-navigation/native"
import { AppRoutes, AppStackParamList } from "app/utils/consts"
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
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()

    const signUp = async (email: string, password: string) => {
      setIsSubmitted(true)
      if (validateEmail()) {
        showErrorToast(validateEmail())
        return
      }
      if (validatePassword()) {
        showErrorToast(validatePassword())
        return
      }
      setIsSubmitted(false)
      let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      if (error) {
        showErrorToast("Could not sign up with credentials", error.message)
      }
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

    const validateEmail = (): string => {
      if (email.length === 0) return "Email can't be blank"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Must be a valid email address"
      return ""
    }

    const validatePassword = (): string => {
      if (password.length === 0) return "Password can't be blank"
      if (password.length < 6) return "Password must be at least 6 characters"
      return ""
    }

    const emailError = isSubmitted ? validateEmail() : ""
    const passwordError = isSubmitted ? validatePassword() : ""

    return (
      <Screen
        contentContainerStyle={{ flexGrow: 1 }}
        safeAreaEdges={["top", "bottom"]}
        style={$root}
        preset="scroll"
      >
        <View style={$container}>
          <View style={{ width: 300, marginBottom: spacing.size200 }}>
            <CustomText
              preset="title1"
              style={{ marginBottom: spacing.size40, fontFamily: typography.primary.semiBold }}
            >
              Study anywhere, know it everywhere
            </CustomText>
          </View>

          <CustomText
            //presetColors={"secondary"}
            preset="caption1"
            style={{ marginBottom: spacing.size120 }}
          >
            Quickly get started by signing up with an email and password or use a social provider
            (recommended).
          </CustomText>

          <TextField
            status={emailError ? "error" : undefined}
            value={email}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={setEmail}
            containerStyle={$inputContainer}
          ></TextField>
          <TextField
            status={passwordError ? "error" : undefined}
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
          <LineWord text="or easily sign up with a social provider"></LineWord>
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
          <Button
            preset="custom_outline"
            style={{
              marginBottom: spacing.size160,
              height: 44,
              backgroundColor: custom_colors.background3,
              borderWidth: 0,
            }}
            textStyle={{ fontSize: 16, lineHeight: 26, color: "#5865F2" }}
            LeftAccessory={(props) => (
              <Icon
                containerStyle={props.style}
                icon="discord_logo"
                color="#5865F2"
                size={22}
              ></Icon>
            )}
            onPress={() => signInWithSocialAuth(AuthProviders.DISCORD)}
          >
            Continue with Discord
          </Button>
          <CustomText
            preset="body2Strong"
            style={{ marginTop: spacing.size160, color: custom_colors.blueForeground1 }}
            onPress={() => navigation.navigate(AppRoutes.LOGIN)}
          >
            Already have an account?
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              marginTop: "auto",
              justifyContent: "center",
            }}
          >
            <CustomText preset="caption2">By using this application you agree to our </CustomText>
            <CustomText
              style={$terms_link}
              preset="caption2"
              onPress={() => navigation.navigate(AppRoutes.TERMS_OF_SERVICE)}
            >
              Terms of Service
            </CustomText>
          </View>
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $container: ViewStyle = {
  padding: spacing.size240,
  paddingTop: spacing.size400,
  flex: 1,
}

const $inputContainer: ViewStyle = {
  marginBottom: spacing.size200,
}

const $terms_link: TextStyle = {
  color: custom_colors.brandBackground2,
}
