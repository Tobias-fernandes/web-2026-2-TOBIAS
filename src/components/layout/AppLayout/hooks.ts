import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { can } from "@/domain/access";
import { useEnterprise } from "@/queries";
import { useCurrentUser, useSignOut } from "@/stores/auth";
import { toast } from "@/stores/toast";
import { APP_NAV_GROUPS } from "./constants";

const useAppLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return { location, menuOpen, setMenuOpen, closeMenu };
};

const useSidebarContent = () => {
  const user = useCurrentUser();
  const enterprise = useEnterprise();
  const signOut = useSignOut();
  const navigate = useNavigate();

  /** A link the member cannot open is noise, not a discovery. */
  const groups = useMemo(
    () =>
      APP_NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => !item.permission || can(user, item.permission),
        ),
      })).filter((group) => group.items.length > 0),
    [user],
  );

  const handleSignOut = async () => {
    await signOut();
    toast.info("Você saiu da conta.");
    navigate(ROUTES.login, { replace: true });
  };

  return { user, enterprise, groups, handleSignOut };
};

export { useAppLayout, useSidebarContent };
