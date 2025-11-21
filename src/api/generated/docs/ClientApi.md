# ClientApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1ClientsClientIdRolePatch**](#apiv1clientsclientidrolepatch) | **PATCH** /api/v1/clients/{clientId}/role | Изменить роль пользователя.|
|[**apiV1ClientsGet**](#apiv1clientsget) | **GET** /api/v1/clients | Получить клиентов с возможностью фильтрации.|
|[**apiV1ClientsIdGet**](#apiv1clientsidget) | **GET** /api/v1/clients/{id} | Получить клиента по идентификатору.|
|[**apiV1ClientsJournalRecordsGet**](#apiv1clientsjournalrecordsget) | **GET** /api/v1/clients/journal-records | Получить записи журнала клиента.|
|[**apiV1ClientsPlantsGet**](#apiv1clientsplantsget) | **GET** /api/v1/clients/plants | Получить растения клиента.|

# **apiV1ClientsClientIdRolePatch**
> ServerControllersModelsAuthUserDTO apiV1ClientsClientIdRolePatch()


### Example

```typescript
import {
    ClientApi,
    Configuration,
    ServerControllersModelsUpdateUserRoleRequestDto
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new ClientApi(configuration);

let clientId: string; //Идентификатор пользователя. (default to undefined)
let serverControllersModelsUpdateUserRoleRequestDto: ServerControllersModelsUpdateUserRoleRequestDto; //Данные для изменения роли. (optional)

const { status, data } = await apiInstance.apiV1ClientsClientIdRolePatch(
    clientId,
    serverControllersModelsUpdateUserRoleRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsUpdateUserRoleRequestDto** | **ServerControllersModelsUpdateUserRoleRequestDto**| Данные для изменения роли. | |
| **clientId** | [**string**] | Идентификатор пользователя. | defaults to undefined|


### Return type

**ServerControllersModelsAuthUserDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Роль пользователя успешно изменена. |  -  |
|**400** | Некорректные данные. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Пользователь не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ClientsGet**
> Array<ServerControllersModelsClientDTO> apiV1ClientsGet()


### Example

```typescript
import {
    ClientApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new ClientApi(configuration);

let companyName: string; //Название компании клиента (опционально). (optional) (default to undefined)
let phoneNumber: string; //Телефон клиента (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1ClientsGet(
    companyName,
    phoneNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **companyName** | [**string**] | Название компании клиента (опционально). | (optional) defaults to undefined|
| **phoneNumber** | [**string**] | Телефон клиента (опционально). | (optional) defaults to undefined|


### Return type

**Array<ServerControllersModelsClientDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список клиентов успешно получен. |  -  |
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Клиент не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ClientsIdGet**
> ServerControllersModelsClientDTO apiV1ClientsIdGet()


### Example

```typescript
import {
    ClientApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new ClientApi(configuration);

let id: string; //Идентификатор клиента. (default to undefined)

const { status, data } = await apiInstance.apiV1ClientsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор клиента. | defaults to undefined|


### Return type

**ServerControllersModelsClientDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Клиент успешно получен. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Клиент не найден. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ClientsJournalRecordsGet**
> Array<ServerControllersModelsJournalRecordDTO> apiV1ClientsJournalRecordsGet()


### Example

```typescript
import {
    ClientApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new ClientApi(configuration);

const { status, data } = await apiInstance.apiV1ClientsJournalRecordsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ServerControllersModelsJournalRecordDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список записей успешно получен. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Клиент не найден |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1ClientsPlantsGet**
> Array<ServerControllersModelsPlantDTO> apiV1ClientsPlantsGet()


### Example

```typescript
import {
    ClientApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new ClientApi(configuration);

const { status, data } = await apiInstance.apiV1ClientsPlantsGet();
```

### Parameters
This endpoint does not have any parameters.


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
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Клиент не найден |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

