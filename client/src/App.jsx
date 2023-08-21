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
    uri: "https://book-engine-mern-21-5febe54c7a0c.herokuapp.com/graphql",
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
