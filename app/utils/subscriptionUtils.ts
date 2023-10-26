import { Subscription, SubscriptionSnapshotIn } from "../models/Subscription"
import { supabase } from "../services/supabase/supabase"

//get the subscription state

export enum Subscription_Fields {
  ID = "id",
  CREATED_AT = "created_at",
  START_DATE = "start_date",
  END_DATE = "end_date",
  SUBSCRIPTION_ID = "subscription_id",
  CANCEL_AT_END = "cancel_at_end",
}

export const mapToSubscription = (subscription: Subscription): SubscriptionSnapshotIn => {
  return {
    [Subscription_Fields.ID]: subscription?.id ? subscription.id : undefined,
    [Subscription_Fields.CREATED_AT]: subscription?.created_at
      ? new Date(subscription?.created_at)
      : undefined,
    [Subscription_Fields.START_DATE]: subscription?.start_date
      ? new Date(subscription?.start_date)
      : undefined,
    [Subscription_Fields.END_DATE]: subscription?.end_date
      ? new Date(subscription?.end_date)
      : undefined,
    [Subscription_Fields.SUBSCRIPTION_ID]: subscription?.subscription_id
      ? subscription?.subscription_id
      : undefined,
    [Subscription_Fields.CANCEL_AT_END]: !!subscription?.cancel_at_end,
  }
}

export const getSubscription = async (): Promise<SubscriptionSnapshotIn> => {
  try {
    let { data, error } = await supabase.from("subscription").select("*")
    if (data && data?.length > 0) {
      return mapToSubscription(data[0])
    }
    return {}
  } catch (error) {}
  return {}
}

export const processProductPayment = async (productId: string, userId: string): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("stripePayment", {
    body: JSON.stringify({ productId: productId, userId: userId }),
  })
  console.log(data, error)
  return data
}

export const processSubscriptionPayment = async (userId: string): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("stripeSubscription", {
    body: JSON.stringify({ userId: userId }),
  })
  console.log(data, error)
  return data
}

export const cancelSubscription = async (subscriptionId: string): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("cancelSubscription", {
    body: JSON.stringify({ subscriptionId: subscriptionId }),
  })
  console.log(data, error)
  return data
}

export const reactivateSubscription = async (subscriptionId: string): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("reactivateSubscription", {
    body: JSON.stringify({ subscriptionId: subscriptionId }),
  })
  console.log(data, error)
  return data
}

export interface Product {
  price: number
  id: number
  description?: string
  deck_id?: string
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    let { data, error } = await supabase.from("products").select("*")
    if (data && data?.length > 0) {
      return data
    }
    return null
  } catch (error) {}
  return null
}

export const getProductExistsByProductId = async (productId: string): Promise<Boolean> => {
  try {
    let { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("deck_id", productId)
    return !!count
  } catch (error) {}
  return false
}

export const getPaidFlashcardsCountByDeckId = async (deck_id: string) => {
  let { count, error } = await supabase
    .from("private_global_flashcards")
    .select("*", { count: "exact" })
    .eq("deck_id", deck_id)
    .eq("free", false)
  return count
}

export const getPaidFlashcardsPreview = async (deck_id: string) => {
  try {
    let { data, error } = await supabase
      .from("private_global_flashcards")
      .select("id, front")
      .limit(20)
      .eq("deck_id", deck_id)
      .eq("free", false)
    console.log(data, error)
    return data
  } catch (error) {
    return null
  }
}

//always fetch the subscription state and reload it every time to ensure it has the most recent information
//the only way the subscription state gets updated is througn the webhook
//we should ensure an entry exists and if it doesnt for some reason then create it
