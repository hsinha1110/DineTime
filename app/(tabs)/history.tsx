import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const History = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };
    fetchUserEmail();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);

    if (userEmail) {
      // 🔹 Dummy bookings (Firebase removed)
      const dummyBookings = [
        {
          id: "1",
          date: "2025-08-20",
          slot: "7:00 PM - 9:00 PM",
          guests: 4,
          restaurant: "Olive Garden",
          email: userEmail,
        },
        {
          id: "2",
          date: "2025-08-25",
          slot: "8:00 PM - 10:00 PM",
          guests: 2,
          restaurant: "Domino’s Pizza",
          email: userEmail,
        },
      ];
      setBookings(dummyBookings);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [userEmail]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <Text className="text-white">Loading....</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      {userEmail ? (
        <FlatList
          data={bookings}
          onRefresh={fetchBookings}
          refreshing={loading}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 border-b border-[#fb9b33]">
              <Text className="text-white">Date: {item.date}</Text>
              <Text className="text-white">Slot: {item.slot}</Text>
              <Text className="text-white">Guests: {item.guests}</Text>
              <Text className="text-white">Restaurant: {item.restaurant}</Text>
              <Text className="text-white">Email: {item.email}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-center color-[#f49b33]">
            Please sign in to view your booking history
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/signin")}
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"
          >
            <Text className="text-lg font-semibold text-center">Sign In</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;
