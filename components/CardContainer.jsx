import { View, Text } from 'react-native'
import React from 'react'

const CardContainer = ({ children, containerStyles }) => {
  return (
    <View className={`bg-white p-4 rounded-[10px] ${containerStyles}`}>
      {children}
    </View>
  )
}

export default CardContainer