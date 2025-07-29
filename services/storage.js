import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key) => {
  const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
};

export const saveData = async (key, data) => {
  const jsonValue = JSON.stringify(data);
  await AsyncStorage.setItem(key, jsonValue);
};