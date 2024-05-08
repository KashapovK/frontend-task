import { useQuery } from "@tanstack/react-query";
import { User, fakeData } from "../mocks/mockData";

//READ hook - получить пользователей по api
export function useGetUsers() {
    return useQuery<User[]>({
      queryKey: ['users'],
      queryFn: async () => { // функция получения данных, возвращает промис с данными с сервера или исключение (моковые данные)
  /*    
        здесь отправка запроса
        axios.defaults.headers.common['X-Jsio-Token'] = '8b7f15974bfb7ff48f53daec0a377545';
        axios.get('https://api.jsonserver.io/users').then(res => {
          data = res.data;
        });
  */      
        await new Promise((resolve) => setTimeout(resolve, 1)); //фейковый api запрос
        return Promise.resolve(fakeData);
      },
      // отключает повторный запрос данных при установке фокуса на области просмотра (при переключении вкладкок)
      // отключено при работе с моковыми данными
      refetchOnWindowFocus: false, 
    });
}
