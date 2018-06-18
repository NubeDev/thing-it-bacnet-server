# Installing

```
npm install
```

# Usage


## Start

```
npm start -- <options...> - start bacnet-server for single ede-file
npm run start-docker -- <options...> - start simulation for a folder of ede-files, with wrapping each bacnet-server instance with docker container
```

## Options

### start options
- `--port <port>` (by default `47808`): port of the server.
- `--filePath <file_path>`: path to the `EDE` file.
- `--reqDelay <delay>` (by default `20 ms`): timeout between end of old request and start of new request.
- `--reqThread <thread>` (by default `1`): number of concurrent unicast requests to the one `IP:PORT`.

### Docker service options
- `--port <port>` (by default `47808`): port of the server.
- `--dirPath <dir_path>`: path to the `EDE` files directory.
- `--outputAddr <output_address>`: ip address of the remote thing-it-bacnet-device to connect.
- `--outputPort <output_port` (by default `47808`): port of remote thing-it-bacnet-device to connect.

# Units

Application implements two types of units:
- `native` units - implements simulation logic to change properties of the `BACnet Object`s by the algorithms of the `BACnet` protocol.
- `custom` units - implements simulation logic of `custom` devices. Eg: `noop`, `function`, `termostat`, `jalousie` etc.

## Custom units

### Noop

Implements the `No operation` logic. It sets as default value for `cust.-unit-type` column in EDE files.

Aliases: `''`, `default`, `0`, `noop`.

Functions:
- `default` (aliasses: `''`, `default`): implements the `No operation` logic.

### Function

Implements the `distribution (mathematics)` logic.

Aliases: `1`, `fn`, `func`, `function`.

Functions:
- `uniform` (aliases: `''`, `default`, `0`, `unif`, `uniform`, `uniformDistribution`): implements the logic of changes of `Present Value` property by `uniform` distribution.
- `normal` (aliases: `1`, `gaus`, `gaussian`, `norm`, `normal`, `normalDistribution`): implements the logic of changes of `Present Value` property by `normal` distribution.

# EDE file

## Restrictions

Aplication processes a specific set of columns. Increasing, decreasing or changing an order in the list of columns provided below will cause errors and unstable work of the application

### Native units

Here is a set of `native` units columns which are correctly processed by the app
1. `#keyname`
2. `device obj.-instance`
3. `object-name`
4. `object-type`
5. `object-instance`
6. `description`
7. `present-value-default`
8. `min-present-value`
9. `max-present-value`
10. `commandable`
11. `supports COV`
12. `hi-limit`
13. `low-limit`
14. `state-text-reference`
15. `unit-code`
16. `vendor-specific-address`

### Custom units

Application processes next optional EDE columns:

17. `cust.-unit-type` 
18. `cust.-unit-id`
19. `cust.-unit-fn`
20. `cust.-min.-value`
21. `cust.-max.-value`
22. `cust.-freq`
- `cust.-unit-type` (default: `noop`): type of the `custom` unit.
- `cust.-unit-id` (default: `auto`): ID of the `custom` unit.
- `cust.-unit-fn` (default: `''`): function of the `native` unit in the `custom` unit.
- `cust.-min.-value` (default: get from `cust.-unit-fn`): min value for simulation algorithm.
- `cust.-max.-value` (default: get from `cust.-unit-fn`): max value for simulation algorithm.
- `cust.-freq` (default: get from `cust.-unit-fn`): frequency of changes of values.

### File references

Currently, application is unable to process additional file references inside the main EDE file. Entries with object type 10 will be processed as `default` native units
