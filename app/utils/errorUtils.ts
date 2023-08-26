import Toast from "react-native-toast-message"

export const showErrorToast = (text1: string, text2?: string) => {
  Toast.show({
    type: "error",
    text1: text1,
    text2: text2,
    topOffset: 80,
  })
}

export const showSuccessToast = (text1: string, text2?: string) => {
  Toast.show({
    type: "success",
    text1: text1,
    text2: text2,
    topOffset: 80,
  })
}

export const showDefaultToast = (text1: string, text2?: string) => {
  Toast.show({
    type: "default",
    text1: text1,
    text2: text2,
    topOffset: 80,
  })
}
