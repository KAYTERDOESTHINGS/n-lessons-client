import { BookIcon } from "lucide-react";
import Category from "../../pages/category/Category";
import Lesson from "../../pages/lesson/Lesson";
import CreateLesson from "../../pages/lesson/CreateLesson";
import UpdateLesson from "../../pages/lesson/UpdateLesson";

const CATEGORY_CONFIG = {
  CATEGORY: {
    name: "category",
    label: "Danh mục",
    path: "/category",
    element: <Category />,
  },
  CREATE_CATEGORY: {
    label: "Thêm mới danh mục",
  },
  UPDATE_CATEGORY: {
    label: "Cập nhật danh mục",
  },
  DELETE_CATEGORY: {
    label: "Xóa danh mục",
  },
};

const LESSON_CONFIG = {
  LESSON: {
    name: "lesson",
    label: "Bài học",
    path: "/lesson",
    element: <Lesson />,
  },
  CREATE_LESSON: {
    label: "Thêm mới bài học",
    path: "/lesson/create",
    element: <CreateLesson />,
  },
  UPDATE_LESSON: {
    label: "Cập nhật bài học",
    path: "/lesson/update/:id",
    element: <UpdateLesson />,
  },
  DELETE_LESSON: {
    label: "Xóa bài học",
  },
};

const PAGE_CONFIG = { ...CATEGORY_CONFIG, ...LESSON_CONFIG };

const SIDEBAR_MENUS = [
  {
    name: "Quản lý tài liệu",
    icon: <BookIcon size={16} />,
    items: [PAGE_CONFIG.LESSON, PAGE_CONFIG.CATEGORY],
  },
];

export { PAGE_CONFIG, SIDEBAR_MENUS };
