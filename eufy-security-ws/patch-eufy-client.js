const fs = require("fs");
const path = require("path");

const clientRoot = path.join(__dirname, "node_modules", "eufy-security-client", "build", "http");
const typesPath = path.join(clientRoot, "types.js");
const devicePath = path.join(clientRoot, "device.js");
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

ensureContains(typesPath, 'DeviceType["LOCK_85F0"] = 205');
ensureContains(devicePath, 'serialnumber.startsWith("T85F0")');
ensureContains(devicePath, 'Smart Lock (T85F0)');

replaceOnce(
  wsServerPath,
  '                this.receiveEvents = true;\n                if (DriverMessageHandler.tfa) {',
  '                this.receiveEvents = true;\n                void (async () => {\n                    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\n                    for (const station of await this.driver.getStations()) {\n                        try {\n                            const serial = station.getSerial();\n                            if (!serial.startsWith("T85V0") && !serial.startsWith("T85F0"))\n                                continue;\n                            if (!station.isConnected())\n                                await station.connect().catch(() => undefined);\n                            await sleep(5000);\n                            if (typeof station.getLockParameters === "function")\n                                station.getLockParameters();\n                            await sleep(5000);\n                            if (typeof station.getLockStatus === "function")\n                                station.getLockStatus();\n                            await sleep(10000);\n                            if (typeof station.getLockStatus === "function")\n                                station.getLockStatus();\n                        }\n                        catch (_err) { }\n                    }\n                })();\n                if (DriverMessageHandler.tfa) {',
);

ensureContains(wsServerPath, "station.getLockParameters()");
ensureContains(wsServerPath, "station.getLockStatus()");

console.log("Patched eufy-security-client/ws for T85V0/T85F0 lock discovery and lock status refresh");
