## api-client@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install api-client@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AdministratorApi* | [**apiV1AdministratorsGet**](docs/AdministratorApi.md#apiv1administratorsget) | **GET** /api/v1/administrators | Получить администраторов с возможностью фильтрации.
*AdministratorApi* | [**apiV1AdministratorsIdGet**](docs/AdministratorApi.md#apiv1administratorsidget) | **GET** /api/v1/administrators/{id} | Получить администратора по идентификатору.
*AdministratorApi* | [**apiV1AdministratorsPost**](docs/AdministratorApi.md#apiv1administratorspost) | **POST** /api/v1/administrators | Создать нового администратора.
*AuthApi* | [**apiV1AuthLoginPost**](docs/AuthApi.md#apiv1authloginpost) | **POST** /api/v1/auth/login | Аутентификация пользователя
*AuthApi* | [**apiV1AuthRegisterPost**](docs/AuthApi.md#apiv1authregisterpost) | **POST** /api/v1/auth/register | Регистрация нового пользователя
*ClientApi* | [**apiV1ClientsClientIdRolePatch**](docs/ClientApi.md#apiv1clientsclientidrolepatch) | **PATCH** /api/v1/clients/{clientId}/role | Изменить роль пользователя.
*ClientApi* | [**apiV1ClientsGet**](docs/ClientApi.md#apiv1clientsget) | **GET** /api/v1/clients | Получить клиентов с возможностью фильтрации.
*ClientApi* | [**apiV1ClientsIdGet**](docs/ClientApi.md#apiv1clientsidget) | **GET** /api/v1/clients/{id} | Получить клиента по идентификатору.
*ClientApi* | [**apiV1ClientsJournalRecordsGet**](docs/ClientApi.md#apiv1clientsjournalrecordsget) | **GET** /api/v1/clients/journal-records | Получить записи журнала клиента.
*ClientApi* | [**apiV1ClientsPlantsGet**](docs/ClientApi.md#apiv1clientsplantsget) | **GET** /api/v1/clients/plants | Получить растения клиента.
*DocumentationApi* | [**documentationGet**](docs/DocumentationApi.md#documentationget) | **GET** /Documentation | 
*EmployeeApi* | [**apiV1EmployeesGet**](docs/EmployeeApi.md#apiv1employeesget) | **GET** /api/v1/employees | Получить сотрудников с возможностью фильтрации.
*EmployeeApi* | [**apiV1EmployeesIdGet**](docs/EmployeeApi.md#apiv1employeesidget) | **GET** /api/v1/employees/{id} | Получить сотрудника по идентификатору.
*EmployeeApi* | [**apiV1EmployeesPlantsGet**](docs/EmployeeApi.md#apiv1employeesplantsget) | **GET** /api/v1/employees/plants | Получить растения сотрудника.
*GrowthStageApi* | [**apiV1GrowthStagesGet**](docs/GrowthStageApi.md#apiv1growthstagesget) | **GET** /api/v1/growth-stages | Получить стадии роста с возможностью фильтрации.
*GrowthStageApi* | [**apiV1GrowthStagesIdGet**](docs/GrowthStageApi.md#apiv1growthstagesidget) | **GET** /api/v1/growth-stages/{id} | Получить стадию роста по идентификатору.
*JournalRecordApi* | [**apiV1JournalRecordsGet**](docs/JournalRecordApi.md#apiv1journalrecordsget) | **GET** /api/v1/journal-records | Получить записи журнала с возможностью фильтрации.
*JournalRecordApi* | [**apiV1JournalRecordsIdDelete**](docs/JournalRecordApi.md#apiv1journalrecordsiddelete) | **DELETE** /api/v1/journal-records/{id} | Удалить запись в журнале.
*JournalRecordApi* | [**apiV1JournalRecordsIdGet**](docs/JournalRecordApi.md#apiv1journalrecordsidget) | **GET** /api/v1/journal-records/{id} | Получить запись журнала по идентификатору.
*JournalRecordApi* | [**apiV1JournalRecordsIdPut**](docs/JournalRecordApi.md#apiv1journalrecordsidput) | **PUT** /api/v1/journal-records/{id} | Обновить запись в журнале.
*JournalRecordApi* | [**apiV1JournalRecordsPost**](docs/JournalRecordApi.md#apiv1journalrecordspost) | **POST** /api/v1/journal-records | Создать новую запись в журнале.
*PlantApi* | [**apiV1PlantsGet**](docs/PlantApi.md#apiv1plantsget) | **GET** /api/v1/plants | Получить растения с возможностью фильтрации.
*PlantApi* | [**apiV1PlantsIdDelete**](docs/PlantApi.md#apiv1plantsiddelete) | **DELETE** /api/v1/plants/{id} | Удалить растение.
*PlantApi* | [**apiV1PlantsIdGet**](docs/PlantApi.md#apiv1plantsidget) | **GET** /api/v1/plants/{id} | Получить растение по идентификатору.
*PlantApi* | [**apiV1PlantsIdPut**](docs/PlantApi.md#apiv1plantsidput) | **PUT** /api/v1/plants/{id} | Обновить данные растения.
*PlantApi* | [**apiV1PlantsPost**](docs/PlantApi.md#apiv1plantspost) | **POST** /api/v1/plants | Создать новое растение.
*SeedApi* | [**apiV1SeedsGet**](docs/SeedApi.md#apiv1seedsget) | **GET** /api/v1/seeds | Получить семена с возможностью фильтрации.
*SeedApi* | [**apiV1SeedsIdDelete**](docs/SeedApi.md#apiv1seedsiddelete) | **DELETE** /api/v1/seeds/{id} | Удалить семя.
*SeedApi* | [**apiV1SeedsIdGet**](docs/SeedApi.md#apiv1seedsidget) | **GET** /api/v1/seeds/{id} | Получить семя по идентификатору.
*SeedApi* | [**apiV1SeedsIdPut**](docs/SeedApi.md#apiv1seedsidput) | **PUT** /api/v1/seeds/{id} | Обновить данные семени.
*SeedApi* | [**apiV1SeedsPost**](docs/SeedApi.md#apiv1seedspost) | **POST** /api/v1/seeds | Создать новое семя.
*UserApi* | [**apiV1UsersGet**](docs/UserApi.md#apiv1usersget) | **GET** /api/v1/users | Получение списка всех пользователей (только для администраторов)
*UserApi* | [**apiV1UsersMeGet**](docs/UserApi.md#apiv1usersmeget) | **GET** /api/v1/users/me | Получение информации о текущем пользователе


### Documentation For Models

 - [DomainModelsEnumsEnumAuth](docs/DomainModelsEnumsEnumAuth.md)
 - [ServerControllersModelsAdministratorDTO](docs/ServerControllersModelsAdministratorDTO.md)
 - [ServerControllersModelsAuthUserDTO](docs/ServerControllersModelsAuthUserDTO.md)
 - [ServerControllersModelsClientDTO](docs/ServerControllersModelsClientDTO.md)
 - [ServerControllersModelsCreateAdministratorRequestDto](docs/ServerControllersModelsCreateAdministratorRequestDto.md)
 - [ServerControllersModelsEmployeeDTO](docs/ServerControllersModelsEmployeeDTO.md)
 - [ServerControllersModelsEnumsEnumAuth](docs/ServerControllersModelsEnumsEnumAuth.md)
 - [ServerControllersModelsEnumsEnumCondition](docs/ServerControllersModelsEnumsEnumCondition.md)
 - [ServerControllersModelsEnumsEnumFlowers](docs/ServerControllersModelsEnumsEnumFlowers.md)
 - [ServerControllersModelsEnumsEnumFruit](docs/ServerControllersModelsEnumsEnumFruit.md)
 - [ServerControllersModelsEnumsEnumLight](docs/ServerControllersModelsEnumsEnumLight.md)
 - [ServerControllersModelsEnumsEnumReproduction](docs/ServerControllersModelsEnumsEnumReproduction.md)
 - [ServerControllersModelsEnumsEnumViability](docs/ServerControllersModelsEnumsEnumViability.md)
 - [ServerControllersModelsGrowthStageDTO](docs/ServerControllersModelsGrowthStageDTO.md)
 - [ServerControllersModelsJournalRecordDTO](docs/ServerControllersModelsJournalRecordDTO.md)
 - [ServerControllersModelsLoginRequestDto](docs/ServerControllersModelsLoginRequestDto.md)
 - [ServerControllersModelsLoginResponseDto](docs/ServerControllersModelsLoginResponseDto.md)
 - [ServerControllersModelsPlantDTO](docs/ServerControllersModelsPlantDTO.md)
 - [ServerControllersModelsRegisterRequestDto](docs/ServerControllersModelsRegisterRequestDto.md)
 - [ServerControllersModelsSeedDTO](docs/ServerControllersModelsSeedDTO.md)
 - [ServerControllersModelsUpdateUserRoleRequestDto](docs/ServerControllersModelsUpdateUserRoleRequestDto.md)
 - [ServerControllersModelsUserDTO](docs/ServerControllersModelsUserDTO.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="Bearer"></a>
### Bearer

- **Type**: API key
- **API key parameter name**: Authorization
- **Location**: HTTP header

