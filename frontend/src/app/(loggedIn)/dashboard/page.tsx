"use client";
import NavBar from "@/components/navbar";
import FetchButton from "./FetchButton";
import ContentContainer, { Content } from "@/components/contentContainer";
import WithAuth from "../../../redux/features/authHoc";
import Header from "@/components/header";
import JobCards from "@/components/jobCards";
import { fetchJobs } from "@/redux/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "@/redux/features/jobSlice";
import { Box } from "@chakra-ui/react";
import Bubble from "@/components/bubble";
import DynamicBreadcrumb from "@/components/breadcrumb";

const DashboardPage = () => {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: RootState) => state.jobs); // Make sure this points to the jobs array within the JobState.

  // useEffect(() => {
    if (!jobs.fetched) {
      // jobs is now an object with `jobs` array and `fetched` boolean
      console.log("running");
      dispatch(fetchJobs())
        .unwrap()
        .catch((error: any) => {
          // Error handling remains the same
        });
    }
  // }, [dispatch, jobs.fetched]);

  return (
    <Content>
      <Bubble>
        <Header />
        <JobCards cards={jobs} />
      </Bubble>
      <FetchButton />
    </Content>
  );
};

// DashboardPage.getLayout = (page: any) => <SharedLayout>{page}</SharedLayout>;

export default WithAuth(DashboardPage);
