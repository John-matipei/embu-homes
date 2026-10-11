// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import {
  Building2,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { changePassword, clearAuth } from "../services/api";

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from current");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(newPassword);
      setSuccess(true);
      
      // Clear and redirect after 2 seconds
      setTimeout(() => {
        clearAuth();
        navigate("/landlord/login");
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <section className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <CheckCircle2 size={64} color="#176b3a" />
          <h1 style={{ marginTop: "20px" }}>Password Changed!</h1>
          <p>Your password has been updated successfully.</p>
          <p style={{ color: "#68736c" }}>Please login again with your new password.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Building2 size={25} />
        </div>

        <span className="eyebrow dark">SECURITY</span>
        <h1>Change Password</h1>
        
        {message && (
          <div style={{ 
            padding: "12px", 
            background: "#fef3c7", 
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px",
            color: "#92400e"
          }}>
            {message}
          </div>
        )}

        <p className="muted">
          You must change your default password before continuing.
        </p>

        <form onSubmit={submit}>
          <label>
            Current Password
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          <label>
            New Password
            <div className="password-field">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                minLength={8}
              />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          <label>
            Confirm New Password
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-large full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : (
              <>
                <LockKeyhole size={18} />
                Update Password
              </>
            )}
          </button>
        </form>

        <Link to="/landlord/login" className="back-link centered-link">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </section>
  );
}