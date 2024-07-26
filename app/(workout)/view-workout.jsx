import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'


const ViewWorkout = () => {
  const workout = useLocalSearchParams();
  return (
    <View>
      <Text>ViewWorkout</Text>
    </View>
  )
}

export default ViewWorkout