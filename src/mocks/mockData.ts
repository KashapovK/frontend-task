import {faker} from '@faker-js/faker';

export type User = {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  signUpDate: string;
  password: string;
};
  
export const fakeData = [...Array(200)].map(() => ({
  id: faker.string.uuid(),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  jobTitle: faker.person.jobTitle(),
  signUpDate: faker.date.past().toLocaleDateString('ko-KR'), // приводит дату к строке формата год/месяц/день для корректной работы сортировки
  password: faker.internet.password(),
}));

export const roles = [
  'Boss',
  'Postman',
  'Editor',
  'Seller',
  'Engineer',
  'Intern',
];

export type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

export type FullUserInfoApiResponse = FullUserInfo;

type FullUserInfo = User & {
  jobTitle: string;
  email: string;
};
