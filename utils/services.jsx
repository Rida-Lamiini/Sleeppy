import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("Data stored successfully:", key, value);
  } catch (e) {
    console.error("Error storing data:", e);
  }
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log("Data retrieved successfully:", key, value);
      return value;
    }
  } catch (e) {
    console.error("Error retrieving data:", e);
  }
  return null;
};

export default {
  storeData,
  getData,
};
