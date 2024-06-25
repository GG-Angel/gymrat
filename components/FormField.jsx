import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import Eye from "../assets/icons/eye.svg";
import EyeHide from "../assets/icons/eyeHide.svg";

const FormField = ({
  Icon,
  iconSize,
  title,
  value,
  placeholder,
  handleChangeText,
  containerStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`gap-y-2 ${containerStyles}`}>
      <View className="flex-row items-center gap-x-2">
        {Icon && ( // render icon if provided
          <View className="w-[15px] h-[15px] flex items-center justify-center">
            <Icon width={iconSize} height={iconSize} />
          </View>
        )}
        <Text className="text-csub font-gsemibold text-secondary">{title}</Text>
      </View>

      <View className="flex-row w-full py-3 px-4 space-x-4 items-center bg-white rounded-lg border-2 border-white focus:border-secondary">
        <TextInput
          className="flex-1 text-secondary font-gregular text-body"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#6A6A6A"} // 25%
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <View className="w-[15px] h-[15px] flex items-center justify-center">
              {!showPassword ? (
                <Eye width={13.41} height={9.38} />
              ) : (
                <EyeHide width={13.47} height={11.84} />
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
