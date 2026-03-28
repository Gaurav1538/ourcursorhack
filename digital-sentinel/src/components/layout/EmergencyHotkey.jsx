import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../../constants/journey";

/**
 * Global demo shortcut: Alt+Shift+E → Emergency with current route state preserved.
 */
export default function EmergencyHotkey() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onKey = (e) => {
      if (!e.altKey || !e.shiftKey) return;
      if (e.key !== "e" && e.key !== "E") return;
      if (e.repeat) return;
      const t = e.target;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      navigate(PATHS.emergency, { state: location.state });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, location.state]);

  return null;
}
