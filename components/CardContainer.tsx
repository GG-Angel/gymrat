import { View } from 'react-native'
import React from 'react'

interface CardContainerProps {
  children?: React.ReactNode,
  containerStyles?: string
}

const CardContainer = ({ children, containerStyles }: CardContainerProps) => {
  return (
    <View 
      className={`bg-white p-4 rounded-xl ${containerStyles}`}
      style={{
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2
      }}
    >
      {children}
    </View>
  )
}

export default CardContainer