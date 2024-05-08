import { useMemo, useState } from 'react';
import { MRT_TableOptions, MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { createTheme, ThemeProvider, useTheme, Box, Typography } from '@mui/material';
import {  QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type User, roles} from '../mocks/mockData';
import { MRT_Localization_RU } from 'material-react-table/locales/ru'; // локализация
import { ruRU } from '@mui/material/locale'; // локализация
import { useGetUsers } from '../hooks/use-get-users';
import { useUpdateUser } from '../hooks/use-update-user';
import { validateUser } from '../utils/validation';

const TableWithProviders = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    //определение колонок
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnFilter: false,
        enableEditing: false, // запрещает редактирование колонки
        Edit: () => null, // отключает рендеринг этой колонки в модальном окне редактирования
      },
      {
        accessorKey: 'fullName',
        header: 'Имя',
        enableColumnFilter: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.fullName,
          helperText: validationErrors?.fullName,
          //удаляет все предыдущие ошибки проверки, когда пользователь фокусируется на вводе
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              fullName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Электронная почта',
        enableColumnFilter: false,
        enableSorting: false, // отключает сортировку для этого столбца
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'jobTitle',
        header: 'Роль',
        enableSorting: false,
        enableColumnFilter: true,
        filterVariant: 'autocomplete' || 'select', // фильтрация
        filterSelectOptions: roles, // опции фильтрации
        editVariant: 'select',
        editSelectOptions: roles,
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.jobTitle,
          helperText: validationErrors?.jobTitle,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              jobTitle: undefined,
            }),
        },
      },
      {
        accessorKey: 'password',
        header: 'Пароль',
        visibleInShowHideMenu: false, // убирает возможность отобразить столбец "пароль"
        muiEditTextFieldProps: {
          // type: 'password', // вводимые символы заменяются звездочками
          required: true,
          error: !!validationErrors?.password,
          helperText: validationErrors?.password,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              password: undefined,
            }),
        },
      },
      {
        accessorKey: 'signUpDate',
        header: 'Дата регистрации',
        enableColumnFilter: false,
        enableEditing: false,
        Edit: () => null,
      },
    ],
    [validationErrors], // массив зависимостей мемоизации
  );

  // вызов READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();

  // вызов UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
  useUpdateUser();

  // UPDATE action
  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); // выйти из режима редактирования
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    /*  
    При включении виртуализации строк время на скриптинг уменьшается в 3-4 раза
    Без виртуализации строк таблица плавно прокручивается при любом количестве строк
    Отлючить при пагинации или количетсве строк менее 100-300, в ином случае включить для повышения производительности
    */
    //enableRowVirtualization: true,
    enableBottomToolbar: false, // отключает поле для рендеринга кнопок под таблицей
    localization: MRT_Localization_RU, // локализация
    enableGlobalFilter: false, // отключает глобальный фильтр - нет в тз
    enableFullScreenToggle: false, // отключает полный экран
    enableDensityToggle: false, // отключает переключение масштабирования
    enableColumnActions: false, // отключает действия c колонками
    enablePagination: false, // отключает пагинацию
    initialState: { 
      columnVisibility: { password: false, signUpDate: false, }, // по дефолту скрыть столбцы с паролем и датой регистрации
      showColumnFilters: true, // по дефолту показать поля фильтрации
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    // редактировать строку при клике на неё
    muiTableBodyRowProps: ({ table, row }) => ({
      onClick: () => {
        table.setEditingRow(row)
      },
      sx: {
        cursor: 'pointer',
      },
    }),
    // кастомизация панели детализации
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    // отрендерить панели детализации (строка с ролью и почтой под именем)
    renderDetailPanel: ({ row }) => 
        <Box
          sx={{
            display: 'flexbox',
            margin: 'auto',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
            '&:hover': {
              backgroundColor: 'lightblue',
            },
          }}
        >
          <Typography>Электронная почта: {row.original.email}</Typography>
          <Typography>Роль: {row.original.jobTitle}</Typography>
        </Box>,
    state: {
      isLoading: isLoadingUsers,
      isSaving: isUpdatingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const App = () => {
  const theme = useTheme(); // локализация
  return (
    // передать клиента react query и локализацию
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={createTheme(theme, ruRU)}>
        <TableWithProviders />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
