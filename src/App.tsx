import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useGlobalContext } from "./components/config/GlobalProvider";
import { PAGE_CONFIG } from "./components/config/PageConfig";
import { useEffect } from "react";
import { setStorageData } from "./services/storages";
import { LOCAL_STORAGE } from "./services/constant";

const App = () => {
  const { apiKey, setApiKey } = useGlobalContext();

  useEffect(() => {
    setStorageData(
      LOCAL_STORAGE.API_KEY,
      "MiT71gV0fqbQmrhuSD5nWezgxwJe99tUBfwk9GNfM28cxyKyGy2ZwkjrDZx4iQRghVe1r6yHOsDAvfWpiYnNGJxdudFE7rqSYHIL9mrdQs8SRwKIljV1tzJmRXeovxxS"
    );
    setApiKey(
      "MiT71gV0fqbQmrhuSD5nWezgxwJe99tUBfwk9GNfM28cxyKyGy2ZwkjrDZx4iQRghVe1r6yHOsDAvfWpiYnNGJxdudFE7rqSYHIL9mrdQs8SRwKIljV1tzJmRXeovxxS"
    );
  }, []);

  const PAGE_CONFIG_FILTERED = Object.values(PAGE_CONFIG).filter(
    (item: any) => item.path && item.element
  );

  return (
    <BrowserRouter>
      <Routes>
        {apiKey ? (
          <>
            {PAGE_CONFIG_FILTERED.map(({ path, element }: any) => (
              <Route key={path} path={path} element={element} />
            ))}
          </>
        ) : (
          <></>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
