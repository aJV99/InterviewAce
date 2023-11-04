import React from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuthComponent: React.FC<any> = (props) => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const router = useRouter();
    const pathname = usePathname();

    if (!token && pathname !== "/login") {
      router.push("/login");
      return null;
    }

    if (token && pathname === "/login") {
      router.push("/dashboard");
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set a display name for debugging purposes
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(
    WrappedComponent,
  )})`;

  return WithAuthComponent;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent: React.ComponentType) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;
