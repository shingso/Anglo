import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_palette, spacing, typography } from "../theme"
import { Text } from "./Text"
import {
  BottomSheetModalProvider,
  BottomSheetModal,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { Icon } from "./Icon"
import { forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { CustomText } from "./CustomText"
import { borderRadius } from "app/theme/borderRadius"

export interface BottomSheetProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  children?: any
  header?: any
  customSnap?: any
  title?: string
  onDismiss?: Function
}

/**
 * Describe your component here
 */
export const BottomSheet = forwardRef(function BottomSheet(
  props: BottomSheetProps,
  ref: Ref<BottomSheetModal>,
) {
  const { style, children, header, customSnap, title, onDismiss } = props
  const $styles = [$container, style]
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => (customSnap ? customSnap : ["50%", "90%"]), [customSnap])

  useImperativeHandle(ref, () => bottomSheetRef.current)

  const renderBackdrop = React.useCallback(
    (props) => (
      <BottomSheetBackdrop opacity={0.4} disappearsOnIndex={-1} appearsOnIndex={0} {...props} />
    ),
    [],
  )

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        handleComponent={() => (
          <View
            style={{
              marginBottom: spacing.size20,
              minHeight: 0,
              paddingBottom: 0,
              alignItems: "center",
              justifyContent: "center",
              marginTop: spacing.size80,
            }}
          >
            <View
              style={{
                width: 32,
                backgroundColor: custom_palette.grey50,
                height: 6,
                borderRadius: borderRadius.corner120,
              }}
            ></View>
          </View>
        )}
        onDismiss={() => (onDismiss ? onDismiss() : null)}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
      >
        <View style={$modal_header}>
          <View style={$buttons_container}>
            {header && <View style={$header}>{header}</View>}
            {title && <CustomText preset="body2Strong">{title}</CustomText>}
            {/*    <Icon color="rgba(0,0,0,0.7)" size={24} icon="save"></Icon>*/}
            {/*    <Icon
              style={{ marginLeft: spacing.large }}
              onPress={() => bottomSheetRef.current.dismiss()}
              color="rgba(0,0,0,0.7)"
              size={26}
              icon="x"
            ></Icon> */}
          </View>
        </View>
        <View style={$modal_content}>{children}</View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  backgroundColor: "green",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $modal_header: ViewStyle = {
  paddingHorizontal: spacing.large,
  //borderBottomWidth: 1,
  //borderBottomColor: colors.border,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}

const $modal_header_title: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
}

const $modal_content: ViewStyle = { paddingHorizontal: spacing.medium }

const $buttons_container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  justifyContent: "center",
}

const $modal_container: ViewStyle = { backgroundColor: "green" }

const $header: ViewStyle = {
  flex: 1,
}
