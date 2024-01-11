import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, TouchableOpacity, View, ViewStyle, Image } from "react-native"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import {
  Button,
  Card,
  CustomTag,
  CustomText,
  Header,
  Icon,
  Loading,
  Screen,
  Text,
  TextField,
} from "../components"
import { colors, custom_colors, spacing } from "../theme"
import { searchGlobalDecks } from "../utils/globalDecksUtils"
import { useNavigation } from "@react-navigation/native"
import { Deck, useStores } from "../models"
import { supabase } from "../services/supabase/supabase"
import { AppStackParamList, AppRoutes } from "../utils/consts"
import { FlatList } from "react-native-gesture-handler"
import { borderRadius } from "app/theme/borderRadius"
import { showErrorToast } from "app/utils/errorUtils"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `GlobalDecks: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="GlobalDecks" component={GlobalDecksScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const GlobalDecksScreen: FC<StackScreenProps<AppStackScreenProps, "GlobalDecks">> = observer(
  function GlobalDecksScreen() {
    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>()
    const [searchTerm, setSearchTerm] = useState("")
    const [decks, setDecks] = useState([])
    const [selectedTag, setSelectedTag] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const getDecks = async (searchTerm) => {
        setLoading(true)
        const data = await searchGlobalDecks(searchTerm)
        if (data) {
          setDecks((prev) => data)
        }
        setLoading(false)
      }

      getDecks(searchTerm).catch(() => {
        showErrorToast("Error finding decks.")
      })
    }, [searchTerm])

    const goToDeckAdd = (deck: Deck) => {
      navigation.navigate(AppRoutes.DECK_ADD, { deck: deck })
    }

    return (
      <Screen style={$root}>
        <View style={$content_container}>
          <Header title={"Premade decks"}></Header>

          <TextField
            containerStyle={{ marginBottom: spacing.size120, paddingHorizontal: spacing.size160 }}
            value={searchTerm}
            placeholder="Search"
            LeftAccessory={(props) => (
              <Icon
                containerStyle={props.style}
                color={custom_colors.foreground3}
                icon="search"
                size={24}
              ></Icon>
            )}
            onChangeText={setSearchTerm}
          ></TextField>

          {/*           <ScrollView
            contentContainerStyle={{
              gap: 12,
              backgroundColor: "green",
            }}
            style={{
              paddingHorizontal: spacing.size160,
              marginBottom: spacing.size160,
              flexShrink: 1,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {["Featured", "SAT", "English", "Spanish"].map((text, index) => {
              return (
                <View key={text} style={{ height: 42 }}>
                  <CustomTag
                    onPress={() => setSelectedTag(text)}
                    selected={text === selectedTag}
                    text={text}
                  ></CustomTag>
                </View>
              )
            })}
          </ScrollView> */}
          {loading ? (
            <Loading></Loading>
          ) : (
            <FlatList
              style={{}}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: 12,
                // padding: 2,

                marginHorizontal: 16,
                paddingBottom: spacing.size200,
              }}
              data={decks}
              renderItem={({ item, index }) => (
                <Card
                  style={{ elevation: 0 }}
                  key={item.id}
                  onPress={() => goToDeckAdd(item)}
                  ContentComponent={
                    <View
                      style={{
                        paddingVertical: spacing.size80,
                        paddingHorizontal: spacing.size120,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: spacing.size80,
                          marginBottom: spacing.size20,
                        }}
                      >
                        {item?.icon && (
                          <Image
                            style={{ height: 22, width: 22 }}
                            source={{
                              uri: item?.icon,
                            }}
                          />
                        )}
                        <CustomText style={{ marginBottom: spacing.size80 }} preset="body1">
                          {item?.title}
                        </CustomText>
                      </View>
                      <CustomText style={{ marginBottom: spacing.size80 }} preset="caption2">
                        {item?.private_global_flashcards?.length} cards
                      </CustomText>
                      {item?.description ? (
                        <CustomText
                          presetColors={"secondary"}
                          style={{ marginBottom: spacing.size80 }}
                          preset="caption1"
                        >
                          {item?.description}
                        </CustomText>
                      ) : null}
                      {/*  <CustomText
                      preset="caption1Strong"
                      style={{
                        marginBottom: spacing.size40,
                        color: custom_colors.background1,
                        backgroundColor: custom_colors.brandBackground1,
                        paddingHorizontal: spacing.size80,
                        paddingVertical: spacing.size40,
                        borderRadius: borderRadius.corner80,
                      }}
                    >
                      Premium
                    </CustomText> */}
                    </View>
                  }
                ></Card>
              )}
            ></FlatList>
          )}
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  // flex: 1,
}

const $content_container: ViewStyle = {
  height: "100%",
}
