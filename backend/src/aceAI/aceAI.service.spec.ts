// import { TestingModule, Test } from "@nestjs/testing";
// import { InterviewType } from "@prisma/client";
// import { AceAIService } from "./aceAI.service";
// import { GPTService } from "./gpt.service";
// import { HttpService } from "@nestjs/axios";
// import { of } from "rxjs";

// describe('AceAIService', () => {
//   let service: AceAIService;
//   let gptService: GPTService;
//   let httpService: HttpService;

//   beforeEach(async () => {
//     const httpServiceMock = {
//       get: jest.fn(() => of({ data: {} })),
//       post: jest.fn(() => of({ data: {} })),
//       // Add other methods as needed
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AceAIService,
//         GPTService,
//         {
//           provide: HttpService,
//           useValue: httpServiceMock,
//         },
//       ],
//     }).compile();

//     service = module.get<AceAIService>(AceAIService);
//     gptService = module.get<GPTService>(GPTService);
//     httpService = module.get<HttpService>(HttpService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//     expect(gptService).toBeDefined();
//     expect(httpService).toBeDefined();
//     });

//   describe('checkJobValidity', () => {
//     it('should call GPTService with correct parameters', async () => {
//       const jobDto = {
//         title: 'Software Engineer',
//         company: 'Tech Corp',
//         description: 'Develop full-stack applications.',
//         location: 'Remote'
//       };
//       const expectedUserContent = 'Please assess the job content below:\nRole Title: "Software Engineer"\nCompany: "Tech Corp"\nJob Description: "Develop full-stack applications."\nLocation: "Remote"\n';

//       await service.checkJobValidity(jobDto);
//       expect(gptService.sendRequest).toHaveBeenCalledWith(expect.any(String), expectedUserContent);
//     });
//   });

//   describe('generateQuestions', () => {
//     it('should generate questions based on job and interview details', async () => {
//       const jobTitle = 'Project Manager';
//       const company = 'BuildIt Inc.';
//       const jobDescription = 'Oversee large construction projects.';
//       const jobLocation = 'New York';
//       const interviewTitle = 'Management Skills Assessment';
//       const interviewType = InterviewType.CUSTOM;
//       const interviewCustomType = 'Leadership';

//       await service.generateQuestions(jobTitle, company, jobDescription, jobLocation, interviewTitle, interviewType, interviewCustomType, null);
//       expect(gptService.sendRequest).toHaveBeenCalledWith(expect.any(String), expect.stringContaining(`Role Title: "${jobTitle}"`));
//     });
//   });

//   describe('giveFeedback', () => {
//     it('should send appropriate feedback request to GPTService', async () => {
//       const jobTitle = 'Designer';
//       const company = 'Creative Solutions';
//       const interviewType = InterviewType.BEHAVIORAL;
//       const question = 'Tell us about a time you overcame a design challenge.';
//       const response = 'I redesigned a product to enhance usability.';
//       const criteria = 'Creativity, Problem-solving';

//       await service.giveFeedback(jobTitle, company, interviewType, question, response, criteria);
//       expect(gptService.sendRequest).toHaveBeenCalledWith(expect.any(String), expect.stringContaining(`Response: ${response}`));
//     });
//   });
// });
