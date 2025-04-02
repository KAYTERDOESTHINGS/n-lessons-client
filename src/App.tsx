import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useGlobalContext } from "./components/config/GlobalProvider";
import { PAGE_CONFIG } from "./components/config/PageConfig";
import RedirectHome from "./components/config/RedirectHome";
import LessonClient from "./pages/client/LessonClient";

const App = () => {
  const { apiKey } = useGlobalContext();

  const PAGE_CONFIG_FILTERED = Object.values(PAGE_CONFIG).filter(
    (item: any) => item.path && item.element
  );

  return (
    <BrowserRouter>
      <Routes>
        {apiKey ? (
          <>
            <Route path="/" element={<RedirectHome />} />
            {PAGE_CONFIG_FILTERED.map(({ path, element }: any) => (
              <Route key={path} path={path} element={element} />
            ))}
          </>
        ) : (
          <>
            <Route path="/" element={<LessonClient />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
