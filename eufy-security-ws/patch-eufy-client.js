const fs = require("fs");
const path = require("path");

const clientRoot = path.join(__dirname, "node_modules", "eufy-security-client", "build", "http");
const typesPath = path.join(clientRoot, "types.js");
const devicePath = path.join(clientRoot, "device.js");
const p2pSessionPath = path.join(__dirname, "node_modules", "eufy-security-client", "build", "p2p", "session.js");
const wsDeviceMessageHandlerPath = path.join(__dirname, "node_modules", "eufy-security-ws", "dist", "lib", "device", "message_handler.js");
const wsServerPath = path.join(__dirname, "node_modules", "eufy-security-ws", "dist", "lib", "server.js");

function replaceOnce(filePath, search, replacement) {
  const original = fs.readFileSync(filePath, "utf8");
  const count = original.split(search).length - 1;
  if (count !== 1) {
    throw new Error(`Expected one match in ${filePath} for: ${search.slice(0, 120)}`);
  }

  fs.writeFileSync(filePath, original.replace(search, replacement));
}

function ensureContains(filePath, text) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(text)) {
    throw new Error(`Patch verification failed for ${filePath}: missing ${text}`);
  }
}

replaceOnce(
  typesPath,
  '    DeviceType[DeviceType["LOCK_85V0"] = 203] = "LOCK_85V0";',
  '    DeviceType[DeviceType["LOCK_85V0"] = 203] = "LOCK_85V0";\n' +
    '    DeviceType[DeviceType["LOCK_85F0"] = 205] = "LOCK_85F0";',
);

replaceOnce(
  typesPath,
  '        203: "FamiLock S3 (T85V0)",',
  '        203: "FamiLock S3 (T85V0)",\n' +
    '        205: "Smart Lock (T85F0)",',
);

replaceOnce(
  devicePath,
  '            else if (property.name === types_1.PropertyName.Model && this.isLockWifiT85V0()) {\n                return "T85V0";\n            }',
  '            else if (property.name === types_1.PropertyName.Model && this.isLockWifiT85V0()) {\n                return this.getSerial().startsWith("T85F0") ? "T85F0" : "T85V0";\n            }',
);

replaceOnce(
  devicePath,
  '            metadata[types_1.PropertyName.Type].states[this.getDeviceType()] = "FamiLock S3 (T85V0)";',
  '            metadata[types_1.PropertyName.Type].states[this.getDeviceType()] = this.getSerial().startsWith("T85F0") ? "Smart Lock (T85F0)" : "FamiLock S3 (T85V0)";',
);

replaceOnce(
  devicePath,
  '            type == types_1.DeviceType.LOCK_85V0 ||\n            type == types_1.DeviceType.INDOOR_OUTDOOR_CAMERA_1080P ||',
  '            type == types_1.DeviceType.INDOOR_OUTDOOR_CAMERA_1080P ||',
);

replaceOnce(
  devicePath,
  '            type == types_1.DeviceType.LOCK_85V0 ||\n            type == types_1.DeviceType.DOORBELL_SOLO)',
  '            type == types_1.DeviceType.DOORBELL_SOLO)',
);

replaceOnce(
  devicePath,
  '    static isLockWifiT85V0(type, serialnumber) {\n        if (type == types_1.DeviceType.LOCK_85V0 &&\n            serialnumber.startsWith("T85V0") &&\n            serialnumber.length > 6 &&\n            serialnumber.charAt(6) === "9")\n            return true;\n        return false;\n    }',
  '    static isLockWifiT85V0(type, serialnumber) {\n        if ((type == types_1.DeviceType.LOCK_85V0 && (serialnumber === "" || serialnumber.startsWith("T85V0"))) ||\n            (type == types_1.DeviceType.LOCK_85F0 && (serialnumber === "" || serialnumber.startsWith("T85F0"))))\n            return true;\n        return false;\n    }',
);

replaceOnce(
  typesPath,
  '    [DeviceType.MOTION_SENSOR]: [],',
  '    [DeviceType.LOCK_85V0]: [CommandName.DeviceUnlock],\n' +
    '    [DeviceType.LOCK_85F0]: [CommandName.DeviceUnlock],\n' +
    '    [DeviceType.MOTION_SENSOR]: [],',
);

ensureContains(typesPath, 'DeviceType["LOCK_85F0"] = 205');
ensureContains(typesPath, "[DeviceType.LOCK_85F0]: [CommandName.DeviceUnlock]");
ensureContains(devicePath, 'serialnumber.startsWith("T85F0")');
ensureContains(devicePath, 'Smart Lock (T85F0)');

replaceOnce(
  p2pSessionPath,
  '                else if (device_1.Device.isLockWifiR10(this.rawStation.device_type) ||\n                    device_1.Device.isLockWifiR20(this.rawStation.device_type)) {',
  '                else if (device_1.Device.isLockWifiR10(this.rawStation.device_type) ||\n                    device_1.Device.isLockWifiR20(this.rawStation.device_type) ||\n                    device_1.Device.isLockWifiT8506(this.rawStation.device_type) ||\n                    device_1.Device.isLockWifiT8502(this.rawStation.device_type) ||\n                    device_1.Device.isLockWifiT8510P(this.rawStation.device_type, this.rawStation.station_sn) ||\n                    device_1.Device.isLockWifiT8520P(this.rawStation.device_type, this.rawStation.station_sn) ||\n                    device_1.Device.isLockWifiT85L0(this.rawStation.device_type) ||\n                    device_1.Device.isLockWifiT85V0(this.rawStation.device_type, this.rawStation.station_sn)) {',
);

ensureContains(p2pSessionPath, "Device.isLockWifiT85V0(this.rawStation.device_type, this.rawStation.station_sn)");

replaceOnce(
  wsDeviceMessageHandlerPath,
  '            case DeviceCommand.setProperty:\n                await driver\n                    .setDeviceProperty(serialNumber, message.name, message.value)\n                    .catch((error) => {\n                    throw error;\n                });\n                return client.schemaVersion >= 13 ? { async: true } : {};',
  '            case DeviceCommand.setProperty:\n                if (message.name === "locked" && (device.getSerial().startsWith("T85V0") || device.getSerial().startsWith("T85F0"))) {\n                    if (!station.isConnected())\n                        await station.connect().catch(() => undefined);\n                    await new Promise((resolve) => setTimeout(resolve, 5000));\n                }\n                await driver\n                    .setDeviceProperty(serialNumber, message.name, message.value)\n                    .catch((error) => {\n                    throw error;\n                });\n                return client.schemaVersion >= 13 ? { async: true } : {};',
);

replaceOnce(
  wsDeviceMessageHandlerPath,
  '            case DeviceCommand.unlock:\n                if (client.schemaVersion >= 13) {\n                    station.unlock(device);\n                    return { async: true };\n                }\n                else {\n                    throw new UnknownCommandError(command);\n                }',
  '            case DeviceCommand.unlock:\n                if (client.schemaVersion >= 13) {\n                    if (device.getSerial().startsWith("T85V0") || device.getSerial().startsWith("T85F0")) {\n                        if (!station.isConnected())\n                            await station.connect().catch(() => undefined);\n                        await new Promise((resolve) => setTimeout(resolve, 5000));\n                        station.lockDevice(device, false);\n                    }\n                    else {\n                        station.unlock(device);\n                    }\n                    return { async: true };\n                }\n                else {\n                    throw new UnknownCommandError(command);\n                }',
);

ensureContains(wsDeviceMessageHandlerPath, 'station.lockDevice(device, false)');

replaceOnce(
  wsServerPath,
  'RTSPPropertyNotEnabledError, } from "eufy-security-client";',
  'RTSPPropertyNotEnabledError, PropertyName, } from "eufy-security-client";',
);

replaceOnce(
  wsServerPath,
  '                this.receiveEvents = true;\n                if (DriverMessageHandler.tfa) {',
  '                this.receiveEvents = true;\n                void (async () => {\n                    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n                    for (const station of await this.driver.getStations()) {\n                        try {\n                            const serial = station.getSerial();\n                            if (!serial.startsWith("T85V0") && !serial.startsWith("T85F0"))\n                                continue;\n                            if (!station.isConnected())\n                                await station.connect().catch(() => undefined);\n                            await sleep(5000);\n                            if (typeof station.getLockParameters === "function")\n                                station.getLockParameters();\n                            await sleep(5000);\n                            if (typeof station.getLockStatus === "function")\n                                station.getLockStatus();\n                            await sleep(10000);\n                            if (typeof station.getLockStatus === "function")\n                                station.getLockStatus();\n                        }\n                        catch (_err) { }\n                    }\n                })();\n                if (DriverMessageHandler.tfa) {',
);

replaceOnce(
  wsServerPath,
  '                    }\n                })();\n                if (DriverMessageHandler.tfa) {',
  '                    }\n                    for (const device of await this.driver.getDevices()) {\n                        try {\n                            const serial = device.getSerial();\n                            if (!serial.startsWith("T85V0") && !serial.startsWith("T85F0"))\n                                continue;\n                            const params = device.rawDevice?.params ?? [];\n                            const rawParam = (paramType) => params.find((param) => param.param_type === paramType)?.param_value;\n                            const lockedValue = serial.startsWith("T85V0") ? rawParam(6012) : (rawParam(6607) ?? rawParam(6609));\n                            if (lockedValue !== "0" && lockedValue !== "1")\n                                continue;\n                            const locked = lockedValue === "1";\n                            device.updateProperty(PropertyName.DeviceLockStatus, locked ? 4 : 3);\n                            device.updateProperty(PropertyName.DeviceLocked, locked);\n                        }\n                        catch (_err) { }\n                    }\n                })();\n                if (DriverMessageHandler.tfa) {',
);

ensureContains(wsServerPath, "station.getLockParameters()");
ensureContains(wsServerPath, "station.getLockStatus()");
ensureContains(wsServerPath, "PropertyName.DeviceLocked");
ensureContains(wsServerPath, "rawParam(6012)");

console.log("Patched eufy-security-client/ws for T85V0/T85F0 lock discovery, P2P setup, status, and unlock");
