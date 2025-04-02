import * as CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import forge from "node-forge";
import { API_CONFIG, MIME_TYPES } from "./constant";

const extractPrivateKey = (keyString: string): string => {
  const beginMarker = "-----BEGIN PRIVATE KEY-----";
  const endMarker = "-----END PRIVATE KEY-----";
  const trimmedKey = keyString.trim();

  if (trimmedKey.startsWith(beginMarker) && trimmedKey.endsWith(endMarker)) {
    const beginLength = beginMarker.length;
    const endLength = endMarker.length;
    const keyContent = trimmedKey
      .substring(beginLength, trimmedKey.length - endLength)
      .trim();
    return keyContent;
  }

  return trimmedKey;
};

const decryptWithRSA = ({ encryptedData, privateKeyStr }: any) => {
  try {
    const privateKeyBytes = forge.util.decode64(
      extractPrivateKey(privateKeyStr)
    );

    const privateKey = forge.pki.privateKeyFromAsn1(
      forge.asn1.fromDer(forge.util.createBuffer(privateKeyBytes))
    );

    const encryptedBytes = forge.util.decode64(encryptedData);

    const decryptedBytes = privateKey.decrypt(
      encryptedBytes,
      "RSAES-PKCS1-V1_5"
    );

    const decryptedData = forge.util.decodeUtf8(decryptedBytes);

    return decryptedData;
  } catch (error) {
    return null;
  }
};

const getCurrentDate = () => {
  const now = new Date();
  const formatter = now
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/\//g, "/");
  return formatter.replace(",", "");
};

const getCurrentDate_2 = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}${month}${year}.${hours}${minutes}${seconds}`;
};

const convertUtcToVn = (date: string) => {
  try {
    const [datePart, timePart] = date.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    );
    const vnDate = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(utcDate);

    const getPart = (type: string) =>
      vnDate.find((p) => p.type === type)?.value || "00";
    return `${getPart("day")}/${getPart("month")}/${getPart("year")} ${getPart(
      "hour"
    )}:${getPart("minute")}:${getPart("second")}`;
  } catch (error) {
    return null;
  }
};

const encrypt = (value: any, secretKey: any) => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

const decrypt = (encryptedValue: any, secretKey: any) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const decryptData = (secretKey: string, item: any, fields: string[]) => {
  const decryptedItem = { ...item };

  fields.forEach((field) => {
    const keys = field.split(".");
    let current = decryptedItem;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }

    const finalKey = keys[keys.length - 1];
    if (current[finalKey]) {
      current[finalKey] = decryptAES(current[finalKey], secretKey);
    }
  });

  return decryptedItem;
};

const encryptAES = (plainText: string, secretKey: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      plainText,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  } catch (error) {
    console.error(error);
    return "";
  }
};

const decryptAES = (encryptedStr: string, secretKey: string): string | null => {
  try {
    let decrypted = CryptoJS.AES.decrypt(
      encryptedStr,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error(error);
  }
  return null;
};

const generateUniqueId = () => {
  return uuidv4();
};

const truncateString = (str: any, limit: any) => {
  try {
    if (str.length > limit) {
      return str.slice(0, limit) + "...";
    }
    return str;
  } catch (ignored) {
    return str;
  }
};

const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const getMediaImage = (url: string) => {
  return `${API_CONFIG.API_URL}/v1/media/download/${url}`;
};

const getRoles = (authorities: string[]) => {
  return authorities.map((role) => role.replace(/^ROLE_/, ""));
};

const getEnumItem = (map: any, value: number) =>
  Object.values(map).find((item: any) => item.value === value) ?? {
    label: "Không xác định",
    className: "bg-gray-700 text-gray-300",
  };

const getNestedValue = (obj: any, path: string, defaultValue = "") => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
};

// yyyy-mm-dd to dd/mm/yyyy hh:mm:ss
// Chuyển từ yyyy-mm-dd [hh:mm:ss] sang dd/mm/yyyy hh:mm:ss
const formatToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return "";
    }

    const formattedDate = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;

    if (timePart) {
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      if (
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59
      ) {
        return `${formattedDate} ${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return "";
    }

    return `${formattedDate} 00:00:00`;
  } catch (error) {
    return "";
  }
};

// dd/mm/yyyy hh:mm:ss to yyyy-mm-dd
const parseToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return "";
    }

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    if (timePart) {
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      if (
        hours >= 0 &&
        hours <= 23 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59
      ) {
        return `${formattedDate} ${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
    }
    return formattedDate;
  } catch (error) {
    return "";
  }
};

// Function to parse dd/mm/yyyy hh:mm:ss format to Date object
const parseDate = (dateStr: any) => {
  try {
    const [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Validate ranges
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      return null;
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
  } catch (ignored) {
    return null;
  }
};

const validateDateTime = (dateTimeStr: any) => {
  try {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    const match = dateTimeStr.match(regex);

    if (!match) return null;

    const [_, day, month, year, hours, minutes, seconds] = match.map(Number);

    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day ||
      date.getHours() !== hours ||
      date.getMinutes() !== minutes ||
      date.getSeconds() !== seconds
    ) {
      return null;
    }

    return dateTimeStr;
  } catch (ignored) {
    return null;
  }
};

const truncateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  try {
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
      return "";
    }
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  } catch (error) {
    return "";
  }
};

const getMimeType = (fileName: string) => {
  const extension = `.${fileName.split(".").pop()?.toLowerCase() || ""}`;
  return (MIME_TYPES as any)[extension] || "application/octet-stream";
};

const parseDocuments = (documentString: string) => {
  try {
    return JSON.parse(documentString);
  } catch (error) {
    return [];
  }
};

export {
  encrypt,
  decrypt,
  getCurrentDate,
  generateUniqueId,
  truncateString,
  getCurrentDate_2,
  isValidURL,
  getMediaImage,
  getRoles,
  getEnumItem,
  getNestedValue,
  convertUtcToVn,
  formatToDDMMYYYY,
  parseToYYYYMMDD,
  parseDate,
  truncateToDDMMYYYY,
  validateDateTime,
  decryptWithRSA,
  encryptAES,
  decryptAES,
  decryptData,
  getMimeType,
  parseDocuments,
};
