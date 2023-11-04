"use client";
import NavBar from "@/components/navbar";
import FetchButton from "./FetchButton";
import ContentContainer from "@/components/contentContainer";
import WithAuth from "../../redux/features/authHoc";
import Header from "@/components/header";
import Cards from "@/components/cards";
import { fetchJobs } from "@/redux/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "@/redux/features/jobSlice";

const DashboardPage = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: RootState) => state.jobs); // Adjust path if needed

  useEffect(() => {
    // Dispatch the thunk
    dispatch(fetchJobs())
      .unwrap() // You can unwrap the promise returned by a thunk
      .catch((error: any) => {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.statusCode &&
          error.response.data.statusCode === 401
        ) {
          setError("Incorrect email or password.");
        } else {
          setError("An error occurred.");
        }
      });
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <ContentContainer>
        <Header />
        <Cards cards={jobs} />
        <FetchButton />
      </ContentContainer>
    </>
  );
};

// DashboardPage.getLayout = (page: any) => <SharedLayout>{page}</SharedLayout>;

export default WithAuth(DashboardPage);
