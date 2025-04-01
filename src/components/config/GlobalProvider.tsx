import {
  createContext,
  SetStateAction,
  useContext,
  Dispatch,
  useState,
  useEffect,
} from "react";
import { LOCAL_STORAGE, TOAST } from "../../services/constant";
import { getStorageData, setStorageData } from "../../services/storages";
import { toast } from "react-toastify";

const GlobalContext = createContext<{
  setToast: (msg: string | null, type?: any) => void;
  apiKey: any;
  setApiKey: Dispatch<SetStateAction<any>>;
  collapsedGroups: { [key: string]: boolean };
  setCollapsedGroups: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}>({
  setToast: () => {},
  apiKey: null,
  setApiKey: () => {},
  collapsedGroups: {},
  setCollapsedGroups: () => {},
});

export const GlobalProvider = ({ children }: any) => {
  const [collapsedGroups, setCollapsedGroups] = useState(
    getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, {})
  );
  const [apiKey, setApiKey] = useState<any>(
    getStorageData(LOCAL_STORAGE.API_KEY, null)
  );

  useEffect(() => {
    setStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, collapsedGroups);
  }, [collapsedGroups]);

  const setToast = (
    msg: string | null,
    type: "success" | "error" | "warn" = "success"
  ) => {
    if (!msg) return;
    switch (type) {
      case TOAST.SUCCESS:
        toast.success(msg);
        break;
      case TOAST.ERROR:
        toast.error(msg);
        break;
      case TOAST.WARN:
        toast.warn(msg);
        break;
      default:
        toast.info(msg);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        collapsedGroups,
        setCollapsedGroups,
        setToast,
        apiKey,
        setApiKey,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
