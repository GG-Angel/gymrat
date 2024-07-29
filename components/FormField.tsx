import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import React, { useState } from "react";

import Eye from "../assets/icons/eye.svg";
import EyeHide from "../assets/icons/eyeHide.svg";
import { SvgProps } from "react-native-svg";

interface FormFieldProps {
  Icon?: React.FC<SvgProps>;
  iconSize?: number;
  iconInsideField?: boolean;
  title: string;
  value?: string;
  placeholder?: string;
  handleChangeText: (newValue: string) => void;
  containerStyles?: string;
  autoComplete?: TextInputProps["autoComplete"];
}

const FormField = ({
  Icon,
  iconSize,
  iconInsideField,
  title,
  value,
  placeholder,
  handleChangeText,
  containerStyles,
  autoComplete,
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>(value || "");

  return (
    <View className={`${title && "gap-y-2"} ${containerStyles}`}>
      {title && (
        <View className="flex-row items-center gap-x-2">
          {Icon && !iconInsideField && (
            <View className="w-[15px] h-[15px] flex items-center justify-center">
              <Icon width={iconSize} height={iconSize} />
            </View>
          )}
          <Text className="text-csub font-gsemibold text-secondary">
            {title}
          </Text>
        </View>
      )}

      <View className="flex-row w-full py-3 px-4 space-x-3 items-center bg-white rounded-lg">
        {Icon && iconInsideField && (
          <View className="w-[15px] h-[15px] flex items-center justify-center">
            <Icon width={iconSize} height={iconSize} />
          </View>
        )}
        <TextInput
          className="flex-1 text-secondary font-gregular text-body"
          value={localValue}
          placeholder={placeholder}
          placeholderTextColor="#6A6A6A" // 25%
          onChangeText={(v) => setLocalValue(v)}
          onBlur={() => handleChangeText(localValue)}
          secureTextEntry={title === "Password" && !showPassword}
          autoComplete={autoComplete || "off"}
          hitSlop={{
            top: 16,
            bottom: 16,
            left: iconInsideField ? 48 : 24,
            right: 24,
          }}
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
