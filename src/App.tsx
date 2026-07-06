import AppLayout from "./components/AppLayout";
import { LoadingProvider } from "./context/LoadingProvider";
import "./App.css";

const App = () => {
  return (
    <LoadingProvider>
      <AppLayout />
    </LoadingProvider>
  );
};

export default App;
