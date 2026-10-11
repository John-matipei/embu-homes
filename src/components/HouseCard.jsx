import React from "react";
import {
  BedDouble,
  MapPin,
  ArrowUpRight,
  Calendar,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HouseCard({ house }) {
  // Format WhatsApp number
  const whatsappNumber = house.phone
    ? "254" + house.phone.replace(/\D/g, "").replace(/^0/, "")
    : "";

  return (
    <article className="house-card">
      {/* Image Link */}
      <Link to={`/houses/${house.id}`} className="house-image">
        <img
          src={house.image || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={house.title}
          loading="lazy"
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

      {/* Content */}
      <div className="house-body">
        <div className="house-type">{house.type}</div>

        <Link to={`/houses/${house.id}`}>
          <h3>{house.title}</h3>
        </Link>

        <div className="house-location">
          <MapPin size={15} />
          <span>{house.estate}, Embu</span>
        </div>

        <div className="house-meta">
          <span>
            <BedDouble size={16} />
            {house.rooms} {house.rooms === 1 ? "room" : "rooms"}
          </span>
          <span>{house.distance}</span>
        </div>

        <div className="house-bottom">
          <div>
            <small>Monthly rent</small>
            <strong>KSh {Number(house.rent).toLocaleString()}</strong>
          </div>

          <Link to={`/houses/${house.id}`} className="view-link">
            View
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="house-actions">
          {house.status === "Vacant" && (
            <Link
              to={`/booking/${house.id}`}
              className="btn-book"
            >
              <Calendar size={14} />
              Book Viewing
            </Link>
          )}

          {house.phone && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone size={14} />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      <style>{`
        .house-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .house-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .house-image {
          position: relative;
          display: block;
          height: 235px;
          overflow: hidden;
          background: #dce7df;
        }

        .house-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s ease;
        }

        .house-card:hover .house-image img {
          transform: scale(1.05);
        }

        .status {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .status.vacant {
          color: #126336;
          background: #dff5e5;
        }

        .status.occupied {
          color: #8a3e31;
          background: #f8e3de;
        }

        .image-arrow {
          position: absolute;
          right: 14px;
          bottom: 14px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          color: white;
          background: rgba(8, 35, 19, 0.75);
          border-radius: 50%;
          opacity: 0;
          transform: translateY(6px);
          transition: 0.2s ease;
        }

        .house-card:hover .image-arrow {
          opacity: 1;
          transform: translateY(0);
        }

        .house-body {
          padding: 20px;
        }

        .house-type {
          color: #176b3a;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .house-body h3 {
          margin: 6px 0 9px;
          font-size: 19px;
          letter-spacing: -0.025em;
          color: #111827;
          transition: color 0.2s;
        }

        .house-body h3:hover {
          color: #176b3a;
        }

        .house-location {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #68736c;
          font-size: 12px;
        }

        .house-meta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 15px 0;
          margin-top: 14px;
          border-top: 1px solid #edf0ed;
          border-bottom: 1px solid #edf0ed;
        }

        .house-meta span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #68736c;
          font-size: 11px;
        }

        .house-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-top: 16px;
        }

        .house-bottom small {
          display: block;
          margin-bottom: 2px;
          color: #89938d;
          font-size: 9px;
        }

        .house-bottom strong {
          color: #111827;
          font-size: 18px;
          font-weight: 700;
        }

        .view-link {
          color: #176b3a;
          font-size: 12px;
          font-weight: 900;
        }

        /* Action Buttons */
        .house-actions {
          display: flex;
          gap: 8px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #edf0ed;
        }

        .btn-book,
        .btn-whatsapp {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-book {
          background: #176b3a;
          color: white;
        }

        .btn-book:hover {
          background: #0d5a30;
        }

        .btn-whatsapp {
          background: #25d366;
          color: white;
        }

        .btn-whatsapp:hover {
          background: #128c7e;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .house-image {
            height: 200px;
          }

          .house-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </article>
  );
}