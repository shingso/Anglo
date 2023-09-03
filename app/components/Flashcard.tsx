import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "../theme"
import { Text } from "./Text"
import { Card } from "./Card"
import { CustomText } from "./CustomText"
import { useEffect, useState } from "react"
import * as Speech from "expo-speech"
import { borderRadius } from "../theme/borderRadius"
import { CustomTag } from "./CustomTag"

export interface FlashcardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  onPress?: Function
  card?: any
  showBack?: boolean
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  cardStyle?: any
}

/**
 * Describe your component here
 */
export const Flashcard = observer(function Flashcard(props: FlashcardProps) {
  const { style, card, showBack = false, onPress, disabled, cardStyle } = props
  const $styles = [$container, style]
  const $cardStyle = [cardStyle, $cardContainer]

  return (
    <View style={$styles}>
      <Card
        activeOpacity={1}
        style={$cardStyle}
        headingStyle={$cardHeading}
        HeadingComponent={
          <View
            onStartShouldSetResponder={(event) => true}
            onTouchEnd={(e) => {
              e.stopPropagation()
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              elevation: 200,
              zIndex: 200,
              marginBottom: spacing.size160,
            }}
          >
            <View>
              <CustomText style={$cardHeading} preset="largeTitle">
                {card.front}
              </CustomText>
              <CustomText preset="caption2">{card?.sub_header}</CustomText>
            </View>
          </View>
        }
        ContentComponent={
          showBack && (
            <View style={$contentContainer}>
              <View>
                <View style={{ marginBottom: spacing.size160 }}>
                  <CustomText preset="title2" style={$back}>
                    {card.back}
                  </CustomText>
                </View>
                {!!card?.extra && (
                  <CustomText style={{ marginBottom: spacing.size160 }} preset="caption1">
                    {card?.extra}
                  </CustomText>
                )}

                {card?.extra_array && card.extra_array.length > 0 && (
                  <View style={$extra_array}>
                    {card.extra_array.map((extra, i) => (
                      <CustomTag text={extra} key={i}></CustomTag>
                    ))}
                  </View>
                )}
              </View>
              {card?.picture_url && (
                <Image
                  style={$cardImage}
                  source={{
                    uri: card.picture_url,
                  }}
                ></Image>
              )}
            </View>
          )
        }
        contentStyle={$cardContent}
      ></Card>
    </View>
  )
})

const $container: ViewStyle = {
  width: "100%",
  height: "100%",
}

const $cardContainer: ViewStyle = {
  width: "100%",
  height: "100%",
  padding: spacing.size200,
  borderColor: custom_colors.background1,
}

const $cardHeading: TextStyle = {
  //fontSize: 20,
  //fontWeight: "bold",
  //marginBottom: 20,
}

const $cardContent: TextStyle = {}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $contentContainer: ViewStyle = {
  flex: 1,
}

const $cardImage: ImageStyle = {
  borderRadius: borderRadius.corner40,
  height: 150,
  width: 150,
}

const $back: ViewStyle = {}

const $extra: ViewStyle = {}

const $extra_array: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: spacing.size200,
  gap: spacing.size80,
}

const $extra_text: TextStyle = {
  marginRight: spacing.small,
  paddingVertical: 4,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginTop: spacing.size80,
  backgroundColor: colors.background,
}

const $label: TextStyle = {
  marginBottom: spacing.size60,
}
