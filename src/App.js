import logo from "./logo.svg";
import "./App.css";
import { HashRouter } from "react-router-dom";
import SideBar from "./components/SideBar";

function App() {
  return (
    <div className="flex">
      <HashRouter>
        <SideBar />
      </HashRouter>
    </div>
  );
}

export default App;
