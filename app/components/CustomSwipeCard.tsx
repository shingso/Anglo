import * as React from "react"
import {
  Animated,
  PanResponder,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "../theme"
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "@gorhom/bottom-sheet"
import { Card } from "./Card"

export interface CustomSwipeCardsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  swipeRight?: Function
  swipeLeft?: Function
  swipeUp?: Function
  cards?: Array<any>
  style?: StyleProp<ViewStyle>
  children?: React.ReactElement
  disabled?: Boolean
}

/**
 * Describe your component here
 */
export const CustomSwipeCards = observer(function CustomSwipeCards(props: CustomSwipeCardsProps) {
  const { style, cards, swipeLeft, swipeUp, swipeRight, disabled, children } = props
  const $styles = [$container, style]

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 })
  }

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return Math.abs(gestureState.dx) != 0 && Math.abs(gestureState.dy) != 0
        },
        onPanResponderMove: (evt, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy })
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx > 120) {
            Animated.spring(position, {
              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
              ...$animationProps,
            }).start(async () => {
              if (swipeRight) {
                swipeRight()
              }
            })
          } else if (gestureState.dx < -120) {
            Animated.spring(position, {
              toValue: { x: -SCREEN_WIDTH - 160, y: gestureState.dy },
              ...$animationProps,
            }).start(async () => {
              if (swipeLeft) {
                swipeLeft()
              }
            })
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              ...$animationProps,
            }).start(() => {
              resetPosition()
            })
          }
        },
      }),
    [],
  )

  const position = React.useRef(new Animated.ValueXY()).current
  const rotate = React.useRef(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    }),
  ).current

  const rotateAndTranslate = {
    transform: [
      {
        rotate: rotate,
      },
      ...position.getTranslateTransform(),
    ],
  }

  const renderCards = () => {
    return (
      <Animated.View {...panResponder.panHandlers} style={[$view, { ...rotateAndTranslate }]}>
        <Card style={$cardStyle} ContentComponent={children}></Card>
      </Animated.View>
    )
  }

  return (
    <View style={$styles}>
      <View style={{ height: "100%", width: "100%" }}>{renderCards()}</View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  //TODO: Figure out the exact number
  height: SCREEN_HEIGHT - 130,
  width: "100%",

  padding: spacing.large,
}

const $view: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}

const $animationProps = {
  useNativeDriver: false,
  restSpeedThreshold: 100,
  restDisplacementThreshold: 4,
}

const $cardStyle: ViewStyle = {
  width: "100%",
  height: "100%",
  padding: spacing.large,
  backgroundColor: custom_colors.background1,
  borderColor: custom_colors.background1,
}
