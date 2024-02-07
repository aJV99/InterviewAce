import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { usePathname, useParams } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const params = useParams();
  const jobsState = useSelector((state: RootState) => state.jobs);
  let jobState = null;
  let interviewState = null;

  const pathSegments = pathname?.split('/') || [];

  let dashboard = false;
  let job = false;
  let interview = false;

  console.log("pathname: ", pathname);
  if (pathSegments.length >= 3) {
    console.log("pathSegments: ", pathSegments[1]);
    if (pathSegments[1] == 'job') {
        job = true;
        jobState = jobsState.jobs.find(job => job.id === pathSegments[2]);
    } else {
        interview = true;
        const interviewId = pathSegments[2]; // Assuming interviewId is the fourth segment in the URL
        jobState = jobsState.jobs.find(job => 
            job.interviews.some(interview => interview.id === interviewId)
        );

    }
  } else {
    console.log("pathSegments: ", pathSegments[1]);
    dashboard = true;
  }

  console.log("params: ", params);
  console.log("jobsState: ", jobsState);




  return (
    <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
    <BreadcrumbItem isCurrentPage={dashboard}>
        <BreadcrumbLink><Link href='/dashboard'>Dashboard</Link></BreadcrumbLink>
    </BreadcrumbItem>

    {(job || interview) && 
        <BreadcrumbItem isCurrentPage={job}>
        <BreadcrumbLink><Link href={'/job/' + jobState?.id} children={jobState?.title + ' @ ' + jobState?.company} /></BreadcrumbLink>
        </BreadcrumbItem>
    }
    
    {interview  && 
    <BreadcrumbItem isCurrentPage={interview}>
        <BreadcrumbLink><Link href='/dashboard'>Interview</Link></BreadcrumbLink>
    </BreadcrumbItem>
    }
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;