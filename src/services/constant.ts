const MIME_TYPES = {
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".bmp": "image/bmp",

  // Videos
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".m3u8": "application/x-mpegURL",
  ".ts": "video/mp2t",

  // Soundtracks
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",

  // Documents
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".xml": "application/xml",
  ".md": "text/markdown",
  ".html": "text/html",
};

const API_CONFIG = {
  API_URL: "https://n-lessons.onrender.com",
  X_API_KEY: "x-api-key",
};

const LOCAL_STORAGE = {
  STORAGE_KEY: import.meta.env.VITE_STORAGE_KEY,
  COLLAPSED_GROUPS: "n_lessons_collapsed_groups",
  API_KEY: "n_lessons_api_key",
};

const METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const TOAST = {
  SUCCESS: "success",
  ERROR: "error",
  WARN: "warning",
};

const ALIGNMENT = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
};

const BASIC_MESSAGES = {
  INVALID_FORM: "Vui lòng kiểm tra lại thông tin",
  VERIFY_FAILED: "Xác thực thất bại",
  SUCCESS: "Yêu cầu thành công",
  FAILED: "Yêu cầu thất bại",
  CREATED: "Thêm thành công",
  UPDATED: "Cập nhật thành công",
  DELETED: "Xóa thành công",
  NO_DATA: "Không có dữ liệu",
};

const BUTTON_TEXT = {
  SUBMIT: "Xác nhận",
  CONTINUE: "Tiếp tục",
  SEARCH: "Tìm kiếm",
  REFRESH: "Làm mới",
  CREATE: "Thêm mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  CANCEL: "Hủy",
  BACK: "Trở về",
};

const ITEMS_PER_PAGE = 20;

export {
  LOCAL_STORAGE,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  TOAST,
  MIME_TYPES,
  API_CONFIG,
  METHOD,
  ALIGNMENT,
  ITEMS_PER_PAGE,
};
