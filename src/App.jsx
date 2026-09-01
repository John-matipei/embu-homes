import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/home";
import Houses from "./pages/house";
import HouseDetails from "./pages/houseDetails";
import LandlordLogin from "./pages/LandlordLogin";
import LandlordDashboard from "./pages/LandlordDashboard";
import AddHouse from "./pages/AddHouse";
import NotFound from "./pages/NotFound";

import {
  getHouses,
} from "./data";

export default function App() {
  const [houses, setHouses] = useState(
    getHouses()
  );

  const refreshHouses = () => {
    setHouses(getHouses());
  };

  return (
    <BrowserRouter>
      <div className="app">

        <Navbar />

        <main>
          <Routes>

            <Route
              path="/"
              element={
                <Home houses={houses} />
              }
            />

            <Route
              path="/houses"
              element={
                <Houses houses={houses} />
              }
            />

            <Route
              path="/houses/:id"
              element={
                <HouseDetails
                  houses={houses}
                />
              }
            />

            <Route
              path="/landlord/login"
              element={
                <LandlordLogin />
              }
            />

            <Route
              path="/landlord"
              element={
                <LandlordDashboard
                  houses={houses}
                  onRefresh={
                    refreshHouses
                  }
                />
              }
            />

            <Route
              path="/landlord/add"
              element={
                <AddHouse
                  onSaved={
                    refreshHouses
                  }
                />
              }
            />

            <Route
              path="*"
              element={
                <NotFound />
              }
            />

          </Routes>
        </main>

        <footer className="footer">
          <div className="container footer-inner">

            <div>
              <strong>
                Embu Student Homes
              </strong>

              <p>
                Find affordable student
                accommodation around
                University of Embu.
              </p>
            </div>

            <div>
              <span>
                © {new Date().getFullYear()}
                {" "}Embu Student Homes
              </span>
            </div>

          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}