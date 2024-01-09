import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, Image, Dimensions, Animated } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackScreenProps } from "app/navigators"
import { Button, CustomText, Header, Icon, Screen, Text } from "app/components"

// import { useStores } from "app/models"

import { saveTutorialSeen } from "app/utils/storage/tutorialUtils"
import { getAllKeys } from "app/utils/storage"
import { custom_palette, spacing, typography } from "app/theme"
import { ScrollView } from "react-native-gesture-handler"
import { color } from "react-native-reanimated"
import { ExpandingDot } from "react-native-animated-pagination-dots"
import { useTheme } from "@react-navigation/native"
interface TutorialScreenProps extends NativeStackScreenProps<AppStackScreenProps<"Tutorial">> {}

export const TutorialScreen: FC<TutorialScreenProps> = observer(function TutorialScreen() {
  /*  useEffect(() => {
    const setTutorialSeen = async () => {
      await saveTutorialSeen(true)
    }
    setTutorialSeen()
  }, []) */
  //we can merely suggest that the user look at what is happening before they start and they can learn about this applicaiton anytime

  const { width, height } = Dimensions.get("screen")
  const theme = useTheme()
  const slides = [
    {
      key: "one",
      title: "Studying is stressful",
      text: "Studying is hard. How do we know if we're studing effectively? Will we know the information when we need it?",
      image: require("../../assets/images/stress2.png"),
    },
    {
      key: "two",
      title: "Our memory spans",
      text: "When we memorize something, our minds will slowly forget the information over a period of time.",
      image: require("../../assets/images/goldfish_in_bowl.png"),
      backgroundColor: "#febe29",
    },
    {
      key: "three",
      title: "Spaced memorization",
      image: require("../../assets/images/remember.png"),
      text: "If we review the material before it's entirely forgotten, we can refresh and extend our memory retention.",
      text1:
        "Enhance your memory retention by reviewing learned material before it's entirely forgotten",
      backgroundColor: "#22bcb5",
    },
    {
      key: "four",
      image: require("../../assets/images/smartspacing.png"),
      title: "Smart spacing",
      text: "Cards will automatically be spaced out and set for review at a later time based on your response when you see it.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "nine",
      image: require("../../assets/images/tapcard.png"),
      title: "How to use flashcards",
      text: "Tap to see the back flashcard. Then swipe the card left, up, or right based on how well you know the card.",
      backgroundColor: "#22bcb5",
    },

    {
      key: "five1",
      image: require("../../assets/images/swiperightcard.png"),
      title: "You know it!",
      text: "If you know the definition of the card confidently, swipe the card left",
      backgroundColor: "#22bcb5",
    },
    {
      key: "six1",
      image: require("../../assets/images/swipeupcard.png"),
      title: "You know it, but weren't confident about it",
      text: "If you got the definition correct, but were unsure and took some time recalling, swipe the card up.",
      backgroundColor: "#22bcb5",
    },
    {
      key: "seven1",
      image: require("../../assets/images/swipeleftcard.png"),
      title: "Forgot card",
      text: "If you didnt't know the defintition, swipe the card left.",
    },
  ]

  const scrollX = useRef(new Animated.Value(0)).current
  const ScrollViewComponent = (props) => {
    const { title, body, image } = props
    return (
      <View
        style={{
          width,
          height: height - 104,

          padding: spacing.size280,
          alignItems: "center",
          paddingTop: spacing.size360,
          alignContent: "center",
        }}
      >
        <CustomText
          preset="title1"
          style={{
            marginBottom: spacing.size320,
            textAlign: "center",
          }}
        >
          {title}
        </CustomText>
        <Image
          style={{ width: 360, height: 360, marginBottom: spacing.size160 }}
          resizeMode={"cover"}
          source={image}
        ></Image>
        <CustomText style={{ textAlign: "center" }} preset="body1">
          {body}
        </CustomText>
      </View>
    )
  }
  const _onDone = () => {}

  return (
    <Screen style={$root}>
      <ScrollView
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
              image={slide.image}
            ></ScrollViewComponent>
          )
        })}
      </ScrollView>
      <ExpandingDot
        data={slides}
        inActiveDotColor={theme.colors.foreground1}
        activeDotColor={theme.colors.brandBackground1}
        expandingDotWidth={30}
        scrollX={scrollX}
        inActiveDotOpacity={0.6}
        dotStyle={{
          width: 10,
          height: 10,

          borderRadius: 5,
          marginHorizontal: 5,
        }}
        containerStyle={{
          // top: 30,
          //right: 32,
          bottom: 90,
          //left: 32,
        }}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
