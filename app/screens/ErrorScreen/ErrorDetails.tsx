import React, { ErrorInfo } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { Button, CustomText, Icon, Screen, Text } from "../../components"
import { colors, custom_colors, spacing } from "../../theme"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo
  onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$contentContainer}
    >
      <View style={$topSection}>
        <CustomText preset="body2Strong">Somehow something went wrong.</CustomText>
      </View>

      <CustomText
        style={{
          textAlign: "center",
          marginBottom: spacing.size200,
        }}
        preset="body2"
      >
        We're working on improving this application continiously.
      </CustomText>
      <Button
        preset="custom_default_small"
        style={$resetButton}
        onPress={props.onReset}
        tx="errorScreen.reset"
      />
    </Screen>
  )
}

const $contentContainer: ViewStyle = {
  alignItems: "center",
  backgroundColor: custom_colors.background1,
  paddingHorizontal: spacing.large,
  paddingTop: spacing.extraLarge,
  flex: 1,
  justifyContent: "center",
}

const $topSection: ViewStyle = {
  alignItems: "center",
  marginBottom: spacing.size80,
}

const $resetButton: ViewStyle = {
  paddingHorizontal: spacing.huge,
}
