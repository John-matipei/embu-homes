import React, {
  useEffect,
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

const HOUSES_STORAGE_KEY = "embu_homes_houses_v2";
const DRAFT_STORAGE_KEY = "embu_homes_add_house_draft_v2";

// Read saved houses without ever crashing the page if storage is unavailable.
const readStoredHouses = () => {
  try {
    const saved = localStorage.getItem(HOUSES_STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not read saved houses:", error);
    return [];
  }
};

// Save the complete current house list. This is intentionally separate from
// React state so a refresh/reload does not recreate deleted data.
const writeStoredHouses = (houses) => {
  localStorage.setItem(
    HOUSES_STORAGE_KEY,
    JSON.stringify(houses)
  );

  // Tell other React pages that the data has changed.
  window.dispatchEvent(new CustomEvent("embu-houses-updated"));
};

// Resize/compress the image before storing it. This keeps localStorage from
// filling up quickly while keeping a permanent data URL instead of a blob URL.
const imageFileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxDimension = 1600;
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");

        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Could not prepare the image."));
          return;
        }

        context.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      img.onerror = () => {
        reject(new Error("Could not decode the selected image."));
      };

      img.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image."));
    };

    reader.readAsDataURL(file);
  });
};

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

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const navigate = useNavigate();

  // Restore an unfinished listing after refresh/navigation.
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return;

      const draft = JSON.parse(savedDraft);
      if (!draft || typeof draft !== "object") return;

      if (draft.form) {
        setForm({ ...initialForm, ...draft.form });
      }

      if (Array.isArray(draft.amenities)) {
        setAmenities(draft.amenities);
      }

      if (typeof draft.image === "string" && draft.image) {
        setImagePreview(draft.image);
        setForm((previousForm) => ({
          ...previousForm,
          image: draft.image,
        }));
      }
    } catch (error) {
      console.error("Could not restore saved draft:", error);
    }
  }, []);

  // Save the unfinished form continuously. This prevents data loss if the
  // user accidentally refreshes or leaves the page before publishing.
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          form,
          amenities,
          image: imagePreview || form.image || "",
        })
      );
    } catch (error) {
      // Do not block the form if browser storage is full.
      console.warn("Draft could not be saved:", error);
    }
  }, [form, amenities, imagePreview]);


  // --------------------------------------------------
  // HANDLE FORM CHANGES
  // --------------------------------------------------

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };


  // --------------------------------------------------
  // CONVERT IMAGE TO A PERSISTENT DATA URL
  // --------------------------------------------------

  const convertImageToBase64 = (file) => {
    return imageFileToDataUrl(file);
  };

  // --------------------------------------------------
  // HANDLE IMAGE SELECTION
  // --------------------------------------------------

  const handleImageChange = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }


    // Check that the selected file is an image
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      return;
    }


    // Maximum image size: 5MB
    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 5MB."
      );

      return;
    }


    // Clear previous errors
    setError("");


    try {
      // Save the actual file
      setImageFile(file);

      // Convert image to a permanent data URL
      const base64Image =
        await convertImageToBase64(file);

      // Store Base64 image in state
      setImagePreview(base64Image);

      // Store Base64 image in form
      setForm((previousForm) => ({
        ...previousForm,
        image: base64Image,
      }));
    } catch (err) {
      console.error(
        "Image conversion error:",
        err
      );

      setError(
        "Unable to process the selected image. Please try another image."
      );

      setImageFile(null);
      setImagePreview("");
    }
  };


  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = () => {
    setImageFile(null);

    setImagePreview("");

    setForm((previousForm) => ({
      ...previousForm,
      image: "",
    }));

    // Reset the file input so the same image
    // can be selected again if needed.
    const fileInput =
      document.getElementById(
        "house-image"
      );

    const changeFileInput =
      document.getElementById(
        "change-house-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }

    if (changeFileInput) {
      changeFileInput.value = "";
    }
  };


  // --------------------------------------------------
  // SUBMIT FORM
  // --------------------------------------------------

  const submit = (e) => {
    e.preventDefault();

    setError("");


    // Check required fields
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


    // Check house image
    if (!imagePreview) {
      setError(
        "Please select a house image."
      );

      return;
    }


    // Create one permanent property object.
    // IMPORTANT: do not store File/blob objects because they are temporary
    // and cannot be reliably restored after a refresh.
    const property = {
      ...form,

      id: `house-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      rent: Number(form.rent),
      deposit: Number(form.deposit || form.rent),
      rooms: Number(form.rooms),
      bathrooms: Number(form.bathrooms),
      amenities: [...amenities],
      landlord: "My Listing",
      landlordEmail:
        localStorage.getItem("esh_landlord_email") || "",
      image: imagePreview,
      imageFile: undefined,
    };

    try {
      // 1. Keep the existing data.js behaviour.
      addHouse(property);

      // 2. ALSO maintain a persistent browser copy.
      //    New records are appended; existing records are never recreated.
      const existingHouses = readStoredHouses();
      const alreadyExists = existingHouses.some(
        (house) => house.id === property.id
      );

      if (!alreadyExists) {
        writeStoredHouses([
          ...existingHouses,
          property,
        ]);
      }

      // Clear the draft only after successful persistence.
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (storageError) {
      console.error("Could not permanently save the property:", storageError);
      setError(
        "The property could not be saved. Your information is still kept in this form. Please try again with a smaller image."
      );
      return;
    }


    // Call parent callback
    if (onSaved) {
      onSaved();
    }


    // Go back to landlord dashboard
    navigate("/landlord");
  };


  // --------------------------------------------------
  // ADD AMENITY
  // --------------------------------------------------

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


  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <section className="section page-section">

      <div className="container narrow">


        {/* ------------------------------------------
            BACK TO DASHBOARD
        ------------------------------------------ */}

        <Link
          to="/landlord"
          className="back-link"
        >
          <ArrowLeft size={17} />

          Dashboard
        </Link>


        {/* ------------------------------------------
            PAGE HEADING
        ------------------------------------------ */}

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


        {/* ------------------------------------------
            FORM
        ------------------------------------------ */}

        <form
          className="property-form"
          onSubmit={submit}
        >


          {/* ========================================
              BASIC DETAILS
          ======================================== */}

          <div className="form-section">

            <h2>
              Basic details
            </h2>


            <div className="form-grid">


              {/* PROPERTY TITLE */}

              <label className="wide">

                Property title *

                <input
                  name="title"
                  value={form.title}
                  onChange={change}
                  placeholder="e.g. Clean bedsitter near Kangaru"
                />

              </label>


              {/* ESTATE */}

              <label>

                Estate / area *

                <input
                  name="estate"
                  value={form.estate}
                  onChange={change}
                  placeholder="Kangaru"
                />

              </label>


              {/* HOUSE TYPE */}

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


              {/* MONTHLY RENT */}

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


              {/* DEPOSIT */}

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


              {/* DISTANCE */}

              <label>

                Approx. distance

                <input
                  name="distance"
                  value={form.distance}
                  onChange={change}
                  placeholder="1.2 km from university"
                />

              </label>


              {/* AVAILABILITY */}

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


              {/* ROOMS */}

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


              {/* BATHROOMS */}

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


              {/* PHONE */}

              <label className="wide">

                Landlord phone *

                <input
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="0712 345 678"
                />

              </label>


              {/* DESCRIPTION */}

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


          {/* ========================================
              PROPERTY PHOTO
          ======================================== */}

          <div className="form-section">

            <h2>
              Property photo
            </h2>


            <p className="muted">
              Upload a clear photo of the
              property directly from your
              device.
            </p>


            {/* --------------------------------------
                NO IMAGE SELECTED
            -------------------------------------- */}

            {!imagePreview && (

              <label
                className="photo-upload-box"
                htmlFor="house-image"
              >

                <ImagePlus
                  size={38}
                />

                <strong>
                  Choose house image
                </strong>

                <span>
                  Click here to select an
                  image from your device
                </span>

                <small>
                  JPG, PNG, WEBP • Maximum 5MB
                </small>


                <input
                  id="house-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  hidden
                />

              </label>

            )}


            {/* --------------------------------------
                IMAGE PREVIEW
            -------------------------------------- */}

            {imagePreview && (

              <div className="photo-preview-wrapper">

                <img
                  className="preview-image"
                  src={imagePreview}
                  alt="House preview"
                />


                <div className="photo-actions">

                  <label
                    className="btn btn-outline"
                    htmlFor="change-house-image"
                  >

                    <ImagePlus
                      size={16}
                    />

                    Change image

                    <input
                      id="change-house-image"
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      hidden
                    />

                  </label>


                  <button
                    type="button"
                    className="btn btn-outline remove-photo-btn"
                    onClick={
                      removeImage
                    }
                  >

                    <X size={16} />

                    Remove image

                  </button>

                </div>

              </div>

            )}

          </div>


          {/* ========================================
              AMENITIES
          ======================================== */}

          <div className="form-section">

            <h2>
              Amenities
            </h2>


            <div className="amenity-tags">

              {amenities.map(
                (amenity) => (

                  <span
                    key={amenity}
                  >

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
                onClick={
                  addAmenity
                }
              >

                <Plus size={16} />

                Add

              </button>

            </div>

          </div>


          {/* ========================================
              ERROR MESSAGE
          ======================================== */}

          {error && (

            <div className="form-error">

              {error}

            </div>

          )}


          {/* ========================================
              FORM ACTIONS
          ======================================== */}

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