import React from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const router = useRouter();
    const pathname = usePathname();

    if (!token && pathname !== "/login") {
      router.push("/login");
      return null; // Component will not be rendered until the page redirect completes
    }

    if (token && pathname === "/login") {
      router.push("/dashboard");
      return null; // Component will not be rendered until the page redirect completes
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
