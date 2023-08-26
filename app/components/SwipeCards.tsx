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
import { Flashcard_Fields, updateFlashcard } from "../utils/flashcardUtils"
import { Button } from "./Button"
import { Icon } from "./Icon"
import { addDays, addMinutes, differenceInMinutes } from "date-fns"
import { CardProgress, Deck, Flashcard as FlashcardModel, useStores } from "../models"
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { TextField } from "./TextField"
import { BottomSheet } from "./BottomSheet"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/consts"
import { updateMostRecentLocalId } from "../utils/remote_sync/remoteSyncUtils"
import { borderRadius } from "../theme/borderRadius"
import { CustomText } from "./CustomText"

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
}

/**
 * Describe your component here
 */
export const SwipeCards = observer(function SwipeCards(props: SwipeCardsProps) {
  const { style, cards, swipeLeft, swipeUp, swipeRight, emptyComponent, disabled, currentDeck } =
    props
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

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return Math.abs(gestureState.dx) != 0 && Math.abs(gestureState.dy) != 0 && showBack
        },
        onPanResponderMove: (evt, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy })
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (!showBack) {
            return
          }
          if (gestureState.dx < -120) {
            Animated.spring(position, {
              toValue: { x: -SCREEN_WIDTH - 160, y: gestureState.dy },
              ...$animationProps,
            }).start(async () => {
              //this is swiping left - left means could not recall
              swipeRight()
              showNextCard()
            })
          } else if (gestureState.dx > 120) {
            // this is a right swipe - right means pass
            Animated.spring(position, {
              toValue: { x: SCREEN_WIDTH + 160, y: gestureState.dy },
              ...$animationProps,
            }).start(async () => {
              swipeLeft()
              showNextCard()
            })
          } else if (gestureState.dy < -140) {
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
  const rotate = useRef(
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    }),
  ).current
  const TWO = new Animated.Value(2)

  const maxOfAnimated = (
    a: Animated.Value,
    b: Animated.Value,
  ): Animated.AnimatedInterpolation<number> => {
    return Animated.divide(
      Animated.add(
        Animated.add(a, b),
        Animated.subtract(a, b).interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [1, 0, 1],
        }),
      ),
      TWO,
    )
  }

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
    inputRange: [100, posScreenWidthDivTwo - 50, posScreenWidthDivTwo + 350],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  })

  const upCardOpacity = position.y.interpolate({
    inputRange: [negScreenHeightDivTwo - 300, negScreenHeightDivTwo, -100],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  })

  const reshuffleOpacity = position.x.interpolate({
    inputRange: [negScreenWidthDivTwo - 350, negScreenWidthDivTwo + 50, -100],
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  })

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  })

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: "clamp",
  })

  const newNextCardScale = maxOfAnimated(position.x, position.y).interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  })

  const nextCardScale2 = position.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: "clamp",
  })

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
                onPress={() => setShowBack(true)}
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
          <CustomText preset="title2">Kinda knew</CustomText>
        </Animated.View>
        {renderCards().length > 0 && renderCards()}
        {renderCards().length === 0 && emptyComponent && <>{emptyComponent}</>}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  //TODO: Figure out the exact number
  height: SCREEN_HEIGHT - 110,
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
