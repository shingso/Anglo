import { supabase } from "../services/supabase/supabase"

export enum User_Fields {
  ID = "id",
  AGE = "age",
  EDUCATION_LEVEL = "education_level",
  NEW_PER_DAY = "new_per_day",
}

export interface User {
  [User_Fields.ID]?: string
  [User_Fields.AGE]?: number
  [User_Fields.EDUCATION_LEVEL]?: Education_Levels
  [User_Fields.NEW_PER_DAY]?: number
}

export enum Education_Levels {
  HIGH_SCHOOL = "high_school",
  COLLEGE = "college",
  BACHELORS = "bachlors",
  MASTERS = "masters",
}

export const updateUser = async (user: User) => {
  try {
    const { data: user_response, error } = await supabase
      .from("users")
      .update({ ...user })
      .eq("id", user.id)
      .select()

    if (!!user_response && user_response?.length > 0) {
      return user_response[0]
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
