import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Divider from '../../components/Divider'

import { icons } from "../../constants"
import CardContainer from '../../components/CardContainer'

const Stats = () => {
  return (
    <SafeAreaView className="bg-white-100 h-full px-8">
      <Text className="text-secondary font-gbold text-ch1 mt-2 w-full">
        Statistics
      </Text>
      <Divider containerStyles="mb-[134px]" />
      <View className="space-y-5">
        <TouchableOpacity>
          <CardContainer containerStyles="justify-center items-center h-40 space-y-2">
            <View className="w-6 h-6">
              <icons.history width={18} height={18} />
            </View>
            <Text className="text-secondary font-gbold text-csub text-center">
              History
            </Text>
          </CardContainer>
        </TouchableOpacity>
        <TouchableOpacity>
          <CardContainer containerStyles="justify-center items-center h-40 space-y-2">
            <View className="w-6 h-6">
              <icons.dumbbell width={19.98} height={19.99} />
            </View>
            <Text className="text-secondary font-gbold text-csub text-center">
              Exercises
            </Text>
          </CardContainer>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Stats