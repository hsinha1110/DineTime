import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import { restaurants } from "../../store/restaurants";
const Home = () => {
  const router = useRouter();
  // const [restaurants, setRestaurants] = useState<any[]>([]);

  const temp = async () => {
    const value = await AsyncStorage.getItem("isGuest");
    const email = await AsyncStorage.getItem("userEmail");
    console.log(value, email);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/restaurants/${item.name}`)}
      className="bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg p-4 mx-4 shadow-md"
    >
      <Image
        resizeMode="cover"
        source={{ uri: item.image }}
        className="h-28 mt-2 mb-1 rounded-lg"
      />
      <Text className="text-white text-lg font-bold mb-2">{item.name}</Text>
      <Text className="text-white text-base mb-2">{item.address}</Text>
      <Text className="text-white text-base mb-2">
        Open: {item.opening} - Close: {item.closing}
      </Text>
    </TouchableOpacity>
  );

  // 🔹 Replace Firebase with dummy static data
  // const getRestaurants = async () => {
  //   const dummyData = [
  //     {
  //       id: "1",
  //       name: "The Spice House",
  //       image:
  //         "https://images.unsplash.com/photo-1555992336-cbfdb0b55c9c?w=800",
  //       address: "123 Main Street",
  //       opening: "10:00 AM",
  //       closing: "10:00 PM",
  //     },
  //     {
  //       id: "2",
  //       name: "Ocean Breeze",
  //       image:
  //         "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800",
  //       address: "456 Beach Road",
  //       opening: "09:00 AM",
  //       closing: "11:00 PM",
  //     },
  //     {
  //       id: "3",
  //       name: "Mountain Dine",
  //       image:
  //         "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  //       address: "789 Hill View",
  //       opening: "08:00 AM",
  //       closing: "09:00 PM",
  //     },
  //   ];
  //   setRestaurants(dummyData);
  // };

  // useEffect(() => {
  //   getRestaurants();
  //   temp();
  // }, []);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 55 },
        Platform.OS == "ios" && { paddingBottom: 20 },
      ]}
    >
      <View className="flex items-center">
        <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg justify-between items-center flex flex-row p-2">
          <View className="flex flex-row">
            <Text
              className={`text-base h-10
                ${Platform.OS == "ios" ? "pt-[8px]" : "pt-1"}
               align-middle text-white`}
            >
              {" "}
              Welcome to{" "}
            </Text>
            <Image resizeMode="cover" className={"w-20 h-12"} source={logo} />
          </View>
        </View>
      </View>
      <ScrollView stickyHeaderIndices={[0]}>
        <ImageBackground
          resizeMode="cover"
          className="mb-4 w-full bg-[#2b2b2b] h-52 items-center justify-center"
          source={banner}
        >
          <BlurView
            intensity={Platform.OS === "android" ? 100 : 25}
            tint="dark"
            className="w-full p-4 shadow-lg"
          >
            <Text className="text-center text-3xl font-bold text-white">
              Dine with your loved ones
            </Text>
          </BlurView>
        </ImageBackground>
        <View className="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-white mr-2 font-semibold">
            Special Discount %
          </Text>
        </View>
        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating color={"#fb9b33"} />
        )}
        <View className="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-[#fb9b33] mr-2 font-semibold">
            Our Restaurants
          </Text>
        </View>
        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating color={"#fb9b33"} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Home;
