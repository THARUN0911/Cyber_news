import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <NavLink to="/" end>
        Latest
      </NavLink>
      <NavLink to="/india">
        India
      </NavLink>
      <NavLink to="/breaches">
        Breaches
      </NavLink>
      <NavLink to="/malware">
        Malware
      </NavLink>
      <NavLink to="/vulnerabilities">
        Vulnerabilities
      </NavLink>
    </nav>
  );
}
