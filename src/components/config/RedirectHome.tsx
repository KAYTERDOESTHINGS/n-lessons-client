import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SIDEBAR_MENUS } from "./PageConfig";

const RedirectHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(SIDEBAR_MENUS[0].items[0].path);
  }, []);

  return null;
};

export default RedirectHome;
