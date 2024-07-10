import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";

const DateToggle = ({ day, isSelected, handlePress }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${
        isSelected ? "bg-secondary" : "bg-white"
      } w-9 h-9 rounded-[18px] flex justify-center items-center`}
    >
      <Text
        className={`${
          isSelected ? "text-white font-gbold" : "text-gray font-gmedium"
        } text-cbody`}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
};

const DateSelecter = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [daysSelected, setDaysSelected] = useState([]);

  const handleToggleDay = (day) => {
    if (daysSelected.includes(day)) {
      setDaysSelected(daysSelected.filter((d) => d !== day));
    } else {
      setDaysSelected([...daysSelected, day]);
    }
  };

  return (
    <FlatList
      data={daysOfWeek}
      keyExtractor={(item) => item}
      renderItem={({ item: day }) => (
        <DateToggle
          day={day.charAt(0)}
          isSelected={daysSelected.includes(day)}
          handlePress={() => handleToggleDay(day)}
        />
      )}
      horizontal
      contentContainerStyle={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    />
  );
};

export default DateSelecter;
