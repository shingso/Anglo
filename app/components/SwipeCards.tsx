import * as React from "react"
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, custom_colors, spacing, typography } from "../theme"
import { Text } from "./Text"
import { Card } from "./Card"
import { ReactElement, useEffect, useMemo, useRef, useState } from "react"
import { Flashcard } from "./Flashcard"
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler"
import { Button } from "./Button"
import { Icon } from "./Icon"
import { addDays, addMinutes, differenceInMinutes } from "date-fns"
import { CardProgress, Deck, Flashcard as FlashcardModel, useStores } from "../models"
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { TextField } from "./TextField"
import { BottomSheet } from "./BottomSheet"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/consts"
import { borderRadius } from "../theme/borderRadius"
import { CustomText } from "./CustomText"
import { HEADER_HEIGHT } from "./Header"

export interface SwipeCardsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  swipeRight?: Function
  swipeLeft?: Function
  swipeUp?: Function
  cards?: Array<any>
  style?: StyleProp<ViewStyle>
  emptyComponent?: ReactElement
  disabled?: Boolean
  currentDeck?: Deck
  showBackCallback?: Function
}

/**
 * Describe your component here
 */
export const SwipeCards = observer(function SwipeCards(props: SwipeCardsProps) {
  const { style, cards, swipeLeft, swipeUp, swipeRight, emptyComponent, showBackCallback } = props
  const $styles = [$container, style]

  const currentFlashcards = cards || []
  const [showBack, setShowBack] = useState(false)

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 })
  }

  const resetCard = () => {
    setShowBack(false)
  }

  const showNextCard = () => {
    resetPosition()
    resetCard()
  }

  useEffect(() => {
    //reset the card when it changes - for the undo
    resetCard()
  }, [currentFlashcards[0]?.id])

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return Math.abs(gestureState.dx) != 0 && Math.abs(gestureState.dy) != 0 && showBack
        },
        onPanResponderMove: (evt, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy })
          positionSize.setValue(Math.max(Math.abs(gestureState.dx), Math.abs(gestureState.dy)))
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (!showBack) {
            return
          }
          if (gestureState.dx < -70) {
            Animated.spring(position, {
              toValue: { x: -SCREEN_WIDTH - 160, y: gestureState.dy },
              ...$animationProps,
            }).start(async () => {
              //this is swiping left - left means could not recall
              swipeLeft()
              showNextCard()
            })
          } else if (gestureState.dx > 70) {
            // this is a right swipe - right means pass
            Animated.spring(position, {
              toValue: { x: SCREEN_WIDTH + 160, y: gestureState.dy },
              ...$animationProps,
            }).start(async () => {
              swipeRight()
              showNextCard()
            })
          } else if (gestureState.dy < -80) {
            Animated.spring(position, {
              toValue: { x: 0, y: -SCREEN_HEIGHT - 160 },
              ...$animationProps,
            }).start(async () => {
              swipeUp()
              showNextCard()
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
    [showBack],
  )

  const position = useRef(new Animated.ValueXY()).current
  const positionSize = useRef(new Animated.Value(0)).current

  const rotate = useRef(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    }),
  ).current
  const TWO = new Animated.Value(2)

  const rotateAndTranslate = {
    transform: [
      {
        rotate: rotate,
      },
      ...position.getTranslateTransform(),
    ],
  }

  const negScreenWidthDivTwo = -SCREEN_WIDTH / 2
  const posScreenWidthDivTwo = SCREEN_WIDTH / 2
  const negScreenHeightDivTwo = -SCREEN_HEIGHT / 2

  const passOpacity = position.x.interpolate({
    inputRange: [50, 100, posScreenWidthDivTwo + 350],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  })

  const upCardOpacity = position.y.interpolate({
    inputRange: [negScreenHeightDivTwo - 300, -100, -50],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  })

  const reshuffleOpacity = position.x.interpolate({
    inputRange: [negScreenWidthDivTwo - 350, -100, -50],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  })

  const nextCardScale = positionSize.interpolate({
    inputRange: [0, 130],
    outputRange: [0.7, 1],
    extrapolate: "clamp",
  })

  const showBackOfCard = () => {
    if (!showBack) {
      setShowBack(true)
      showBackCallback ? showBackCallback() : null
    }
  }

  const renderCards = () => {
    return currentFlashcards
      .map((card, i) => {
        if (i > 1) {
          return null
        } else if (i == 0) {
          return (
            <Animated.View
              {...panResponder.panHandlers}
              key={card.id}
              style={[$view, { ...rotateAndTranslate }]}
            >
              <TouchableWithoutFeedback
                testID="showBack"
                containerStyle={$touchableContainer}
                onPress={() => showBackOfCard()}
              >
                <Flashcard cardStyle={{ elevation: 0 }} showBack={showBack} card={card}></Flashcard>
              </TouchableWithoutFeedback>
            </Animated.View>
          )
        } else if (i == 1) {
          return (
            <Animated.View
              key={card.id}
              style={[
                $view,
                {
                  transform: [
                    {
                      scale: nextCardScale,
                    },
                  ],
                },
              ]}
            >
              <Flashcard card={card}></Flashcard>
            </Animated.View>
          )
        } else {
          return null
        }
      })
      .reverse()
  }

  return (
    <View style={$styles}>
      <View style={{ height: "100%", width: "100%" }}>
        <Animated.View
          pointerEvents={"none"}
          style={{
            //transform: [{ rotate: passRotate }],
            opacity: passOpacity,
            ...$responseIcon,
          }}
        >
          <CustomText preset="title2">Knew well</CustomText>
        </Animated.View>
        <Animated.View
          pointerEvents={"none"}
          style={{
            opacity: reshuffleOpacity,
            ...$responseIcon,
          }}
        >
          <CustomText preset="title2">Couldn't recall</CustomText>
        </Animated.View>
        <Animated.View
          pointerEvents={"none"}
          style={{
            opacity: upCardOpacity,
            ...$responseIcon,
          }}
        >
          <CustomText preset="title2">Knew</CustomText>
        </Animated.View>
        {renderCards().length > 0 && renderCards()}
        {renderCards().length === 0 && emptyComponent && <>{emptyComponent}</>}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",

  height: SCREEN_HEIGHT - HEADER_HEIGHT,
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

const $responseIcon: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}

const $animationProps = {
  useNativeDriver: false,
  restSpeedThreshold: 100,
  restDisplacementThreshold: 4,
}

const $touchableContainer: ViewStyle = {
  borderRadius: borderRadius.corner120,
  elevation: 4,
}
