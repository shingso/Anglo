// we always make sure 'react-native' gets included first
import * as ReactNative from "react-native"
import mockFile from "./mockFile"

// libraries to mock
jest.doMock("react-native", () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      Image: {
        ...ReactNative.Image,
        resolveAssetSource: jest.fn((_source) => mockFile), // eslint-disable-line @typescript-eslint/no-unused-vars
        getSize: jest.fn(
          (
            uri: string, // eslint-disable-line @typescript-eslint/no-unused-vars
            success: (width: number, height: number) => void,
            failure?: (_error: any) => void, // eslint-disable-line @typescript-eslint/no-unused-vars
          ) => success(100, 100),
        ),
      },
    },
    ReactNative,
  )
})

const mockedNavigate = jest.fn()
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})

/* jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
    }),
  }
})
 */
const mockStripe = {
  confirmPayment: jest.fn(),
  presentPaymentSheet: jest.fn(),
}

const mockPlatformPay = {
  isPlatformPaySupported: jest.fn(),
  confirmPlatformPayPayment: jest.fn(),
}
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
)

jest.mock("i18n-js", () => ({
  currentLocale: () => "en",
  t: (key: string, params: Record<string, string>) => {
    return `${key} ${JSON.stringify(params)}`
  },
}))

jest.mock("@stripe/stripe-react-native", () => ({
  StripeProvider: jest.fn(({ children }) => children),
  CardField: jest.fn(() => null),
  presentPaymentSheet: jest.fn(),
  initPaymentSheet: jest.fn(),
  usePlatformPay: jest.fn(() => mockPlatformPay),
  useStripe: jest.fn(() => mockStripe),
}))

declare const tron // eslint-disable-line @typescript-eslint/no-unused-vars

jest.useFakeTimers()
declare global {
  let __TEST__
}
