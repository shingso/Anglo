import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "../theme"
import { Text } from "./Text"
import Modal from "react-native-modal"
import { Button } from "./Button"
import { CustomText } from "./CustomText"
import { borderRadius } from "../theme/borderRadius"

export interface CustomModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  visible: boolean
  mainAction: Function
  mainActionLabel?: String
  secondaryAction: Function
  secondaryActionLabel?: String
  header?: String
  body: String
  children?: any
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
    secondaryActionLabel,
    header,
    body,
    children,
  } = props
  const $styles = [$container, style]

  return (
    <Modal isVisible={visible}>
      <View
        style={{
          backgroundColor: "white",
          minHeight: 160,
          borderRadius: borderRadius.corner120,
          padding: spacing.size160,
        }}
      >
        <View style={{ marginBottom: spacing.size160 }}>
          <CustomText preset="body1strong" style={{ marginBottom: spacing.size120 }}>
            {header}
          </CustomText>
          <CustomText preset="caption2">{body}</CustomText>
        </View>
        {children && <View style={{ marginBottom: spacing.size160 }}>{children}</View>}
        <View style={{ flexDirection: "row" }}>
          <Button
            style={{ flex: 1, marginRight: 4 }}
            preset="custom_outline"
            onPress={() => secondaryAction()}
          >
            {secondaryActionLabel || "Cancel"}
          </Button>
          <Button
            style={{ flex: 1, marginLeft: 4 }}
            preset="custom_filled"
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
