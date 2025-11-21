# GrowthStageApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1GrowthStagesGet**](#apiv1growthstagesget) | **GET** /api/v1/growth-stages | Получить стадии роста с возможностью фильтрации.|
|[**apiV1GrowthStagesIdGet**](#apiv1growthstagesidget) | **GET** /api/v1/growth-stages/{id} | Получить стадию роста по идентификатору.|

# **apiV1GrowthStagesGet**
> Array<ServerControllersModelsGrowthStageDTO> apiV1GrowthStagesGet()


### Example

```typescript
import {
    GrowthStageApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new GrowthStageApi(configuration);

let name: string; //Название стадии роста (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1GrowthStagesGet(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] | Название стадии роста (опционально). | (optional) defaults to undefined|


### Return type

**Array<ServerControllersModelsGrowthStageDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список стадий роста успешно получен. |  -  |
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Стадия роста не найдена. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1GrowthStagesIdGet**
> ServerControllersModelsGrowthStageDTO apiV1GrowthStagesIdGet()


### Example

```typescript
import {
    GrowthStageApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new GrowthStageApi(configuration);

let id: string; //Идентификатор стадии роста. (default to undefined)

const { status, data } = await apiInstance.apiV1GrowthStagesIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор стадии роста. | defaults to undefined|


### Return type

**ServerControllersModelsGrowthStageDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Стадия роста успешно получена. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Стадия роста не найдена. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

