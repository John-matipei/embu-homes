//FROM HELLO WORLD TO A REAL PROGRAM INDEED YOU DID IT TO ME THANK YOU GOD
import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";
import HouseCard from "../components/HouseCard";

export default function Home({ houses }) {
  const vacant = houses.filter((h) => h.status === "Vacant");
  const featured = vacant.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              STUDENT LIVING · EMBU COUNTY
            </span>

            <h1>
              Find a place you’ll be happy to{" "}
              <span>call home.</span>
            </h1>

            <p>
              Discover vacant houses, bedsitters and hostels around
              the University of Embu with rent, distance, amenities
              and landlord contacts in one place.
            </p>

            <div className="hero-actions">
              <Link
                to="/houses"
                className="btn btn-primary btn-large"
              >
                <Search size={19} />
                Find a house
              </Link>

              <Link
                to="/landlord/login"
                className="btn btn-glass btn-large"
              >
                List your property
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="trust-row">
              <span>
                <CheckCircle2 size={17} />
                Vacancy information
              </span>

              <span>
                <Building2 size={17} />
                Landlord portal
              </span>

              <span>
                <MapPin size={17} />
                Embu locations
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats">
          <div>
            <strong>{vacant.length}</strong>
            <span>Vacant listings</span>
          </div>

          <div>
            <strong>
              {new Set(houses.map((h) => h.estate)).size}
            </strong>
            <span>Estates</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Online access</span>
          </div>

          <div>
            <strong>Free</strong>
            <span>For students to search</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">
                LATEST LISTINGS
              </span>

              <h2>Popular student homes</h2>

              <p>
                Start with these available properties around
                University of Embu.
              </p>
            </div>

            <Link className="text-link" to="/houses">
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="house-grid">
            {featured.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
              />
            ))}
          </div>

          {!featured.length && (
            <div className="empty">
              No vacant houses have been listed yet.
            </div>
          )}
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow dark">
              HOW IT WORKS
            </span>

            <h2>
              Simple for students. Useful for landlords.
            </h2>
          </div>

          <div className="steps">
            <Step
              icon={<Search />}
              title="Search"
              text="Filter by estate, house type, rent and vacancy."
            />

            <Step
              icon={<Building2 />}
              title="Compare"
              text="Check photos, amenities, distance and house details."
            />

            <Step
              icon={<PhoneIcon />}
              title="Contact"
              text="Get the landlord contact and arrange a viewing."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function Step({ icon, title, text }) {
  return (
    <div className="step">
      <span className="step-icon">
        {icon}
      </span>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="6"
        y="2"
        width="12"
        height="20"
        rx="2"
      />

      <path d="M11 18h2" />
    </svg>
  );
}