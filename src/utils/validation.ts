import { User, roles } from "../mocks/mockData";

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

const validateSelectField = (value: string) => {
  // Проверяет является ли значение роли значением из списка ролей
  return roles.includes(value)
}

export function validateUser(user: User) {
  return {
    fullName: !validateRequired(user.fullName) ? 'Требуется ввести имя' : '',
    password: !validateRequired(user.password) ? 'Требуется ввести пароль' : '',
    email: !validateEmail(user.email) ? 'Некорректно указана почта' : '',
    jobTitle: !validateSelectField(user.jobTitle) ? 'Выберите роль из списка' : '',
  };
}

