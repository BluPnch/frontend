# AdministratorApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1AdministratorsGet**](#apiv1administratorsget) | **GET** /api/v1/administrators | Получить администраторов с возможностью фильтрации.|
|[**apiV1AdministratorsIdGet**](#apiv1administratorsidget) | **GET** /api/v1/administrators/{id} | Получить администратора по идентификатору.|
|[**apiV1AdministratorsPost**](#apiv1administratorspost) | **POST** /api/v1/administrators | Создать нового администратора.|

# **apiV1AdministratorsGet**
> Array<ServerControllersModelsAdministratorDTO> apiV1AdministratorsGet()


### Example

```typescript
import {
    AdministratorApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new AdministratorApi(configuration);

let surname: string; //Фамилия администратора (опционально). (optional) (default to undefined)
let name: string; //Имя администратора (опционально). (optional) (default to undefined)
let patronymic: string; //Отчество администратора (опционально). (optional) (default to undefined)
let phoneNumber: string; //Номер телефона администратора (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1AdministratorsGet(
    surname,
    name,
    patronymic,
    phoneNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **surname** | [**string**] | Фамилия администратора (опционально). | (optional) defaults to undefined|
| **name** | [**string**] | Имя администратора (опционально). | (optional) defaults to undefined|
| **patronymic** | [**string**] | Отчество администратора (опционально). | (optional) defaults to undefined|
| **phoneNumber** | [**string**] | Номер телефона администратора (опционально). | (optional) defaults to undefined|


### Return type

**Array<ServerControllersModelsAdministratorDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список администраторов успешно получен. |  -  |
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Администратор не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AdministratorsIdGet**
> ServerControllersModelsAdministratorDTO apiV1AdministratorsIdGet()


### Example

```typescript
import {
    AdministratorApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new AdministratorApi(configuration);

let id: string; //Идентификатор администратора. (default to undefined)

const { status, data } = await apiInstance.apiV1AdministratorsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор администратора. | defaults to undefined|


### Return type

**ServerControllersModelsAdministratorDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Администратор успешно получен. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Администратор не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AdministratorsPost**
> ServerControllersModelsAdministratorDTO apiV1AdministratorsPost()


### Example

```typescript
import {
    AdministratorApi,
    Configuration,
    ServerControllersModelsCreateAdministratorRequestDto
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new AdministratorApi(configuration);

let serverControllersModelsCreateAdministratorRequestDto: ServerControllersModelsCreateAdministratorRequestDto; //Данные для создания администратора. (optional)

const { status, data } = await apiInstance.apiV1AdministratorsPost(
    serverControllersModelsCreateAdministratorRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsCreateAdministratorRequestDto** | **ServerControllersModelsCreateAdministratorRequestDto**| Данные для создания администратора. | |


### Return type

**ServerControllersModelsAdministratorDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Администратор успешно создан. |  -  |
|**400** | Некорректные данные администратора. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

