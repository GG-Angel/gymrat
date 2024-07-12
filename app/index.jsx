import { ScrollView, Text, View } from "react-native";
import React, { useEffect } from "react";
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../components/FormField";

import { icons } from "../constants";
import { router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView className="bg-white-100 h-full">
      <ScrollView
        contentContainerStyle={{ height: "100%", paddingHorizontal: 32 }}
      >
        <View className="h-full justify-center items-center">
          <CustomButton
            title="This is a Button"
            handlePress={() => {}}
            containerStyles="w-full"
          />
          <FormField
            title="Example Form"
            Icon={icons.dumbbell}
            iconSize={17.48}
            placeholder="Placeholder text"
            containerStyles="mt-2"
          />

          <Text className="text-secondary text-ch1 font-gbold mt-4 w-full">
            H1 Text
          </Text>
          <Text className="text-secondary text-ch2 font-gsemibold mt-4 w-full">
            H2 Text
          </Text>
          <Text className="text-secondary text-csub font-gregular mt-4 w-full">
            Subhead Text
          </Text>
          <Text className="text-secondary text-cbody font-gregular mt-4 w-full">
            Body Text
          </Text>
          <Text className="text-secondary text-ctri font-gregular mt-4 w-full">
            Trieciary Text
          </Text>

          <CustomButton
            title="Go to Screen"
            handlePress={() => router.push("/test")}
            containerStyles="w-full mt-10"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
