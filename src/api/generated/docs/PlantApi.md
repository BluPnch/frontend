# PlantApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1PlantsGet**](#apiv1plantsget) | **GET** /api/v1/plants | Получить растения с возможностью фильтрации.|
|[**apiV1PlantsIdDelete**](#apiv1plantsiddelete) | **DELETE** /api/v1/plants/{id} | Удалить растение.|
|[**apiV1PlantsIdGet**](#apiv1plantsidget) | **GET** /api/v1/plants/{id} | Получить растение по идентификатору.|
|[**apiV1PlantsIdPut**](#apiv1plantsidput) | **PUT** /api/v1/plants/{id} | Обновить данные растения.|
|[**apiV1PlantsPost**](#apiv1plantspost) | **POST** /api/v1/plants | Создать новое растение.|

# **apiV1PlantsGet**
> Array<ServerControllersModelsPlantDTO> apiV1PlantsGet()


### Example

```typescript
import {
    PlantApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new PlantApi(configuration);

let family: string; //Семейство растения (опционально). (optional) (default to undefined)
let species: string; //Вид растения (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1PlantsGet(
    family,
    species
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **family** | [**string**] | Семейство растения (опционально). | (optional) defaults to undefined|
| **species** | [**string**] | Вид растения (опционально). | (optional) defaults to undefined|


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
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Растения не найдены. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PlantsIdDelete**
> apiV1PlantsIdDelete()


### Example

```typescript
import {
    PlantApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new PlantApi(configuration);

let id: string; //Идентификатор растения. (default to undefined)

const { status, data } = await apiInstance.apiV1PlantsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор растения. | defaults to undefined|


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
|**204** | Растение успешно удалено. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Растение не найдено. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PlantsIdGet**
> ServerControllersModelsPlantDTO apiV1PlantsIdGet()


### Example

```typescript
import {
    PlantApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new PlantApi(configuration);

let id: string; //Идентификатор растения. (default to undefined)

const { status, data } = await apiInstance.apiV1PlantsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор растения. | defaults to undefined|


### Return type

**ServerControllersModelsPlantDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Растение успешно получено. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Растение не найдено. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PlantsIdPut**
> apiV1PlantsIdPut()


### Example

```typescript
import {
    PlantApi,
    Configuration,
    ServerControllersModelsPlantDTO
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new PlantApi(configuration);

let id: string; //Идентификатор растения. (default to undefined)
let serverControllersModelsPlantDTO: ServerControllersModelsPlantDTO; // (optional)

const { status, data } = await apiInstance.apiV1PlantsIdPut(
    id,
    serverControllersModelsPlantDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsPlantDTO** | **ServerControllersModelsPlantDTO**|  | |
| **id** | [**string**] | Идентификатор растения. | defaults to undefined|


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
|**204** | Растение успешно обновлено. |  -  |
|**400** | Некорректные данные растения. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Растение не найдено. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1PlantsPost**
> ServerControllersModelsPlantDTO apiV1PlantsPost()


### Example

```typescript
import {
    PlantApi,
    Configuration,
    ServerControllersModelsPlantDTO
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new PlantApi(configuration);

let serverControllersModelsPlantDTO: ServerControllersModelsPlantDTO; //Данные растения. (optional)

const { status, data } = await apiInstance.apiV1PlantsPost(
    serverControllersModelsPlantDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsPlantDTO** | **ServerControllersModelsPlantDTO**| Данные растения. | |


### Return type

**ServerControllersModelsPlantDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Растение успешно создано. |  -  |
|**400** | Некорректные данные. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

