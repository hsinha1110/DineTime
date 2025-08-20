import { db } from "@/config/firebaseConfig";
import { CarouselData, Restaurants, SlotData } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerComponent from "../../components/restaurant/DatePickerComponent";
import FindSlots from "../../components/restaurant/FindSlots";
import GuestPickerComponent from "../../components/restaurant/GuestPickerComponent";

const Restaurant = () => {
  const { restaurants } = useLocalSearchParams();
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantData, setRestaurantData] = useState<Restaurants | null>(null);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [slotsData, setSlotsData] = useState<string[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [date, setDate] = useState(new Date());
  // Fetching restaurant, carousel and slot data
   // Fetch restaurant, carousel, and slot data
  const getRestaurantData = async () => {
    try {
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurants)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.warn("No matching restaurant found.");
        return;
      }

      const doc = restaurantSnapshot.docs[0];
      const data = doc.data() as Restaurants;
      setRestaurantData(data);

      // Fetch carousel images
      const carouselQuery = query(
        collection(db, "carousels"),
        where("res_id", "==", doc.ref)
      );
      const carouselSnapshot = await getDocs(carouselQuery);

      if (carouselSnapshot.empty) {
        console.log("No matching carousel found");
        return;
      }

      const imageList: string[] = [];
      carouselSnapshot.forEach((carouselDoc) => {
        const carouselDocData = carouselDoc.data() as CarouselData;

        if (carouselDocData.images && Array.isArray(carouselDocData.images)) {
          imageList.push(...carouselDocData.images);
        }
      });
      setCarouselImages(imageList);

      // Fetch slots
      const slotsQuery = query(
        collection(db, "slots"),
        where("ref_id", "==", doc.ref)
      );
      const slotsSnapshot = await getDocs(slotsQuery);

      if (!slotsSnapshot.empty) {
        const slotDoc = slotsSnapshot.docs[0].data() as SlotData;
        setSlotsData(slotDoc.slot || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  useEffect(() => {
    getRestaurantData();
  }, []);

  // Carousel navigation
  const handleNextImage = () => {
    const total = carouselImages.length;
    const nextIndex = (currentIndex + 1) % total;
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handlePrevImage = () => {
    const total = carouselImages.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    setCurrentIndex(prevIndex);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  // Location handler
  const handleLocation = async () => {
    const url = "https://maps.app.goo.gl/TtSmNr394bVp9J8n8";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  // Render a single image in the carousel
  const carouselItem = ({ item }: { item: string }) => (
    <View style={{ width: windowWidth - 2 }} className="h-64 relative">
      {/* Navigation Arrows */}
      <View className="absolute top-1/2 right-[6%] z-10 bg-black/60 rounded-full p-2">
        <Ionicons onPress={handleNextImage} name="arrow-forward" size={24} color="white" />
      </View>
      <View className="absolute top-1/2 left-[2%] z-10 bg-black/60 rounded-full p-2">
        <Ionicons onPress={handlePrevImage} name="arrow-back" size={24} color="white" />
      </View>

      {/* Dots Indicator */}
      <View className="absolute bottom-3 left-1/2 -translate-x-1/2 flex-row items-center z-10">
        {carouselImages.map((_, i) => (
          <View
            key={i}
            className={`bg-white rounded-full mx-1 ${
              i === currentIndex ? "h-3 w-3" : "h-2 w-2"
            }`}
          />
        ))}
      </View>

      {/* Image */}
      <Image
        source={{ uri: item }}
        className="h-64 mx-2 rounded-2xl"
        style={{ backgroundColor: "black", opacity: 0.8 }}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS === "android" && { paddingBottom: 55 },
        Platform.OS === "ios" && { paddingBottom: 20 },
      ]}
    >
      <ScrollView className="h-full">
        <View className="flex-1 my-2 p-2">
          <Text className="text-xl text-[#f49b33] font-semibold">
            {restaurants}
          </Text>
          <View className="my-4 border-b border-[#f49b33]" />
        </View>

        {/* Carousel */}
        <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
          {carouselImages.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={carouselImages}
              renderItem={carouselItem}
              horizontal
              scrollEnabled={false}
              keyExtractor={(item, index) => `${index}`}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text className="text-white text-center mt-4">Loading Images...</Text>
          )}
        </View>

        {/* Address and Direction */}
        <View className="flex-row mt-4 px-2 items-start">
          <Ionicons name="location-sharp" size={24} color="#f49b33" />
          <Text className="text-white ml-2 max-w-[75%]">
            {restaurantData?.address} |{" "}
            <Text
              onPress={handleLocation}
              className="underline text-[#f49b33] italic font-semibold"
            >
              Get Direction
            </Text>
          </Text>
        </View>
                <View className="flex-1 flex-row p-2">
          <Ionicons name="time" size={20} color="#f49b33" />
          <Text className="max-w-[75%] mx-2 font-semibold text-white">
            {restaurantData?.opening} - {restaurantData?.closing}
          </Text>
        </View>
        <View className="flex-1 border m-2 p-2 border-[#f49b33] rounded-lg">
          <View className="flex-1 flex-row m-2 p-2 justify-end items-center">
            <View className="flex-1 flex-row">
              <Ionicons name="calendar" size={20} color="#f49b33" />
              <Text className="text-white mx-2 text-base">
                Select booking date
              </Text>
            </View>
            <DatePickerComponent date={date} setDate={setDate} />
          </View>
          <View className="flex-1 flex-row bg-[#474747] rounded-lg  m-2 p-2 justify-end items-center">
            <View className="flex-1 flex-row">
              <Ionicons name="people" size={20} color="#f49b33" />
              <Text className="text-white mx-2 text-base">
                Select number of guests
              </Text>
            </View>
            <GuestPickerComponent
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>
        <View className="flex-1">
          <FindSlots
            restaurant={restaurantData}
            date={date}
            selectedNumber={selectedNumber}
            slots={slotsData}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Restaurant;
