"use client";
import NavBar from "@/components/navbar";
import FetchButton from "./FetchButton";
import ContentContainer from "@/components/contentContainer";
import WithAuth from "../../redux/features/authHoc";
import Header from "@/components/header";
import Cards from "@/components/cards";

const DashboardPage = () => {
  return (
    <>
      <NavBar />
      <ContentContainer>
        <Header />
        <Cards />
        <FetchButton />
      </ContentContainer>
    </>
  );
};

export default WithAuth(DashboardPage);
