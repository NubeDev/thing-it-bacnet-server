# Installing

```
npm install
```

# Usage


## Start

```
npm start -- <options...>
```

## Options

- `--port <port>` (by default `47808`): port of the server.
- `--filePath <file_path>`: path to the `EDE` file.
- `--reqDelay <delay>` (by default `20 ms`): timeout between end of old request and start of new request.
- `--reqThread <thread>` (by default `1`): number of concurrent unicast requests to the one `IP:PORT`.

# Units

Application implements two types of units:
- `native` units - implements simulation logic to change properties of the `BACnet Object`s by the algorithms of the `BACnet` protocol.
- `custom` units - implements simulation logic of `custom` devices. Eg: `noop`, `function`, `termostat`, `jalousie` etc.

# EDE file

Application processed next optional EDE columns:

`cust.-unit-type` | `cust.-unit-id` | `cust.-unit-fn` | `cust.-min.-value` | `cust.-max.-value` | `cust.-freq`
- `cust.-unit-type` (default: `noop`): type of the `custom` unit.
- `cust.-unit-id` (default: `auto`): ID of the `custom` unit.
- `cust.-unit-fn` (default: `''`): function of the `native` unit in the `custom` unit.
- `cust.-min.-value` (default: get from `cust.-unit-fn`): min value for simulation algorithm.
- `cust.-max.-value` (default: get from `cust.-unit-fn`): max value for simulation algorithm.
- `cust.-freq` (default: get from `cust.-unit-fn`): frequency of changes of values.

