import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "../theme"
import { Text } from "./Text"
import * as ImagePicker from "expo-image-picker"
import { Button } from "./Button"
import { useState } from "react"
import { createFormData, uploadPictureFile } from "../utils/flashcardUtils"
import { supabseStorageUrl } from "../services/supabase/supabase"

export interface LibraryImagePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  selectedImage?: any
}

/**
 * Describe your component here
 */
export const LibraryImagePicker = observer(function LibraryImagePicker(
  props: LibraryImagePickerProps,
) {
  const { style, selectedImage } = props
  const $styles = [$container, style]
  const [image, setImage] = useState(null)

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    })

    console.log(result)

    if (!result.canceled) {
      //setImage(result.uri)
      /*  if (selectedImage) {
        selectedImage(result.uri)
      }
 */
      const res = await uploadPictureFile(createFormData(result.uri))
      if (res) {
        selectedImage(supabseStorageUrl + res + ".jpg")
      }
    }
  }

  return (
    <View style={$styles}>
      <Button preset="custom_outline" onPress={() => pickImage()} text="Library"></Button>
      {/* {image && <Image source={{ uri: image }} style={$search_image} />} */}
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  flex: 1,
}

const $search_image: ImageStyle = {
  width: 120,
  height: 120,
  borderRadius: 12,
}
