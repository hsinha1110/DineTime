import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RestaurantDetails = () => {
  const { restaurants } = useLocalSearchParams();
  return (
    <SafeAreaView>
      <Text>{restaurants}</Text>
    </SafeAreaView>
  );
};

export default RestaurantDetails;
