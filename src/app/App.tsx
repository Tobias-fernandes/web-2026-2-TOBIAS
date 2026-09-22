import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui";
import { AppProviders } from "./providers";
import { AppRoutes } from "./routes";

const App = () => {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
        <Toaster />
      </AppProviders>
    </BrowserRouter>
  );
};

export { App };
