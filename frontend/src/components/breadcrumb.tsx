import { ChevronRightIcon } from '@chakra-ui/icons';
import { Breadcrumb, BreadcrumbItem } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Job } from '@/redux/dto/job.dto';
import { Interview } from '@/redux/dto/interview.dto';
import AnimatedLink from './AnimatedLink';

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const jobsState = useSelector((state: RootState) => state.jobs);
  let jobState: Job | undefined;
  let interviewState: Interview | undefined;

  const pathSegments = pathname?.split('/') || [];

  let dashboard = false;
  let settings = false;
  let job = false;
  let interview = false;

  // useEffect(() => {
  console.log('pathname: ', pathname);
  if (pathSegments.length >= 3) {
    console.log('pathSegments: ', pathSegments[1]);
    if (pathSegments[1] == 'job') {
      job = true;
      jobState = jobsState.jobs[pathSegments[2]];
    } else {
      interview = true;
      jobState = jobsState.jobs[pathSegments[2]];
      interviewState = jobState?.interviews[pathSegments[3]];
    }
  } else {
    if (pathSegments[1] == 'settings') {
      dashboard = false;
      settings = true;
    } else {
      dashboard = true;
    }
  }
  // }, [])

  return (
    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
      <BreadcrumbItem isCurrentPage={dashboard}>
        <AnimatedLink className={dashboard ? 'disabled' : 'enabled'} aria-disabled={dashboard} href="/dashboard">
          Dashboard
        </AnimatedLink>
      </BreadcrumbItem>

      {settings && (
        <BreadcrumbItem isCurrentPage={settings}>
          <AnimatedLink className={settings ? 'disabled' : 'enabled'} aria-disabled={settings} href="/settings">
            Settings
          </AnimatedLink>
        </BreadcrumbItem>
      )}

      {(job || interview) && (
        <BreadcrumbItem isCurrentPage={job}>
          <AnimatedLink className={job ? 'disabled' : 'enabled'} aria-disabled={job} href={`/job/${jobState?.id}`}>
            {jobState?.title + ' @ ' + jobState?.company}
          </AnimatedLink>
        </BreadcrumbItem>
      )}

      {interview && (
        <BreadcrumbItem isCurrentPage={interview}>
          <AnimatedLink
            className={interview ? 'disabled' : 'enabled'}
            aria-disabled={interview}
            href={`/interview/${jobState?.id}/${interviewState?.id}`}
          >
            {interviewState?.title}
          </AnimatedLink>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
