# EmployeeApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1EmployeesGet**](#apiv1employeesget) | **GET** /api/v1/employees | Получить сотрудников с возможностью фильтрации.|
|[**apiV1EmployeesIdGet**](#apiv1employeesidget) | **GET** /api/v1/employees/{id} | Получить сотрудника по идентификатору.|
|[**apiV1EmployeesPlantsGet**](#apiv1employeesplantsget) | **GET** /api/v1/employees/plants | Получить растения сотрудника.|

# **apiV1EmployeesGet**
> Array<ServerControllersModelsEmployeeDTO> apiV1EmployeesGet()


### Example

```typescript
import {
    EmployeeApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new EmployeeApi(configuration);

let phoneNumber: string; //Номер телефона сотрудника (опционально). (optional) (default to undefined)
let task: string; //Задача сотрудника (опционально). (optional) (default to undefined)
let plantDomain: string; //Сфера растений сотрудника (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1EmployeesGet(
    phoneNumber,
    task,
    plantDomain
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **phoneNumber** | [**string**] | Номер телефона сотрудника (опционально). | (optional) defaults to undefined|
| **task** | [**string**] | Задача сотрудника (опционально). | (optional) defaults to undefined|
| **plantDomain** | [**string**] | Сфера растений сотрудника (опционально). | (optional) defaults to undefined|


### Return type

**Array<ServerControllersModelsEmployeeDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список сотрудников успешно получен. |  -  |
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Сотрудник не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1EmployeesIdGet**
> ServerControllersModelsEmployeeDTO apiV1EmployeesIdGet()


### Example

```typescript
import {
    EmployeeApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new EmployeeApi(configuration);

let id: string; //Идентификатор сотрудника. (default to undefined)

const { status, data } = await apiInstance.apiV1EmployeesIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор сотрудника. | defaults to undefined|


### Return type

**ServerControllersModelsEmployeeDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Сотрудник успешно получен. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Сотрудник не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1EmployeesPlantsGet**
> Array<ServerControllersModelsPlantDTO> apiV1EmployeesPlantsGet()


### Example

```typescript
import {
    EmployeeApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new EmployeeApi(configuration);

let employeeId: string; //Идентификатор сотрудника. (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1EmployeesPlantsGet(
    employeeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **employeeId** | [**string**] | Идентификатор сотрудника. | (optional) defaults to undefined|


### Return type

**Array<ServerControllersModelsPlantDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список растений успешно получен. |  -  |
|**400** | Некорректные данные. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Сотрудник не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

