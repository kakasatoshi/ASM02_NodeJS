import HotelList from "./HotelList";
import RegisterForm from "./RegisterForm";
import TownList from "./TownList";
import TypeOfHotel from "./TypeOfHotel";

export default function Body() {
  return (
    <div>
      <div className="div-container">
        <TownList />
        <TypeOfHotel />
        <HotelList />
      </div>
    </div>
  );
}
