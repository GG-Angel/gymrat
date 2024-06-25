import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

const LogIn = () => {
  const handleSubmit = () => {
    router.replace("/home");
  };

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
              <Text className="text-secondary font-gbold text-ch1">Log In</Text>
              <View className="w-10 h-10 flex justify-center items-center">
                <icons.dumbbell width={33.29} height={33.31} />
              </View>
            </View>
            <View className="w-full my-6">
              <FormField title="Email" placeholder="Enter email" />
              <FormField
                title="Password"
                placeholder="Enter password"
                containerStyles="mt-4"
              />
            </View>
            <CustomButton
              title="Sign In"
              handlePress={handleSubmit}
              containerStyles="w-full"
            />
            <View className="justify-center mt-4 flex-row gap-x-1">
              <Text className="text-secondary font-gsemibold text-body">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-primary font-gsemibold text-body"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogIn;
