import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoading((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        const next = prev + Math.max(1, Math.round(Math.random() * 5));
        return next >= 100 ? 100 : next;
      });
    }, 120);

    const timer = window.setTimeout(() => {
      setLoading(100);
    }, 2200);

    const completeTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
      window.clearTimeout(completeTimer);
    };
  }, [isLoading]);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
