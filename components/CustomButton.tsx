import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";

interface CustomButtonProps {
  title: string;
  style: "primary" | "secondary";
  handlePress?: () => void;
  containerStyles?: string;
  textStyles?: string;
  disabled?: boolean;
}

const CustomButton = ({
  title,
  style,
  handlePress,
  containerStyles,
  textStyles,
  disabled,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={`${style === "secondary" ? "bg-secondary" : "bg-primary"} px-5 py-2.5 items-center rounded-lg ${containerStyles} ${
        disabled && "opacity-50"
      }`}
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text className={`text-white font-gbold text-cbody ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
