import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const placeholderFilters = [
  { title: "Chest", id: 1 },
  { title: "Shoulders", id: 2 },
  { title: "Triceps", id: 3 },
  { title: "Back", id: 4 },
  { title: "Biceps", id: 5 },
  { title: "Quads", id: 6 },
  { title: "Hamstrings", id: 7 },
  { title: "Calves", id: 8 } 
];

const Filter = ({ title }) => {
  const [isSelected, setIsSelected] = useState(false);
  const handlePress = () => {
    setIsSelected(!isSelected);
  };

  return (
    <TouchableOpacity
      className={`${
        isSelected ? "bg-primary" : "bg-white"
      } px-[10px] py-1 rounded-[10px] w-auto self-start mr-1`}
      onPress={handlePress}
    >
      <Text
        className={`${
          isSelected
            ? "text-white font-gsemibold"
            : "text-secondary font-gregular"
        } text-cbody`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const FilterBar = () => {
  return (
    <FlatList
      data={placeholderFilters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Filter title={item.title} />}
      showsHorizontalScrollIndicator={false}
      horizontal
    />
  );
};

export default FilterBar;
