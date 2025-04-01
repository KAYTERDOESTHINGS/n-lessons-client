import useFetch from "./useFetch.ts";
import { lessonController } from "../controllers/lessonController.ts";
import { categoryController } from "../controllers/categoryController.ts";
import { mediaController } from "../controllers/mediaController.ts";

const useApi = () => {
  const { fetchApi, loading } = useFetch();

  const media = mediaController(fetchApi);
  const lesson = lessonController(fetchApi);
  const category = categoryController(fetchApi);

  return {
    media,
    lesson,
    category,
    loading,
  };
};

export default useApi;
