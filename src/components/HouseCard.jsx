import React from "react";

import {
  BedDouble,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

export default function HouseCard({
  house,
}) {

  return (
    <article className="house-card">

      <Link
        to={`/houses/${house.id}`}
        className="house-image"
      >

        <img
          src={house.image}
          alt={house.title}
        />

        <span
          className={
            house.status === "Vacant"
              ? "status vacant"
              : "status occupied"
          }
        >
          {house.status}
        </span>

        <span className="image-arrow">
          <ArrowUpRight size={18} />
        </span>

      </Link>

      <div className="house-body">

        <div className="house-type">
          {house.type}
        </div>

        <Link
          to={`/houses/${house.id}`}
        >
          <h3>
            {house.title}
          </h3>
        </Link>

        <div className="house-location">

          <MapPin size={15} />

          <span>
            {house.estate}, Embu
          </span>

        </div>

        <div className="house-meta">

          <span>
            <BedDouble size={16} />

            {house.rooms}{" "}
            {house.rooms === 1
              ? "room"
              : "rooms"}
          </span>

          <span>
            {house.distance}
          </span>

        </div>

        <div className="house-bottom">

          <div>
            <small>
              Monthly rent
            </small>

            <strong>
              KSh{" "}
              {Number(
                house.rent
              ).toLocaleString()}
            </strong>
          </div>

          <Link
            to={`/houses/${house.id}`}
            className="view-link"
          >
            View
          </Link>

        </div>

      </div>

    </article>
  );
}