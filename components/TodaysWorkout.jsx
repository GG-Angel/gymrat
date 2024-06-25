import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import { icons } from "../constants"
import CardContainer from './CardContainer'

const TodaysWorkout = ({
  isLoading
}) => {
  return (
    <CardContainer containerStyles="flex-row items-end space-x-6">
      <View className="flex-1">
        <Text className="text-gray font-gregular text-csub">
          Today's Workout
        </Text>
        <Text className="text-secondary font-gbold text-ch2">
          Chest, Shoulders, and Triceps
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {}}
        disabled={isLoading}
      >
        <icons.forwardCircle 
          width={34}
          height={34}
        />
      </TouchableOpacity>
    </CardContainer>
  )
}

export default TodaysWorkout