"use client";
import FetchButton from "./FetchButton";
import { Content } from "@/components/contentContainer";
import WithAuth from "@/redux/features/authHoc";
import Header from "@/components/header";
import JobCards from "@/components/jobCards";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "@/redux/features/jobSlice";
import Bubble from "@/components/bubble";
import AnimatedLink from "@/components/AnimatedLink";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: RootState) => state.jobs); // Make sure this points to the jobs array within the JobState.

  if (!jobs.fetched) {
    // jobs is now an object with `jobs` array and `fetched` boolean
    dispatch(fetchJobs()).unwrap();
    // .catch((error: any) => {
    //   // Error handling remains the same
    // })
  }

  return (
    <Content>
      <Bubble>
        <Header />
        <AnimatedLink className={""} href={"/practice"}>
          PracticePage Link
        </AnimatedLink>
        <JobCards cards={jobs} />
      </Bubble>
      <FetchButton />
    </Content>
  );
};

export default WithAuth(DashboardPage);
