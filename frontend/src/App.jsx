import React from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useState } from "react";

const App = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <div>
      {toggle ? (
        <Register setToggle={setToggle} />
      ) : (
        <Login setToggle={setToggle} />
      )}
    </div>
  );
};

export default App;
