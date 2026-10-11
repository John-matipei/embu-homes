import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Calendar, Phone, Mail, User, MessageSquare,
  Home, Clock, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getBookings, updateBooking } from "../services/api";

export default function LandlordBookings({ houses }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const houseIdFilter = searchParams.get("houseId");
  
  // Get logged in landlord
  const landlordEmail = localStorage.getItem("esh_landlord_email") || "landlord@embu.com";
  
  // SECURITY: Only get this landlord's houses
  const myHouses = houses.filter(h => 
    h.landlordEmail === landlordEmail || 
    h.landlord === "My Listing" ||
    h.landlord === "Demo Landlord" ||
    !h.landlordEmail
  );
  
  const myHouseIds = myHouses.map(h => h.id);

  useEffect(() => {
    // Check login
    const session = localStorage.getItem("esh_landlord_session");
    if (!session) {
      navigate("/landlord/login");
      return;
    }
    loadBookings();
  }, [navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Loading bookings...");
      console.log("My house IDs:", myHouseIds);
      
      // Get ALL bookings from server
      const allBookings = await getBookings();
      console.log("All bookings from API:", allBookings);
      
      // SECURITY: Only show bookings for THIS landlord's houses
      const myBookings = allBookings.filter(b => {
        const isMine = myHouseIds.includes(b.houseId);
        console.log(`Booking ${b.id} for house ${b.houseId}: isMine=${isMine}`);
        return isMine;
      });
      
      // Filter by specific house if requested
      const filtered = houseIdFilter 
        ? myBookings.filter(b => b.houseId === houseIdFilter)
        : myBookings;
      
      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log("Filtered bookings:", filtered);
      setBookings(filtered);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBooking(bookingId, { status: newStatus });
      await loadBookings();
    } catch (err) {
      setError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "#fef3c7", color: "#92400e", text: "Pending" },
      confirmed: { bg: "#d1fae5", color: "#065f46", text: "Confirmed" },
      cancelled: { bg: "#fee2e2", color: "#991b1b", text: "Declined" },
      completed: { bg: "#dbeafe", color: "#1e40af", text: "Completed" }
    };
    const style = styles[status] || styles.pending;
    return (
      <span style={{
        padding: "6px 14px",
        background: style.bg,
        color: style.color,
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "uppercase"
      }}>
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <section className="section page-section">
        <div className="container">
          <p>Loading bookings...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-section">
      <div className="container">
        {/* Header */}
        <div className="page-heading">
          <div>
            <span className="eyebrow dark">MY BOOKINGS</span>
            <h1>Who Booked My Properties</h1>
            <p>Students who requested to view your houses</p>
          </div>
          <Link to="/landlord" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="form-error" style={{ marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Summary Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "30px"
        }}>
          {[
            { label: "Total", count: bookings.length, color: "#176b3a" },
            { label: "Pending", count: bookings.filter(b => b.status === "pending").length, color: "#f59e0b" },
            { label: "Confirmed", count: bookings.filter(b => b.status === "confirmed").length, color: "#10b981" },
            { label: "Completed", count: bookings.filter(b => b.status === "completed").length, color: "#3b82f6" },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: "20px",
              background: "white",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid #e5e7eb"
            }}>
              <strong style={{ fontSize: "32px", color: stat.color }}>{stat.count}</strong>
              <span style={{ color: "#68736c", fontSize: "14px" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Calendar size={64} color="#d1d5db" />
            <h3 style={{ margin: "20px 0 10px" }}>No bookings yet</h3>
            <p style={{ color: "#68736c" }}>
              {houseIdFilter 
                ? "No one has booked this property yet."
                : "Students haven't requested viewings for any of your properties."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {bookings.map(booking => {
              const house = houses.find(h => h.id === booking.houseId);
              
              return (
                <div key={booking.id} style={{
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden"
                }}>
                  {/* Student Info Header */}
                  <div style={{
                    padding: "20px 24px",
                    background: "#176b3a",
                    color: "white"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <User size={20} />
                      <h3 style={{ margin: 0, fontSize: "18px" }}>{booking.name}</h3>
                    </div>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
                      Wants to view your property • {getStatusBadge(booking.status)}
                    </p>
                  </div>

                  <div style={{ padding: "24px" }}>
                    {/* Contact Info */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "20px",
                      marginBottom: "24px",
                      paddingBottom: "24px",
                      borderBottom: "1px solid #e5e7eb"
                    }}>
                      <div>
                        <span style={{ fontSize: "12px", color: "#89938d", textTransform: "uppercase" }}>
                          Phone Number
                        </span>
                        <p style={{ margin: "4px 0 0" }}>
                          <a href={`tel:${booking.phone}`} style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#176b3a",
                            textDecoration: "none"
                          }}>
                            {booking.phone}
                          </a>
                        </p>
                      </div>
                      
                      {booking.email && (
                        <div>
                          <span style={{ fontSize: "12px", color: "#89938d", textTransform: "uppercase" }}>
                            Email
                          </span>
                          <p style={{ margin: "4px 0 0" }}>
                            <a href={`mailto:${booking.email}`} style={{
                              fontSize: "14px",
                              color: "#2563eb",
                              textDecoration: "none"
                            }}>
                              {booking.email}
                            </a>
                          </p>
                        </div>
                      )}
                      
                      {booking.studentId && (
                        <div>
                          <span style={{ fontSize: "12px", color: "#89938d", textTransform: "uppercase" }}>
                            Student ID
                          </span>
                          <p style={{ margin: "4px 0 0", fontFamily: "monospace", fontSize: "14px" }}>
                            {booking.studentId}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <span style={{ fontSize: "12px", color: "#89938d", textTransform: "uppercase" }}>
                          Requested Date
                        </span>
                        <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: "600" }}>
                          {new Date(booking.preferredDate).toLocaleDateString("en-KE", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Property Info */}
                    {house && (
                      <div style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        marginBottom: "20px",
                        padding: "15px",
                        background: "#f8faf9",
                        borderRadius: "12px"
                      }}>
                        <img 
                          src={house.image} 
                          alt={house.title}
                          style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div>
                          <span style={{ fontSize: "12px", color: "#176b3a", fontWeight: "700" }}>
                            PROPERTY THEY WANT TO VIEW
                          </span>
                          <h4 style={{ margin: "4px 0 2px", fontSize: "16px" }}>{house.title}</h4>
                          <p style={{ margin: 0, color: "#68736c", fontSize: "13px" }}>
                            {house.estate} • KSh {Number(house.rent).toLocaleString()}/month
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    {booking.message && (
                      <div style={{
                        padding: "16px 20px",
                        background: "#f8faf9",
                        borderRadius: "10px",
                        borderLeft: "3px solid #176b3a",
                        marginBottom: "20px"
                      }}>
                        <span style={{ fontSize: "12px", color: "#89938d" }}>
                          <MessageSquare size={12} style={{ marginRight: "6px" }} />
                          MESSAGE FROM STUDENT:
                        </span>
                        <p style={{ margin: "8px 0 0", fontStyle: "italic", color: "#374151" }}>
                          "{booking.message}"
                        </p>
                      </div>
                    )}

                    {/* Requested Time */}
                    {booking.preferredTime && (
                      <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "12px", color: "#89938d" }}>
                          <Clock size={12} style={{ marginRight: "6px" }} />
                          Preferred time: {booking.preferredTime}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {booking.status === "pending" && (
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          onClick={() => updateStatus(booking.id, "confirmed")}
                          disabled={updatingId === booking.id}
                          style={{
                            flex: 1,
                            padding: "12px 24px",
                            background: "#176b3a",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer"
                          }}
                        >
                          {updatingId === booking.id ? "Updating..." : "Confirm Booking"}
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "cancelled")}
                          disabled={updatingId === booking.id}
                          style={{
                            flex: 1,
                            padding: "12px 24px",
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer"
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Booking Date */}
                    <p style={{ 
                      margin: "20px 0 0", 
                      fontSize: "12px", 
                      color: "#89938d",
                      textAlign: "right"
                    }}>
                      Requested on {new Date(booking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}