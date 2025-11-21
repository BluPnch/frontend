# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiV1AuthLoginPost**](#apiv1authloginpost) | **POST** /api/v1/auth/login | Аутентификация пользователя|
|[**apiV1AuthRegisterPost**](#apiv1authregisterpost) | **POST** /api/v1/auth/register | Регистрация нового пользователя|

# **apiV1AuthLoginPost**
> ServerControllersModelsLoginResponseDto apiV1AuthLoginPost()


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ServerControllersModelsLoginRequestDto
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let serverControllersModelsLoginRequestDto: ServerControllersModelsLoginRequestDto; // (optional)

const { status, data } = await apiInstance.apiV1AuthLoginPost(
    serverControllersModelsLoginRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsLoginRequestDto** | **ServerControllersModelsLoginRequestDto**|  | |


### Return type

**ServerControllersModelsLoginResponseDto**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Успешный вход в систему |  -  |
|**401** | Неверные учетные данные или ошибка валидации |  -  |
|**500** | Ошибка на стороне сервера. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiV1AuthRegisterPost**
> ServerControllersModelsLoginResponseDto apiV1AuthRegisterPost()


### Example

```typescript
import {
    AuthApi,
    Configuration,
    ServerControllersModelsRegisterRequestDto
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let serverControllersModelsRegisterRequestDto: ServerControllersModelsRegisterRequestDto; // (optional)

const { status, data } = await apiInstance.apiV1AuthRegisterPost(
    serverControllersModelsRegisterRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **serverControllersModelsRegisterRequestDto** | **ServerControllersModelsRegisterRequestDto**|  | |


### Return type

**ServerControllersModelsLoginResponseDto**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Пользователь успешно зарегистрирован |  -  |
|**400** | Ошибка валидации |  -  |
|**409** | Пользователь с таким email уже существует |  -  |
|**500** | Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

