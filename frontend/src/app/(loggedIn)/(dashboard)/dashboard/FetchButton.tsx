"use client";
import { Button, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import instance from "@/app/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Replace with path to your store

const FetchButton: React.FC = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const name = useSelector((state: RootState) => state.auth.firstName + " " + state.auth.lastName);

  const fetchData = async () => {
    if (!accessToken) {
      setData("No access token found for" + name);
      return;
    }

    setLoading(true);

    // const csrfToken = getCookie('csrftoken');  // Replace 'csrfTokenName' with the actual cookie name where CSRF token is stored.
    // axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

    try {
      const response = await instance.get("/user");
      setData(response.data);
    } catch (error) {
      setData("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <h1>{name + " " + accessToken}</h1>
      <Button onClick={fetchData} isLoading={loading} colorScheme="blue">
        Fetch Data
      </Button>

      {data && (
        <Box mt="4">
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </Box>
      )}
    </Box>
  );
};

export default FetchButton;
