const STORAGE_KEY =
  "embu_student_homes";

const defaultHouses = [
  {
    id: "house-1",

    title:
      "Modern Bedsitter Near Kangaru",

    estate: "Kangaru",

    type: "Bedsitter",

    rent: 6500,

    deposit: 6500,

    distance: "1.2 km",

    status: "Vacant",

    rooms: 1,

    bathrooms: 1,

    water: "24/7",

    electricity: "Prepaid",

    furnished: false,

    landlord:
      "Demo Landlord",

    landlordEmail:
      "landlord@embu.com",

    phone:
      "0712345678",

    description:
      "A clean and secure bedsitter suitable for University of Embu students. The house is located in a quiet compound with easy access to shops, public transport and the university.",

    amenities: [
      "Water",
      "Electricity",
      "Security",
      "Parking",
      "Good network",
    ],

    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "house-2",

    title:
      "Affordable Single Room",

    estate: "Dallas",

    type: "Single Room",

    rent: 4000,

    deposit: 4000,

    distance: "2.0 km",

    status: "Vacant",

    rooms: 1,

    bathrooms: 1,

    water: "24/7",

    electricity: "Prepaid",

    furnished: false,

    landlord:
      "Demo Landlord",

    landlordEmail:
      "landlord@embu.com",

    phone:
      "0723456789",

    description:
      "Affordable single room ideal for students looking for a simple and convenient place to stay near the University of Embu.",

    amenities: [
      "Water",
      "Electricity",
      "Security",
      "Wi-Fi",
    ],

    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "house-3",

    title:
      "Student Hostel Rooms",

    estate: "Muthatari",

    type: "Hostel",

    rent: 5500,

    deposit: 5500,

    distance: "1.5 km",

    status: "Vacant",

    rooms: 1,

    bathrooms: 1,

    water: "24/7",

    electricity: "Prepaid",

    furnished: true,

    landlord:
      "Demo Landlord",

    landlordEmail:
      "landlord@embu.com",

    phone:
      "0734567890",

    description:
      "Student-friendly hostel with secure surroundings, reliable water and electricity and easy access to the university.",

    amenities: [
      "Water",
      "Electricity",
      "Wi-Fi",
      "Security",
      "Laundry area",
    ],

    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "house-4",

    title:
      "Spacious 1 Bedroom Apartment",

    estate: "Kangaru",

    type: "1 Bedroom",

    rent: 10000,

    deposit: 10000,

    distance: "1.8 km",

    status: "Occupied",

    rooms: 1,

    bathrooms: 1,

    water: "24/7",

    electricity: "Prepaid",

    furnished: false,

    landlord:
      "Demo Landlord",

    landlordEmail:
      "landlord@embu.com",

    phone:
      "0745678901",

    description:
      "Spacious one-bedroom apartment in a secure compound with good access roads and nearby shops.",

    amenities: [
      "Water",
      "Electricity",
      "Security",
      "Parking",
    ],

    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getHouses() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        defaultHouses
      )
    );

    return defaultHouses;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultHouses;
  }
}

function saveHouses(houses) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(houses)
  );
}

export function addHouse(house) {

  const houses =
    getHouses();

  const newHouse = {
    ...house,

    id:
      "house-" +
      Date.now(),

    image:
      house.image ||
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  };

  saveHouses([
    newHouse,
    ...houses,
  ]);

  return newHouse;
}

export function updateHouse(
  id,
  changes
) {

  const houses =
    getHouses();

  const updated =
    houses.map((house) =>
      house.id === id
        ? {
            ...house,
            ...changes,
          }
        : house
    );

  saveHouses(updated);

  return updated;
}

export function deleteHouse(id) {

  const houses =
    getHouses();

  const updated =
    houses.filter(
      (house) =>
        house.id !== id
    );

  saveHouses(updated);

  return updated;
}