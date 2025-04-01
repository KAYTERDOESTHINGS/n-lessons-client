import { LOCAL_STORAGE } from "./constant";
import { decrypt, encrypt } from "./utils";

const initializeStorage = (storageKey: string, defaultValue: any) => {
  const data = JSON.stringify(defaultValue);
  localStorage.setItem(storageKey, encrypt(data, LOCAL_STORAGE.STORAGE_KEY));
  return defaultValue;
};

const getStorageData = (key: string, defaultValue: any = null) => {
  let data = null;
  try {
    data = decrypt(localStorage.getItem(key), LOCAL_STORAGE.STORAGE_KEY);
  } catch (ignored) {}

  if (!data) {
    return initializeStorage(key, defaultValue);
  }

  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (err) {
    return initializeStorage(key, defaultValue);
  }
};

const setStorageData = (key: string, value: any) => {
  const data = encrypt(JSON.stringify(value), LOCAL_STORAGE.STORAGE_KEY);
  localStorage.setItem(key, data);
};

const removeSessionCache = () => {
  localStorage.removeItem(LOCAL_STORAGE.API_KEY);
};

export { getStorageData, setStorageData, removeSessionCache };
