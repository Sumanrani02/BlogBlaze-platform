import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
const BlazeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={""} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default BlazeRoutes;
