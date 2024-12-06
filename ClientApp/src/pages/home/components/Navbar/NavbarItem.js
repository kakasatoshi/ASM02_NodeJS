import styles from "./Navbar.module.css";

// Receive data from parent component (Navbar) to children component (NavbarItem) via "item" prop
export default function NavbarItem(props) {
  return (
    <div
      // Combine template string and ternary operator to dynamic style for this component
      className={`${styles["nav-item"]} ${
        props.item.active ? styles["active"] : ""
      } `}
    >
      <i className={`fa ${props.item.icon}`} />
      <div>{props.item.type}</div>
    </div>
  );
}
