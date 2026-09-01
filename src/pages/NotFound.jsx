import React, {
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Plus,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { addHouse } from "../data";

const initialForm = {
  title: "",
  estate: "",
  type: "Single Room",
  rent: "",
  deposit: "",
  distance: "",
  status: "Vacant",
  rooms: 1,
  bathrooms: 1,
  furnished: false,
  water: "24/7",
  electricity: "Prepaid",
  description: "",
  phone: "",
  image: "",
};

export default function AddHouse({
  onSaved,
}) {

  const [form, setForm] =
    useState(initialForm);

  const [amenities, setAmenities] =
    useState([
      "Water",
      "Electricity",
      "Security",
    ]);

  const [newAmenity, setNewAmenity] =
    useState("");

  const [error, setError] =
    useState("");

  const navigate = useNavigate();

  const change = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const submit = (e) => {

    e.preventDefault();

    setError("");

    if (
      !form.title ||
      !form.estate ||
      !form.rent ||
      !form.phone ||
      !form.description
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    addHouse({
      ...form,

      rent: Number(form.rent),

      deposit: Number(
        form.deposit || form.rent
      ),

      rooms: Number(form.rooms),

      bathrooms: Number(
        form.bathrooms
      ),

      amenities,

      landlord: "My Listing",

      landlordEmail:
        localStorage.getItem(
          "esh_landlord_email"
        ) || "",
    });

    onSaved();

    navigate("/landlord");
  };

  const addAmenity = () => {

    const value =
      newAmenity.trim();

    if (
      value &&
      !amenities.includes(value)
    ) {
      setAmenities([
        ...amenities,
        value,
      ]);

      setNewAmenity("");
    }
  };

  return (
    <section className="section page-section">

      <div className="container narrow">

        <Link
          to="/landlord"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>

        <div className="form-heading">

          <span className="eyebrow dark">
            NEW LISTING
          </span>

          <h1>
            Post a student property
          </h1>

          <p>
            Give students enough information
            to decide whether the house fits
            their needs.
          </p>

        </div>

        <form
          className="property-form"
          onSubmit={submit}
        >

          <div className="form-section">

            <h2>
              Basic details
            </h2>

            <div className="form-grid">

              <label className="wide">
                Property title *

                <input
                  name="title"
                  value={form.title}
                  onChange={change}
                  placeholder="e.g. Clean bedsitter near Kangaru"
                />
              </label>

              <label>
                Estate / area *

                <input
                  name="estate"
                  value={form.estate}
                  onChange={change}
                  placeholder="Kangaru"
                />
              </label>

              <label>
                House type

                <select
                  name="type"
                  value={form.type}
                  onChange={change}
                >
                  <option>
                    Single Room
                  </option>

                  <option>
                    Bedsitter
                  </option>

                  <option>
                    Hostel
                  </option>

                  <option>
                    1 Bedroom
                  </option>

                  <option>
                    2 Bedroom
                  </option>

                  <option>
                    3 Bedroom
                  </option>
                </select>
              </label>

              <label>
                Monthly rent (KSh) *

                <input
                  type="number"
                  name="rent"
                  value={form.rent}
                  onChange={change}
                  placeholder="5000"
                  min="0"
                />
              </label>

              <label>
                Deposit (KSh)

                <input
                  type="number"
                  name="deposit"
                  value={form.deposit}
                  onChange={change}
                  placeholder="5000"
                  min="0"
                />
              </label>

              <label>
                Approx. distance

                <input
                  name="distance"
                  value={form.distance}
                  onChange={change}
                  placeholder="1.2 km from university"
                />
              </label>

              <label>
                Availability

                <select
                  name="status"
                  value={form.status}
                  onChange={change}
                >
                  <option>
                    Vacant
                  </option>

                  <option>
                    Occupied
                  </option>
                </select>
              </label>

              <label>
                Rooms

                <input
                  type="number"
                  name="rooms"
                  value={form.rooms}
                  onChange={change}
                  min="1"
                />
              </label>

              <label>
                Bathrooms

                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={change}
                  min="1"
                />
              </label>

              <label className="wide">
                Landlord phone *

                <input
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="0712 345 678"
                />
              </label>

              <label className="wide">
                Description *

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={change}
                  rows="5"
                  placeholder="Describe the compound, security, access, nearby services, rules, etc."
                />
              </label>

            </div>
          </div>

          <div className="form-section">

            <h2>
              Property photo
            </h2>

            <p className="muted">
              Paste an image URL for this
              prototype. A production version
              can upload directly to cloud
              storage.
            </p>

            <div className="photo-input">

              <ImagePlus />

              <input
                name="image"
                value={form.image}
                onChange={change}
                placeholder="https://..."
              />

            </div>

            {form.image && (
              <img
                className="preview-image"
                src={form.image}
                alt="Preview"
              />
            )}

          </div>

          <div className="form-section">

            <h2>
              Amenities
            </h2>

            <div className="amenity-tags">

              {amenities.map(
                (amenity) => (
                  <span key={amenity}>

                    {amenity}

                    <button
                      type="button"
                      onClick={() =>
                        setAmenities(
                          amenities.filter(
                            (item) =>
                              item !==
                              amenity
                          )
                        )
                      }
                    >
                      <X size={13} />
                    </button>

                  </span>
                )
              )}

            </div>

            <div className="amenity-add">

              <input
                value={newAmenity}
                onChange={(e) =>
                  setNewAmenity(
                    e.target.value
                  )
                }
                placeholder="Add amenity..."
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
              />

              <button
                type="button"
                className="btn btn-outline"
                onClick={addAmenity}
              >
                <Plus size={16} />
                Add
              </button>

            </div>

          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="form-actions">

            <Link
              to="/landlord"
              className="btn btn-outline"
            >
              Cancel
            </Link>

            <button
              className="btn btn-primary btn-large"
              type="submit"
            >
              Publish property
            </button>

          </div>

        </form>

      </div>
    </section>
  );
}