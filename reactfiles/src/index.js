import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import SearchSnippets from "./pages/SearchSnippets";
import CreateSnippet from "./pages/CreateSnippet";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ViewSnippet from "./pages/ViewSnippet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/searchsnippets",
        element: <SearchSnippets />,
      },
      {
        path: "/createsnippet",
        element: <CreateSnippet />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/viewsnippet/:snippetTitle",
        element: <ViewSnippet />,
      },
    ],
  },
]);

// const jsxrouter = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={<App />} path="/">
//       <Route element={<Home />} path="/home"></Route>
//     </Route>
//   )
// );

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
