import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_palette, spacing, typography } from "../theme"
import { Text } from "./Text"
import Modal from "react-native-modal"
import { Button } from "./Button"
import { CustomText } from "./CustomText"
import { borderRadius } from "../theme/borderRadius"
import { useTheme } from "@react-navigation/native"

export interface CustomModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  visible: boolean
  mainAction: Function
  mainActionLabel?: String
  mainActionDisabled?: boolean
  secondaryAction?: Function
  secondaryActionLabel?: String
  header?: String
  body: String
  children?: any
  mainPreset?: any
  secondaryPreset?: any
}

/**
 * Describe your component here
 */
export const CustomModal = observer(function CustomModal(props: CustomModalProps) {
  const {
    style,
    visible,
    mainAction,
    secondaryAction,
    mainActionLabel,
    mainActionDisabled = false,
    secondaryActionLabel,
    header,
    body,
    children,
    mainPreset,
    secondaryPreset,
  } = props
  const $styles = [$container, style]
  const theme = useTheme()
  return (
    <Modal isVisible={visible}>
      <View
        style={{
          backgroundColor: theme.colors.background3,
          //minHeight: 160,
          borderRadius: borderRadius.corner120,
          padding: spacing.size200,
        }}
      >
        <View style={{ marginBottom: spacing.size160 }}>
          <CustomText preset="body1Strong" style={{ marginBottom: spacing.size120 }}>
            {header}
          </CustomText>
          <CustomText presetColors="secondary" preset="body2">
            {body}
          </CustomText>
        </View>
        {children && <View style={{ marginBottom: spacing.size160 }}>{children}</View>}
        <View style={{ flexDirection: "row", gap: spacing.size120 }}>
          {secondaryAction ? (
            <Button
              style={{ flex: 1, borderColor: custom_palette.grey68 }}
              textStyle={{ color: custom_palette.grey46 }}
              preset={secondaryPreset || "custom_outline"}
              onPress={() => secondaryAction()}
            >
              {secondaryActionLabel || "Cancel"}
            </Button>
          ) : null}
          <Button
            disabled={mainActionDisabled}
            style={{ flex: 1 }}
            preset={mainPreset || "custom_filled"}
            onPress={() => mainAction()}
          >
            {mainActionLabel || "Confirm"}
          </Button>
        </View>
      </View>
    </Modal>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
