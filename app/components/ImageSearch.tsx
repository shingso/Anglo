import * as React from "react"
import {
  FlatList,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageStyle,
  ActivityIndicator,
} from "react-native"
import { observer } from "mobx-react-lite"
import { colors, spacing, typography } from "../theme"
import { Text } from "./Text"
import { unsplashApi } from "../services/unsplashApi.ts/unsplashApi"
import { ComponentType, useEffect, useState } from "react"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { TextField } from "./TextField"
import { Button } from "./Button"
import Modal from "react-native-modal"
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/consts"
import { Icon } from "./Icon"
import Image from "react-native-image-progress"

import { borderRadius } from "../theme/borderRadius"
import { CustomText } from "./CustomText"

export interface ImageSearchProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  searchTerm?: string
  pressImage?: any
  inBottomSheet?: boolean
  useSelectedPicture?: Function
}

/**
 * Describe your component here
 */
export const ImageSearch = observer(function ImageSearch(props: ImageSearchProps) {
  const { style, searchTerm, pressImage, inBottomSheet, useSelectedPicture } = props
  const $styles = [style]
  const [searchPictures, setSearchPictures] = useState(null)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [selectedPicture, setSelectedPicture] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchTerm) {
      searchPicture(searchTerm)
    }
  }, [searchTerm])

  const searchPicture = async (search: string) => {
    setLoading(true)
    const searchResults = await unsplashApi.searchWords(search)
    setSearchPictures(searchResults.slice(0, 9))
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }

  const [term, setTerm] = useState("")
  const Wrapper: ComponentType<any> = inBottomSheet ? BottomSheetFlatList : FlatList

  const consumeSelectedPicture = (image: string) => {
    setShowImagePicker(false)
    resetModalState()
    useSelectedPicture(image)
  }

  const resetModalState = () => {
    setSearchPictures([])
    setSelectedPicture(null)
  }

  const closeModal = () => {
    setShowImagePicker(false)
    resetModalState()
  }

  return (
    //BottomSheetFlatList
    <View>
      <Button preset="custom_default_small" onPress={() => setShowImagePicker(true)}>
        Image
      </Button>
      <Modal avoidKeyboard={false} isVisible={showImagePicker}>
        <View style={$container}>
          <CustomText style={{ marginBottom: spacing.small }} preset="title3">
            Online image search
          </CustomText>

          <View style={$search_input_container}>
            <TextField
              containerStyle={$text_field_container}
              value={term}
              onChangeText={setTerm}
            ></TextField>
            <Button
              preset="circle_icon"
              LeftAccessory={(props) => (
                <Icon icon="search" color={colors.palette.accent100} size={20} />
              )}
              onPress={() => searchPicture(term)}
            ></Button>
          </View>
          {!!searchPictures && searchPictures.length > 0 && !loading ? (
            <Wrapper
              data={searchPictures}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => i}
              numColumns={3}
              contentContainerStyle={$content_container}
              renderItem={(i) => {
                return (
                  <TouchableOpacity onPress={() => setSelectedPicture(i.item)}>
                    <View style={$picture_container}>
                      <Image
                        style={
                          selectedPicture === i.item
                            ? [$selected_image, $search_image]
                            : $search_image
                        }
                        source={{ uri: i.item }}
                      />
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          ) : (
            <View style={$empty_container}>
              {loading ? (
                <ActivityIndicator></ActivityIndicator>
              ) : (
                <CustomText preset="caption1">
                  {searchPictures?.length === 0 ? "No Images Found" : "Enter search term above"}
                </CustomText>
              )}
            </View>
          )}

          <View style={{ flexDirection: "row" }}>
            <Button
              onPress={() => closeModal()}
              style={{ flex: 1, marginRight: 4 }}
              preset="custom_outline"
            >
              Close
            </Button>
            <Button
              onPress={() => consumeSelectedPicture(selectedPicture)}
              style={{ flex: 1, marginLeft: 4 }}
              preset="custom_default"
            >
              Add Picture
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
})

const $container: ViewStyle = {
  backgroundColor: "white",
  height: SCREEN_HEIGHT - 200,
  borderRadius: borderRadius.corner80,
  padding: spacing.medium,
}

const $selected_image: ImageStyle = {
  borderColor: colors.palette.success500,
  borderWidth: 3,
}

const $search_image: ImageStyle = {
  height: (SCREEN_WIDTH - 71) / 3,
  width: (SCREEN_WIDTH - 71) / 3,
  //borderRadius: 12,
  marginBottom: spacing.medium,
  //marginHorizontal: spacing.extraSmall,
}

const $content_container: ViewStyle = {
  marginVertical: spacing.medium,
}

const $picture_container: ViewStyle = {
  //marginRight: spacing.small,
}

const $search_input_container: ViewStyle = {
  flexDirection: "row",
  display: "flex",
  alignItems: "center",
}

const $text_field_container: ViewStyle = {
  flex: 1,
  marginRight: spacing.large,
}

const $empty_container: ViewStyle = {
  flex: 1,
  display: "flex",
  borderColor: colors.palette.neutral300,
  borderWidth: 1,
  justifyContent: "center",
  alignItems: "center",
  marginVertical: spacing.large,
}
