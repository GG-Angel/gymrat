import { ListRenderItemInfo } from "react-native";

export interface MyListRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  item: ItemT;
}

export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

