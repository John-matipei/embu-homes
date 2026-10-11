// LandlordDashboard.jsx
import React, { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Plus,
  Trash2,
  XCircle,
  Loader2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteHouse as apiDeleteHouse,
  updateHouse as apiUpdateHouse,
} from "../services/api";

export default function LandlordDashboard({ houses, onRefresh }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const email =
    localStorage.getItem("esh_landlord_email") || "landlord@embu.com";

  // Filter houses belonging to this landlord
  const mine = houses.filter(
    (house) =>
      house.landlordEmail === email ||
      house.landlord === "Demo Landlord" ||
      !house.landlordEmail
  );

  const toggleAvailability = async (house) => {
    setUpdatingId(house.id);
    setError("");

    try {
      await apiUpdateHouse(house.id, {
        status: house.status === "Vacant" ? "Occupied" : "Vacant",
      });

      await onRefresh();
    } catch (err) {
      setError(err.message || "Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeHouse = async (house) => {
    if (
      !window.confirm(`Delete "${house.title}"? This action cannot be undone.`)
    ) {
      return;
    }

    setDeletingId(house.id);
    setError("");

    try {
      await apiDeleteHouse(house.id);
      await onRefresh();
    } catch (err) {
      setError(err.message || "Failed to delete property. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // View bookings for specific house
  const viewHouseBookings = (houseId) => {
    navigate(`/landlord/bookings?houseId=${houseId}`);
  };

  // View all bookings
  const viewAllBookings = () => {
    navigate("/landlord/bookings");
  };

  const vacantCount = mine.filter((h) => h.status === "Vacant").length;
  const occupiedCount = mine.filter((h) => h.status === "Occupied").length;

  return (
    <section className="section page-section">
      <div className="container">
        {/* Header */}
        <div className="dashboard-head">
          <div>
            <span className="eyebrow dark">LANDLORD DASHBOARD</span>
            <h1>Welcome back</h1>
            <p>{email}</p>
          </div>

          <div className="dashboard-head-actions">
            <button onClick={viewAllBookings} className="btn btn-outline">
              <Calendar size={18} />
              View Bookings
            </button>
            <Link to="/landlord/add" className="btn btn-primary">
              <Plus size={18} />
              Add property
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="dashboard-error">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError("")}>×</button>
          </div>
        )}

        {/* Stats */}
        <div className="dashboard-stats">
          <div>
            <Building2 />
            <strong>{mine.length}</strong>
            <span>Total listings</span>
          </div>
          <div>
            <CheckCircle2 />
            <strong>{vacantCount}</strong>
            <span>Vacant</span>
          </div>
          <div>
            <XCircle />
            <strong>{occupiedCount}</strong>
            <span>Occupied</span>
          </div>
        </div>

        {/* Properties Table */}
        <div className="dashboard-table-wrap">
          <div className="table-heading">
            <h2>Your properties</h2>
            <span>Update availability whenever a room is taken.</span>
          </div>

          {mine.map((house) => (
            <div className="property-row" key={house.id}>
              <img src={house.image} alt={house.title} />

              <div className="property-main">
                <strong>{house.title}</strong>
                <span>
                  {house.estate} · KSh {Number(house.rent).toLocaleString()} / month
                </span>
              </div>

              <span
                className={
                  house.status === "Vacant" ? "status vacant" : "status occupied"
                }
              >
                {house.status}
              </span>

              {/* Actions */}
              <div className="row-actions">
                {/* View Bookings Button */}
                <button
                  title="View bookings"
                  className="bookings-btn"
                  onClick={() => viewHouseBookings(house.id)}
                >
                  <Calendar size={17} />
                </button>

                {/* Toggle Availability */}
                <button
                  title="Toggle availability"
                  onClick={() => toggleAvailability(house)}
                  disabled={updatingId === house.id || deletingId === house.id}
                  className={updatingId === house.id ? "loading" : ""}
                >
                  {updatingId === house.id ? (
                    <Loader2 size={17} className="spin" />
                  ) : house.status === "Vacant" ? (
                    <XCircle />
                  ) : (
                    <CheckCircle2 />
                  )}
                </button>

                {/* Delete */}
                <button
                  title="Delete"
                  className="danger"
                  onClick={() => removeHouse(house)}
                  disabled={updatingId === house.id || deletingId === house.id}
                >
                  {deletingId === house.id ? (
                    <Loader2 size={17} className="spin" />
                  ) : (
                    <Trash2 />
                  )}
                </button>
              </div>
            </div>
          ))}

          {!mine.length && (
            <div className="empty">
              <p>You have no listings yet.</p>
              <Link to="/landlord/add" className="btn btn-primary">
                Add your first property
              </Link>
            </div>
          )}
        </div>

        {/* View All Bookings Section */}
        <div className="bookings-section">
          <div className="bookings-card">
            <div>
              <h3>Manage Bookings</h3>
              <p>View and manage all student viewing requests for your properties.</p>
            </div>
            <button onClick={viewAllBookings} className="btn btn-primary">
              View All Bookings
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-head-actions {
          display: flex;
          gap: 12px;
        }

        .dashboard-error {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #b91c1c;
          font-size: 14px;
        }

        .dashboard-error button {
          margin-left: auto;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #b91c1c;
          font-size: 18px;
          cursor: pointer;
        }

        .dashboard-error button:hover {
          background: #fee2e2;
        }

        .row-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .row-actions button {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          background: white;
          border: 1px solid #dce4de;
          border-radius: 10px;
          color: #176b3a;
          cursor: pointer;
          transition: all 0.2s;
        }

        .row-actions button:hover:not(:disabled) {
          background: #e9f6ed;
        }

        .row-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .row-actions button.loading {
          color: #176b3a;
        }

        .row-actions .danger {
          color: #dc2626;
          border-color: #fecaca;
        }

        .row-actions .danger:hover:not(:disabled) {
          background: #fef2f2;
        }

        .row-actions .bookings-btn {
          color: #2563eb;
          border-color: #dbeafe;
        }

        .row-actions .bookings-btn:hover {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .property-row img {
          width: 75px;
          height: 58px;
          object-fit: cover;
          border-radius: 10px;
          background: #e5e7eb;
        }

        /* Bookings Section */
        .bookings-section {
          margin-top: 30px;
        }

        .bookings-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px;
          background: linear-gradient(135deg, #e9f6ed 0%, #d1fae5 100%);
          border: 1px solid #a7f3d0;
          border-radius: 16px;
        }

        .bookings-card h3 {
          margin: 0 0 8px;
          color: #065f46;
          font-size: 20px;
        }

        .bookings-card p {
          margin: 0;
          color: #047857;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .dashboard-head {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-head-actions {
            width: 100%;
          }

          .dashboard-head-actions .btn {
            flex: 1;
          }

          .bookings-card {
            flex-direction: column;
            text-align: center;
          }

          .bookings-card .btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}