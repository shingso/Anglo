import { Subscription, SubscriptionSnapshotIn } from "../models/Subscription"
import { supabase } from "../services/supabase/supabase"

//get the subscription state

export enum Subscription_Fields {
  ID = "id",
  CREATED_AT = "created_at",
  START_DATE = "start_date",
  END_DATE = "end_date",
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
  }
}

export const getSubscription = async (): Promise<SubscriptionSnapshotIn> => {
  try {
    let { data, error } = await supabase.from("subscription").select("*")
    console.log("subscription", data, error)
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

export const cancelSubscription = async (subscriptionId): Promise<any> => {
  const { data, error } = await supabase.functions.invoke("cancelSubscription", {
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
    console.log("products", data, error)
    if (data && data?.length > 0) {
      return data
    }
    return null
  } catch (error) {}
  return null
}

//always fetch the subscription state and reload it every time to ensure it has the most recent information
//the only way the subscription state gets updated is througn the webhook
//we should ensure an entry exists and if it doesnt for some reason then create it
