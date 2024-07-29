import { View, Text } from 'react-native'
import React from 'react'
import { Images } from "../constants";

interface DividerProps {
  containerStyles?: string
}

const Divider = ({ containerStyles }: DividerProps) => {
  return (
    <View className={`mt-4 mb-4 ${containerStyles}`}>
      <Images.divider width="100%" />
    </View>
  )
}

export default Divider