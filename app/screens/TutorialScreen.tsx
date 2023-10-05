import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, Image, Dimensions, Animated } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CustomText, Icon, Screen, Text } from "app/components"

// import { useStores } from "app/models"

import { saveTutorialSeen } from "app/utils/storage/tutorialUtils"
import { getAllKeys } from "app/utils/storage"
import { custom_palette, spacing } from "app/theme"
import { ScrollView } from "react-native-gesture-handler"
import { color } from "react-native-reanimated"
import { ExpandingDot } from "react-native-animated-pagination-dots"
interface TutorialScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Tutorial">> {}

export const TutorialScreen: FC<TutorialScreenProps> = observer(function TutorialScreen() {
  // const { someStore, anotherStore } = useStores()

  useEffect(() => {
    const setTutorialSeen = async () => {
      await saveTutorialSeen(true)
    }
    setTutorialSeen()
  }, [])

  const [sliderState, setSliderState] = useState({ currentPage: 0 })
  const { width, height } = Dimensions.get("screen")

  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState
    const { x } = event.nativeEvent.contentOffset
    const indexOfNextScreen = Math.floor(x / width)
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      })
    }
  }

  const { currentPage: pageIndex } = sliderState

  const slides = [
    {
      key: "one",
      title: "Studying is stressful",
      text: "Studying is hard. How do we know if were studing effectively? Will we know the information when we need it?",
      //  image: require("../../assets/images/girl_looking_at_phone.png"),
    },
    {
      key: "two",
      title: "Our memory spans",
      text: "When we try to memorize something, our brains will forget the information over a period of time",
      //image: require("../../assets/images/goldfish_in_bowl.png"),
      backgroundColor: "#febe29",
    },
    {
      key: "three",
      title: "Spaced repitition",
      //image: require("../../assets/images/girl_looking_at_phone.png"),
      text: "By revisting what we are trying to memorize before the we completely forget it, we can extend our memory retention",
      backgroundColor: "#22bcb5",
    },
    {
      key: "four",
      // image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "Smart cards",
      text: "When using these flashcards, cards will automatically be placed in a pile for review based on your response.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "five",
      // image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "You know it!",
      text: "If you know the definition of the card confidently, swipe the card left",
      backgroundColor: "#22bcb5",
    },
    {
      key: "six",
      //  image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "You know it, but weren't confident about it",
      text: "If you got the definition correct, were unsure and took some time recalling, swipe the card up.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "seven",
      //  image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "Forgot card",
      text: "If you don't know the defintition, swipe left",
    },
    {
      key: "eight",
      // image: require("../../assets/images/girl_looking_at_phone.png"),
      title: "Review cards at intervals",
      text: "As you know the card better and better, it the interval will continue to grow. Consistently come back and study the cards",
      backgroundColor: "#22bcb5",
    },
  ]

  const scrollX = useRef(new Animated.Value(0)).current
  const ScrollViewComponent = (props) => {
    const { title, body } = props
    return (
      <View style={{ width, height, padding: spacing.size200 }}>
        <CustomText>{title}</CustomText>
        <CustomText>{body}</CustomText>
      </View>
    )
  }
  const _onDone = () => {}
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen safeAreaEdges={["top"]} style={$root}>
      <ScrollView
        style={{ height: "100%" }}
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
      >
        {slides.map((slide) => {
          return (
            <ScrollViewComponent
              key={slide.title}
              title={slide.title}
              body={slide.text}
            ></ScrollViewComponent>
          )
        })}
      </ScrollView>
      {/*       <View style={$paginationWrapper}>
        {Array.from(slides.keys()).map((key, index) => (
          <View style={[$paginationDots, { opacity: pageIndex === index ? 1 : 0.2 }]} key={index} />
        ))}
      </View> */}
      <ExpandingDot
        data={slides}
        expandingDotWidth={30}
        scrollX={scrollX}
        inActiveDotOpacity={0.6}
        dotStyle={{
          width: 10,
          height: 10,
          backgroundColor: "#347af0",
          borderRadius: 5,
          marginHorizontal: 5,
        }}
        containerStyle={{
          // top: 30,
          bottom: 120,
          left: 32,
        }}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $paginationDots: ViewStyle = {
  height: 10,
  width: 10,
  borderRadius: 10 / 2,
  backgroundColor: "#0898A0",
  marginLeft: 10,
}

const $paginationWrapper: ViewStyle = {
  position: "absolute",
  bottom: 100,
  left: 0,
  right: 0,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
}
