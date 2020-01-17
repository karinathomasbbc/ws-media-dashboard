import React from "react";
import "./App.css";
import styled from "styled-components";

const AppWrapper = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

function App() {
  return <AppWrapper></AppWrapper>;
}

export default App;
