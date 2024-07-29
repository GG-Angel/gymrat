import { View, Text } from 'react-native'
import React from 'react'
import { SvgProps } from "react-native-svg";

import { icons } from "../../constants"
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

interface TabIconProps {
  Icon: React.FC<SvgProps>;
  iconSize: number;
  color: string;
}

const TabIcon = ({ Icon, iconSize, color }: TabIconProps) => {  
  return (
    <View className="w-8 h-8 flex justify-center items-center">
      <Icon 
        width={iconSize}
        height={iconSize}
        color={color}
      />
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#1D1D1F",
          tabBarInactiveTintColor: "#BABABA",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E7E7E7",
            height: 76,
          }
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon 
                Icon={icons.tabHome}
                iconSize={24.53}
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="stats"
          options={{
            title: "Stats",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon 
                Icon={icons.tabStats}
                iconSize={24.53}
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="goals"
          options={{
            title: "Goals",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon 
                Icon={icons.tabGoals}
                iconSize={24.53}
                color={color}
              />
            )
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <TabIcon 
                Icon={icons.tabProfile}
                iconSize={24.53}
                color={color}
              />
            )
          }}
        />
      </Tabs>
      <StatusBar style="dark" />
    </>
  )
}

export default TabsLayout;