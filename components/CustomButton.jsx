import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      className={`bg-primary px-5 py-2.5 items-center rounded-lg ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text className={`text-white font-gbold text-cbody ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
