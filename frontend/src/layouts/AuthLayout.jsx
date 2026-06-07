import React, { useState } from "react";
import Register from "../pages/Register";
import Login from "../pages/Login";

const AuthLayout = () => {
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

export default AuthLayout;
