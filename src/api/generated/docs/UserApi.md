# UserApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1UsersGet**](#apiv1usersget) | **GET** /api/v1/users | Получение списка всех пользователей (только для администраторов)|
|[**apiV1UsersMeGet**](#apiv1usersmeget) | **GET** /api/v1/users/me | Получение информации о текущем пользователе|

# **apiV1UsersGet**
> Array<ServerControllersModelsAuthUserDTO> apiV1UsersGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.apiV1UsersGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<ServerControllersModelsAuthUserDTO>**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Список пользователей получен успешно |  -  |
|**401** | Пользователь не авторизован |  -  |
|**403** | Недостаточно прав |  -  |
|**500** | Ошибка на стороне сервера |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1UsersMeGet**
> ServerControllersModelsUserDTO apiV1UsersMeGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.apiV1UsersMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ServerControllersModelsUserDTO**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Информация о пользователе |  -  |
|**400** | Ошибка обработки запроса |  -  |
|**401** | Пользователь не авторизован |  -  |
|**404** | Пользователь не найден |  -  |
|**500** | Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

