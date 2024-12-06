import styles from "./Footer.module.css";

// Data of page footer
const footerData = [
  {
    col_number: 1,
    col_values: [
      "Countries",
      "Regions",
      "Cities",
      "Districts",
      "Airports",
      "Hotels",
    ],
  },
  {
    col_number: 2,
    col_values: [
      "Homes",
      "Apartments",
      "Resorts",
      "Villas",
      "Hostels",
      "Guest houses",
    ],
  },
  {
    col_number: 3,
    col_values: [
      "Unique places to stay",
      "Reviews",
      "Unpacked: Travel articles",
      "Travel communities",
      "Seasonal and holiday deals",
    ],
  },
  {
    col_number: 4,
    col_values: [
      "Car rental",
      "Flight Finder",
      "Restaurant reservations",
      "Travel Agents",
    ],
  },
  {
    col_number: 5,
    col_values: [
      "Curtomer Service",
      "Partner Help",
      "Careers",
      "Sustainability",
      "Press center",
      "Safety Resource Center",
      "Investor relations",
      "Terms & conditions",
    ],
  },
];

export default function Footer() {
  return (
    <div>
      <div className={`${styles["column-footer"]} div-container`}>
        {/* Render list for footer within key prop */}
        {footerData.map((item) => (
          <div key={item.col_number}>
            <ul>
              {item.col_values.map((rowItem, index) => (
                <li key={index}>{rowItem}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
