# ServerControllersModelsSeedDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**plantId** | **string** |  | [optional] [default to undefined]
**maturity** | **string** |  | [optional] [default to undefined]
**viability** | [**ServerControllersModelsEnumsEnumViability**](ServerControllersModelsEnumsEnumViability.md) |  | [optional] [default to undefined]
**lightRequirements** | [**ServerControllersModelsEnumsEnumLight**](ServerControllersModelsEnumsEnumLight.md) |  | [optional] [default to undefined]
**waterRequirements** | **string** |  | [optional] [default to undefined]
**temperatureRequirements** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ServerControllersModelsSeedDTO } from 'api-client';

const instance: ServerControllersModelsSeedDTO = {
    id,
    plantId,
    maturity,
    viability,
    lightRequirements,
    waterRequirements,
    temperatureRequirements,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
