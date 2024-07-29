import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

import { Icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";

type FormState = {
  email: string;
  password: string;
}

const LogIn = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: ""
  });

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
                <Icons.dumbbell width={33.29} height={33.31} />
              </View>
            </View>
            <View className="w-full my-6">
              <FormField 
                title="Email" 
                placeholder="Enter email" 
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                autoComplete="email"
              />
              <FormField
                title="Password"
                placeholder="Enter password"
                value={form.password}
                handleChangeText={(p) => setForm({ ...form, password: p })}
                containerStyles="mt-4"
                autoComplete="current-password"
              />
            </View>
            <CustomButton
              title="Sign In"
              style="primary"
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
