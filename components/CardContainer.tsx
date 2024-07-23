import { View, Text } from 'react-native'
import React from 'react'

interface CardContainerProps {
  children: React.ReactNode,
  containerStyles?: string
}

const CardContainer = ({ children, containerStyles }: CardContainerProps) => {
  return (
    <View className={`bg-white p-4 rounded-xl ${containerStyles}`}>
      {children}
    </View>
  )
}

export default CardContainer