import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../mocks/mockData";

//UPDATE hook  (поместить user в api)
export function useUpdateUser() {
    const queryClient = useQueryClient(); // получить доступ к клиенту react query
    return useMutation({
    mutationFn: async (/*user: User*/) => {
        // здесь отправка запроса на обновление API 
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Promise.resolve();
      },
      // выполнить оптимистическое обновление на стороне клиента
      // выполнить функцию перед мутацией в надежде, что мутация завершится успешно
      // в случае провала мутации, возвращаемое этой функцией значение будет передано в onSettled
      onMutate: (newUserInfo: User) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryClient.setQueryData(['users'], (prevUsers: any) =>
          prevUsers?.map((prevUser: User) =>
            prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
          ),
        );
      },
      /* Всегда выполняем повторный запрос
      Побочный эффект - всегда, при любом исходе мутации аннулировать (инвалидировать) все запросы к query с ключом users и выполнить их повторно (получить данные)
      Если возвращается промис, он будет разрешен перед продолжением
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),  */
    });
}
