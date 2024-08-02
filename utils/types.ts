import { ListRenderItemInfo } from "react-native";

export interface MyRenderItemProps<ItemT> extends ListRenderItemInfo<ItemT> {
  item: ItemT;
}