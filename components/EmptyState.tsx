import { View, Text } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import { SvgProps } from 'react-native-svg'

interface EmptyStateProps {
  Image: React.FC<SvgProps>;
  headerText: string;
  subheadText: string;
  buttonTitle?: string;
  buttonHandlePress?: () => void;
}

const EmptyState = ({
  Image,
  headerText,
  subheadText,
  buttonTitle,
  buttonHandlePress,
}: EmptyStateProps) => {
  return (
    <View className="w-full h-full flex justify-center">
      <Image className="mb-4" />
      <View className="space-y-1">
        <Text className="text-ch2 font-gsemibold text-secondary">
          {headerText}
        </Text>
        <Text className="text-cbody font-gregular text-gray">
          {subheadText}
        </Text>
      </View>
      { (buttonTitle && buttonHandlePress) && (
        <CustomButton 
          title={buttonTitle}
          style="primary"
          handlePress={buttonHandlePress}
          containerStyles="mt-4"
        />
      ) }
    </View>
  )
}

export default EmptyState