import React from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  // Declare `WithAuthComponent` and use `P` to type the props correctly
  const WithAuthComponent: React.FC<P> = (props) => {
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
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthComponent;
};

// Helper function to get the display name of a component
function getDisplayName<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;
