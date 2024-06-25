import { View, Text } from 'react-native'
import React from 'react'

import Line from "../assets/images/divider.svg"

const Divider = ({ containerStyles }) => {
  return (
    <View className={`mt-4 mb-4 ${containerStyles}`}>
      <Line width="100%" />
    </View>
  )
}

export default Divider