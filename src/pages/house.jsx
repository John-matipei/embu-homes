import React, {
  useMemo,
  useState,
} from "react";

import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import HouseCard from "../components/HouseCard";

export default function Houses({ houses }) {
  const [query, setQuery] = useState("");
  const [estate, setEstate] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("Vacant");
  const [maxRent, setMaxRent] = useState("20000");

  const [mobileFilters, setMobileFilters] =
    useState(false);

  const estates = [
    "All",
    ...new Set(houses.map((h) => h.estate)),
  ];

  const types = [
    "All",
    ...new Set(houses.map((h) => h.type)),
  ];

  const results = useMemo(() => {
    return houses.filter((house) => {
      const text = `
        ${house.title}
        ${house.estate}
        ${house.type}
        ${house.description}
      `.toLowerCase();

      return (
        text.includes(query.toLowerCase()) &&
        (estate === "All" ||
          house.estate === estate) &&
        (type === "All" ||
          house.type === type) &&
        (status === "All" ||
          house.status === status) &&
        Number(house.rent) <= Number(maxRent)
      );
    });
  }, [
    houses,
    query,
    estate,
    type,
    status,
    maxRent,
  ]);

  const resetFilters = () => {
    setEstate("All");
    setType("All");
    setStatus("Vacant");
    setMaxRent("20000");
    setQuery("");
  };

  return (
    <section className="section page-section">
      <div className="container">

        <div className="page-heading">
          <div>
            <span className="eyebrow dark">
              EXPLORE EMBU
            </span>

            <h1>
              Find your next student home
            </h1>

            <p>
              Search houses and hostels by location,
              price and availability.
            </p>
          </div>

          <button
            className="filter-mobile-btn"
            onClick={() =>
              setMobileFilters(true)
            }
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search by estate, house type or keyword..."
          />
        </div>

        <div
          className={
            mobileFilters
              ? "filter-drawer show"
              : "filter-drawer"
          }
        >
          <div className="filter-title">
            Filters

            <button
              onClick={() =>
                setMobileFilters(false)
              }
            >
              <X />
            </button>
          </div>

          <FilterControls
            estate={estate}
            setEstate={setEstate}
            estates={estates}
            type={type}
            setType={setType}
            types={types}
            status={status}
            setStatus={setStatus}
            maxRent={maxRent}
            setMaxRent={setMaxRent}
          />

          <button
            className="btn btn-primary reset"
            onClick={() => {
              resetFilters();
              setMobileFilters(false);
            }}
          >
            Reset filters
          </button>
        </div>

        <div className="listing-layout">

          <aside className="desktop-filters">
            <div className="filter-title">
              Filters
            </div>

            <FilterControls
              estate={estate}
              setEstate={setEstate}
              estates={estates}
              type={type}
              setType={setType}
              types={types}
              status={status}
              setStatus={setStatus}
              maxRent={maxRent}
              setMaxRent={setMaxRent}
            />

            <button
              className="btn btn-outline reset"
              onClick={resetFilters}
            >
              Reset
            </button>
          </aside>

          <div>
            <div className="result-row">
              <span>
                <strong>{results.length}</strong>{" "}
                homes found
              </span>

              <span className="result-note">
                <Filter size={15} />
                Updated listings
              </span>
            </div>

            <div className="house-grid">
              {results.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                />
              ))}
            </div>

            {!results.length && (
              <div className="empty">
                <h3>No homes found</h3>

                <p>
                  Try increasing your maximum rent
                  or changing the filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterControls({
  estate,
  setEstate,
  estates,
  type,
  setType,
  types,
  status,
  setStatus,
  maxRent,
  setMaxRent,
}) {
  return (
    <>
      <label>
        Estate

        <select
          value={estate}
          onChange={(e) =>
            setEstate(e.target.value)
          }
        >
          {estates.map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        House type

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          {types.map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label>
        Availability

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option>Vacant</option>
          <option>All</option>
          <option>Occupied</option>
        </select>
      </label>

      <label>
        Maximum rent

        <strong>
          KSh{" "}
          {Number(maxRent).toLocaleString()}
        </strong>

        <input
          type="range"
          min="2000"
          max="30000"
          step="500"
          value={maxRent}
          onChange={(e) =>
            setMaxRent(e.target.value)
          }
        />
      </label>
    </>
  );
}