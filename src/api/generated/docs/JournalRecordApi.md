# JournalRecordApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1JournalRecordsGet**](#apiv1journalrecordsget) | **GET** /api/v1/journal-records | Получить записи журнала с возможностью фильтрации.|
|[**apiV1JournalRecordsIdDelete**](#apiv1journalrecordsiddelete) | **DELETE** /api/v1/journal-records/{id} | Удалить запись в журнале.|
|[**apiV1JournalRecordsIdGet**](#apiv1journalrecordsidget) | **GET** /api/v1/journal-records/{id} | Получить запись журнала по идентификатору.|
|[**apiV1JournalRecordsIdPut**](#apiv1journalrecordsidput) | **PUT** /api/v1/journal-records/{id} | Обновить запись в журнале.|
|[**apiV1JournalRecordsPost**](#apiv1journalrecordspost) | **POST** /api/v1/journal-records | Создать новую запись в журнале.|

# **apiV1JournalRecordsGet**
> Array<ServerControllersModelsJournalRecordDTO> apiV1JournalRecordsGet()


### Example

```typescript
import {
    JournalRecordApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new JournalRecordApi(configuration);

let plantId: string; //Идентификатор растения (опционально). (optional) (default to undefined)
let startDate: string; //Начальная дата периода (опционально). (optional) (default to undefined)
let endDate: string; //Конечная дата периода (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1JournalRecordsGet(
    plantId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **plantId** | [**string**] | Идентификатор растения (опционально). | (optional) defaults to undefined|
| **startDate** | [**string**] | Начальная дата периода (опционально). | (optional) defaults to undefined|
| **endDate** | [**string**] | Конечная дата периода (опционально). | (optional) defaults to undefined|


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
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Записи не найдены. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1JournalRecordsIdDelete**
> apiV1JournalRecordsIdDelete()


### Example

```typescript
import {
    JournalRecordApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new JournalRecordApi(configuration);

let id: string; //Идентификатор записи. (default to undefined)

const { status, data } = await apiInstance.apiV1JournalRecordsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор записи. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Запись успешно удалена. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Запись не найдена. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1JournalRecordsIdGet**
> ServerControllersModelsJournalRecordDTO apiV1JournalRecordsIdGet()


### Example

```typescript
import {
    JournalRecordApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new JournalRecordApi(configuration);

let id: string; //Идентификатор записи журнала. (default to undefined)

const { status, data } = await apiInstance.apiV1JournalRecordsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор записи журнала. | defaults to undefined|


### Return type

**ServerControllersModelsJournalRecordDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Запись журнала успешно получена. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Запись журнала не найдена. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1JournalRecordsIdPut**
> apiV1JournalRecordsIdPut()


### Example

```typescript
import {
    JournalRecordApi,
    Configuration,
    ServerControllersModelsJournalRecordDTO
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new JournalRecordApi(configuration);

let id: string; //Идентификатор записи. (default to undefined)
let serverControllersModelsJournalRecordDTO: ServerControllersModelsJournalRecordDTO; // (optional)

const { status, data } = await apiInstance.apiV1JournalRecordsIdPut(
    id,
    serverControllersModelsJournalRecordDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsJournalRecordDTO** | **ServerControllersModelsJournalRecordDTO**|  | |
| **id** | [**string**] | Идентификатор записи. | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Запись успешно обновлена. |  -  |
|**400** | Некорректные данные записи. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Запись не найдена. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1JournalRecordsPost**
> ServerControllersModelsJournalRecordDTO apiV1JournalRecordsPost()


### Example

```typescript
import {
    JournalRecordApi,
    Configuration,
    ServerControllersModelsJournalRecordDTO
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new JournalRecordApi(configuration);

let serverControllersModelsJournalRecordDTO: ServerControllersModelsJournalRecordDTO; // (optional)

const { status, data } = await apiInstance.apiV1JournalRecordsPost(
    serverControllersModelsJournalRecordDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsJournalRecordDTO** | **ServerControllersModelsJournalRecordDTO**|  | |


### Return type

**ServerControllersModelsJournalRecordDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Запись успешно создана. |  -  |
|**400** | Некорректные данные записи. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

