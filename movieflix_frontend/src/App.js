import React from "react";
import { AuthProvider } from "./utils/AuthContext";
import Routes from "./components/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "./utils/SearchContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}

export default App;
