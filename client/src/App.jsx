import "./App.css";
import { Outlet } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import Navbar from "./components/Navbar.jsx";

const getToken = () => {
  
  return localStorage.getItem('id_token');
};

function App() {
  const token = getToken();

  const client = new ApolloClient({
    uri: "http://localhost:3001/graphql",
    credentials: 'include', 
    headers: {
      Authorization: token ? `Bearer ${token}` : console.error("errort"), 
    },
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
