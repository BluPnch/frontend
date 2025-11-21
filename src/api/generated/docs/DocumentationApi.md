# DocumentationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**documentationGet**](#documentationget) | **GET** /Documentation | |

# **documentationGet**
> documentationGet()


### Example

```typescript
import {
    DocumentationApi,
    Configuration
} from 'api-client';

const configuration = new Configuration();
const apiInstance = new DocumentationApi(configuration);

const { status, data } = await apiInstance.documentationGet();
```

### Parameters
This endpoint does not have any parameters.


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
|**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

