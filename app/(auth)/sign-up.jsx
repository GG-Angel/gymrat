import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

const SignUp = () => {
  const handleSubmit = () => {
    router.replace("/home")
  }

  return (
    <SafeAreaView className="bg-white-100 h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ height: "100%", paddingHorizontal: 32 }}
        >
          <View className="flex-1 justify-center items-center">
            <View className="w-full flex-row justify-between">
              <Text className="text-secondary font-gbold text-ch1">Sign Up</Text>
              <View className="w-10 h-10 flex justify-center items-center">
                <icons.dumbbell width={33.29} height={33.31} />
              </View>
            </View>
            <View className="w-full my-6">
              <FormField title="Username" placeholder="Enter username" />
              <FormField
                title="Email"
                placeholder="Enter email"
                containerStyles="mt-4"
              />
              <FormField
                title="Password"
                placeholder="Enter password"
                containerStyles="mt-4"
              />
            </View>
            <CustomButton
              title="Sign Up"
              handlePress={handleSubmit}
              containerStyles="w-full"
            />
            <View className="justify-center mt-4 flex-row gap-x-1">
              <Text className="text-secondary font-gsemibold text-body">
                Have an account?
              </Text>
              <Link
                href="/log-in"
                className="text-primary font-gsemibold text-body"
              >
                Log In
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
