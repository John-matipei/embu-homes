import React, { useState } from "react";

import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

export default function LandlordLogin() {

  const [show, setShow] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    setError("");

    if (
      email.trim().toLowerCase() ===
        "landlord@embu.com" &&
      password === "Embu123!"
    ) {
      localStorage.setItem(
        "esh_landlord_session",
        "active"
      );

      localStorage.setItem(
        "esh_landlord_email",
        email.trim()
      );

      navigate("/landlord");
    } else {
      setError(
        "Incorrect demo credentials."
      );
    }
  };

  return (
    <section className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <Building2 size={25} />
        </div>

        <span className="eyebrow dark">
          LANDLORD PORTAL
        </span>

        <h1>
          Manage your properties
        </h1>

        <p className="muted">
          Sign in to publish houses, update
          vacancy and manage your listings.
        </p>

        <form onSubmit={submit}>

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="landlord@example.com"
              required
            />
          </label>

          <label>
            Password

            <div className="password-field">

              <input
                type={
                  show
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShow(!show)
                }
              >
                {show ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
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
          >
            <LockKeyhole size={18} />
            Secure sign in
          </button>

        </form>

        {/* <div className="demo-box">
          <strong>
            Local demo login
          </strong>

          <span>
            landlord@embu.com
          </span>

          <span>
            Embu123!
          </span>
        </div> */}

        <div className="security-line">
          <ShieldCheck size={17} />
          

          Only Authorized personel are Permited.
        </div>

        <Link
          to="/"
          className="back-link centered-link"
        >
          ← Back to website
        </Link>

      </div>
    </section>
  );
}