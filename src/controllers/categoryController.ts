import { useGlobalContext } from "../components/config/GlobalProvider.tsx";
import { API_CONFIG, METHOD } from "../services/constant.ts";

export const categoryController = (fetchApi: any) => {
  const { apiKey } = useGlobalContext();

  const list = () =>
    fetchApi({
      apiUrl: API_CONFIG.API_URL,
      endpoint: "/v1/category/list",
      method: METHOD.GET,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: API_CONFIG.API_URL,
      endpoint: `/v1/category/get/${id}`,
      method: METHOD.GET,
      headers: {
        [API_CONFIG.X_API_KEY]: apiKey,
      },
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: API_CONFIG.API_URL,
      endpoint: `/v1/category/create`,
      method: METHOD.POST,
      payload,
      headers: {
        [API_CONFIG.X_API_KEY]: apiKey,
      },
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: API_CONFIG.API_URL,
      endpoint: `/v1/category/update`,
      method: METHOD.PUT,
      payload,
      headers: {
        [API_CONFIG.X_API_KEY]: apiKey,
      },
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: API_CONFIG.API_URL,
      endpoint: `/v1/category/delete/${id}`,
      method: METHOD.DELETE,
      headers: {
        [API_CONFIG.X_API_KEY]: apiKey,
      },
    });

  return {
    list,
    get,
    create,
    update,
    del,
  };
};
