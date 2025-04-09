import "./lib/config"; // 确保这行在最前面
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Web3ReactHooks, Web3ReactProvider, initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import Home from "./components/pages/Home";
import Mint from "./components/pages/Mint";
import Gallery from "./components/pages/Gallery";
import Profile from "./components/pages/Profile";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "next-themes";

// 将 connector 初始化移到组件外部，确保引用稳定
const [metaMask, hooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions })
);

// 将 connectors 数组定义为常量
const CONNECTORS = [[metaMask, hooks]] as const;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "mint", element: <Mint /> },
      { path: "gallery", element: <Gallery /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <div>404 Not Found</div> }
    ],
  },
]);

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Web3ReactProvider connectors={CONNECTORS as [[MetaMask, Web3ReactHooks]]}>
        <RouterProvider router={router} />
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
