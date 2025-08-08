import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState(null);

    // Load stored email on mount
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const email = await AsyncStorage.getItem("userEmail");
                setUserEmail(email);
            } catch (error) {
                console.log("Error loading email:", error);
            }
        };

        fetchUserEmail();
    }, []);

    // Logout by clearing AsyncStorage and navigating
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userEmail");
            setUserEmail(null);
            Alert.alert("Logged out", "You have been logged out successfully.");
        } catch (error) {
            Alert.alert("Logout Error", "Error while logging out");
        }
    };

    const handleSignup = () => {
    };

    return (
        <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
            <Text className="text-xl text-[#f49b33] font-semibold mb-4">
                User Profile
            </Text>

            {userEmail ? (
                <>
                    <Text className="text-white text-lg mb-6">Email: {userEmail}</Text>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="p-2 my-2 bg-[#f49b33] rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center text-black">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={handleSignup}
                        className="p-2 my-2 bg-[#f49b33] rounded-lg mt-10"
                    >
                        <Text className="text-lg font-semibold text-center text-black">
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}
