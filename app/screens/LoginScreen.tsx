import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Platform, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import * as Linking from "expo-linking"
import {
  Button,
  CustomText,
  Icon,
  Screen,
  Text,
  TextField,
  TextFieldAccessoryProps,
} from "../components"
import { useNavigation } from "@react-navigation/native"
import { colors, custom_colors, spacing, typography } from "../theme"
import { supabase } from "../services/supabase/supabase"
import * as Google from "expo-auth-session/providers/google"
import { makeRedirectUri } from "expo-auth-session"
import { AppStackParamList, AppRoutes } from "../utils/consts"
import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import { showErrorToast } from "app/utils/errorUtils"

export enum AuthProviders {
  GOOGLE = "google",
  APPLE = "apple",
  DISCORD = "discord",
}
// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const LoginScreen: FC<StackScreenProps<AppStackScreenProps, "Login">> = observer(
  function LoginScreen() {
    const passwordInput = useRef<TextInput>()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    async function signInWithEmail() {
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
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        })
        if (error) {
          showErrorToast("No account found", "Could not find a login with entered information")
        }
      } catch (error) {
        console.log("Somthing went wrong with login")
      }
    }

    async function signInWithPhone() {
      try {
        const { data, error } = await supabase.auth.signUp({
          phone: email,
          password: password,
        })
        console.log(data, error)
        if (error) {
          console.log("error", error)
          showErrorToast("No account found", "Could not find a login with entered information")
        }
      } catch (error) {
        console.log("Somthing went wrong with login")
      }
    }

    const validateEmail = (): string => {
      if (email.length === 0) return "Email can't be blank"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Must be a valid email address"
      return ""
    }

    const validatePassword = (): string => {
      if (password.length === 0) return "Password can't be blank"
      /* if (password.length < 6) return "Password must be at least 6 characters" */
      return ""
    }

    const emailError = isSubmitted ? validateEmail() : ""
    const passwordError = isSubmitted ? validatePassword() : ""

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

    const goToSignUp = () => {
      navigation.navigate(AppRoutes.SIGN_UP)
    }

    const goToPasswordResetWeb = () => {
      Linking.openURL("https://spacedmemo.com/passwordrecovery")
    }

    const goToForgotPassword = () => {
      navigation.navigate(AppRoutes.FORGOT_PASSWORD)
    }

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
      <Screen safeAreaEdges={["top", "bottom"]} style={$root} preset="fixed">
        <View style={$container}>
          <View style={{ width: 300, marginBottom: spacing.size40 }}>
            <CustomText
              preset="title1"
              style={{ marginBottom: spacing.size40, fontFamily: typography.primary.semiBold }}
            >
              Welcome back!
            </CustomText>
          </View>
          <CustomText preset="caption1" style={{ marginBottom: spacing.size160 }}>
            Sign back into your account and continue studying.
          </CustomText>
          <TextField
            containerStyle={$modal_text_field}
            value={email}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Email"
            onChangeText={setEmail}
            status={emailError ? "error" : undefined}
            onSubmitEditing={() => passwordInput.current?.focus()}
          ></TextField>
          <TextField
            containerStyle={{ marginBottom: spacing.size200 }}
            ref={passwordInput}
            value={password}
            placeholder="Password"
            autoCorrect={false}
            status={passwordError ? "error" : undefined}
            secureTextEntry={isPasswordHidden}
            autoCapitalize="none"
            onChangeText={setPassword}
            RightAccessory={PasswordRightAccessory}
          ></TextField>
          <Button style={$inputContainer} preset="custom_default" onPress={() => signInWithEmail()}>
            Sign In
          </Button>
          <CustomText preset="body2Strong" onPress={() => goToPasswordResetWeb()}>
            Forgot your password?
          </CustomText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: spacing.size240,
            }}
          >
            <View style={{ backgroundColor: custom_colors.foreground2, height: 1, flex: 1 }} />
            <CustomText preset="caption1" style={{ paddingHorizontal: spacing.size160 }}>
              or quickly sign in
            </CustomText>
            <View style={{ backgroundColor: custom_colors.foreground2, height: 1, flex: 1 }} />
          </View>
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
            onPress={() => goToSignUp()}
          >
            Dont have an account yet?
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
  paddingBottom: spacing.size240,
  paddingTop: spacing.size400,
  height: "100%",
}

const $inputContainer: ViewStyle = {
  marginBottom: spacing.size120,
  height: 40,
}

const $sign_up_container: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-end",
}

const $modal_text_field: ViewStyle = {
  marginBottom: spacing.size160,
}

const $terms_link: TextStyle = {
  color: custom_colors.brandBackground2,
}
