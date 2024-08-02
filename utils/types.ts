import { ListRenderItemInfo } from "react-native";

export interface MyListRenderItemInfo<ItemT> extends ListRenderItemInfo<ItemT> {
  item: ItemT;
}
