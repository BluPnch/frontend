# SeedApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1SeedsGet**](#apiv1seedsget) | **GET** /api/v1/seeds | Получить семена с возможностью фильтрации.|
|[**apiV1SeedsIdDelete**](#apiv1seedsiddelete) | **DELETE** /api/v1/seeds/{id} | Удалить семя.|
|[**apiV1SeedsIdGet**](#apiv1seedsidget) | **GET** /api/v1/seeds/{id} | Получить семя по идентификатору.|
|[**apiV1SeedsIdPut**](#apiv1seedsidput) | **PUT** /api/v1/seeds/{id} | Обновить данные семени.|
|[**apiV1SeedsPost**](#apiv1seedspost) | **POST** /api/v1/seeds | Создать новое семя.|

# **apiV1SeedsGet**
> Array<ServerControllersModelsSeedDTO> apiV1SeedsGet()


### Example

```typescript
import {
    SeedApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new SeedApi(configuration);

let maturity: string; //Зрелость семени (опционально). (optional) (default to undefined)
let viability: string; //Жизнеспособность семени (опционально). (optional) (default to undefined)

const { status, data } = await apiInstance.apiV1SeedsGet(
    maturity,
    viability
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **maturity** | [**string**] | Зрелость семени (опционально). | (optional) defaults to undefined|
| **viability** | [**string**] | Жизнеспособность семени (опционально). | (optional) defaults to undefined|


### Return type

**Array<ServerControllersModelsSeedDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список семян успешно получен. |  -  |
|**400** | Некорректные параметры запроса. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Семена не найдены. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SeedsIdDelete**
> apiV1SeedsIdDelete()


### Example

```typescript
import {
    SeedApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new SeedApi(configuration);

let id: string; //Идентификатор семени. (default to undefined)

const { status, data } = await apiInstance.apiV1SeedsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор семени. | defaults to undefined|


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
|**204** | Семя успешно удалено. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Семя не найдено. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SeedsIdGet**
> ServerControllersModelsSeedDTO apiV1SeedsIdGet()


### Example

```typescript
import {
    SeedApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new SeedApi(configuration);

let id: string; //Идентификатор семени. (default to undefined)

const { status, data } = await apiInstance.apiV1SeedsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Идентификатор семени. | defaults to undefined|


### Return type

**ServerControllersModelsSeedDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Семя успешно получено. |  -  |
|**400** | Некорректный идентификатор. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Семя не найдено. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SeedsIdPut**
> apiV1SeedsIdPut()


### Example

```typescript
import {
    SeedApi,
    Configuration,
    ServerControllersModelsSeedDTO
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new SeedApi(configuration);

let id: string; //Идентификатор семени. (default to undefined)
let serverControllersModelsSeedDTO: ServerControllersModelsSeedDTO; // (optional)

const { status, data } = await apiInstance.apiV1SeedsIdPut(
    id,
    serverControllersModelsSeedDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsSeedDTO** | **ServerControllersModelsSeedDTO**|  | |
| **id** | [**string**] | Идентификатор семени. | defaults to undefined|


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
|**204** | Семя успешно обновлено. |  -  |
|**400** | Некорректные данные семени. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**404** | Семя не найдено. |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1SeedsPost**
> ServerControllersModelsSeedDTO apiV1SeedsPost()


### Example

```typescript
import {
    SeedApi,
    Configuration,
    ServerControllersModelsSeedDTO
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new SeedApi(configuration);

let serverControllersModelsSeedDTO: ServerControllersModelsSeedDTO; // (optional)

const { status, data } = await apiInstance.apiV1SeedsPost(
    serverControllersModelsSeedDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsSeedDTO** | **ServerControllersModelsSeedDTO**|  | |


### Return type

**ServerControllersModelsSeedDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Семя успешно создано. |  -  |
|**400** | Некорректные данные семени. |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

