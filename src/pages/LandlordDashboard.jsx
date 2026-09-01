import React from "react";

import {
  Building2,
  CheckCircle2,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  deleteHouse,
  updateHouse,
} from "../data";

export default function LandlordDashboard({
  houses,
  onRefresh,
}) {

  const email =
    localStorage.getItem(
      "esh_landlord_email"
    ) || "landlord@embu.com";

  const mine = houses.filter(
    (house) =>
      house.landlordEmail === email ||
      house.landlord === "Demo Landlord" ||
      !house.landlordEmail
  );

  const toggleAvailability = (house) => {

    updateHouse(
      house.id,
      {
        status:
          house.status === "Vacant"
            ? "Occupied"
            : "Vacant",
      }
    );

    onRefresh();
  };

  const removeHouse = (house) => {

    if (
      window.confirm(
        `Delete "${house.title}"?`
      )
    ) {
      deleteHouse(house.id);
      onRefresh();
    }
  };

  return (
    <section className="section page-section">

      <div className="container">

        <div className="dashboard-head">

          <div>

            <span className="eyebrow dark">
              LANDLORD DASHBOARD
            </span>

            <h1>
              Welcome back
            </h1>

            <p>{email}</p>

          </div>

          <Link
            to="/landlord/add"
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add property
          </Link>

        </div>

        <div className="dashboard-stats">

          <div>
            <Building2 />

            <strong>
              {mine.length}
            </strong>

            <span>
              Total listings
            </span>
          </div>

          <div>
            <CheckCircle2 />

            <strong>
              {
                mine.filter(
                  (house) =>
                    house.status ===
                    "Vacant"
                ).length
              }
            </strong>

            <span>Vacant</span>
          </div>

          <div>
            <XCircle />

            <strong>
              {
                mine.filter(
                  (house) =>
                    house.status ===
                    "Occupied"
                ).length
              }
            </strong>

            <span>Occupied</span>
          </div>

        </div>

        <div className="dashboard-table-wrap">

          <div className="table-heading">

            <h2>
              Your properties
            </h2>

            <span>
              Update availability whenever
              a room is taken.
            </span>

          </div>

          {mine.map((house) => (

            <div
              className="property-row"
              key={house.id}
            >

              <img
                src={house.image}
                alt=""
              />

              <div className="property-main">

                <strong>
                  {house.title}
                </strong>

                <span>
                  {house.estate} · KSh{" "}
                  {Number(
                    house.rent
                  ).toLocaleString()}
                  {" "}/ month
                </span>

              </div>

              <span
                className={
                  house.status === "Vacant"
                    ? "status vacant"
                    : "status occupied"
                }
              >
                {house.status}
              </span>

              <div className="row-actions">

                <button
                  title="Toggle availability"
                  onClick={() =>
                    toggleAvailability(
                      house
                    )
                  }
                >
                  {house.status ===
                  "Vacant" ? (
                    <XCircle />
                  ) : (
                    <CheckCircle2 />
                  )}
                </button>

                <button
                  title="Delete"
                  className="danger"
                  onClick={() =>
                    removeHouse(house)
                  }
                >
                  <Trash2 />
                </button>

              </div>

            </div>
          ))}

          {!mine.length && (
            <div className="empty">

              <p>
                You have no listings yet.
              </p>

              <Link
                to="/landlord/add"
                className="btn btn-primary"
              >
                Add your first property
              </Link>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}