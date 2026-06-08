## 2.1.0-3

- Added a read-only lock status refresh when websocket clients start listening so T85V0/T85F0 lock status can be populated from the eufy client instead of remaining unknown.

## 2.1.0-2

- Removed the synthetic `locked: false` fallback for T85V0/T85F0 locks because it reported unknown lock state as unlocked.

## 2.1.0-1

- Patched the bundled eufy-security-client package so T85V0 and T85F0 locks are classified as locks instead of doorbells/cameras.
- Added T85F0/type 205 metadata and exposed a default `locked` property so Home Assistant can create lock entities.
- Removed the upstream Docker image pin so the add-on builds from this fork's patched Dockerfile.

## 1.9.7
- Updated eufy-security-ws to version [`1.9.7`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.7)


## 1.9.6
- Updated eufy-security-ws to version [`1.9.6`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.6)

## 1.9.5

- Updated eufy-security-ws to version [`1.9.5`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.5)
- Skipped 1.9.4 due to a bug

## 1.9.3

- Updated eufy-security-ws to version [`1.9.3`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.3)

## 1.9.2

- Updated eufy-security-ws to version [`1.9.2`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.2)

## 1.9.1

- Updated eufy-security-ws to version [`1.9.1`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.1)

## 1.9.0

- Updated eufy-security-ws to version [`1.9.0`](https://github.com/bropat/eufy-security-ws/releases/tag/1.9.0)

## 1.8.0-2

- Fixed livestreaming issue introduced by CVE-2023-46809 in Node.js ([#310](https://github.com/bropat/eufy-security-ws/issues/310))

## 1.8.0-1

- Fixed livestreaming issue introduced by CVE-2023-46809 in Node.js ([#310](https://github.com/bropat/eufy-security-ws/issues/310))

## 1.8.0

- Updated eufy-security-ws to version [`1.8.0`](https://github.com/bropat/eufy-security-ws/releases/tag/1.8.0)
- Added new config parameter `ipv4first` ([#27](https://github.com/bropat/hassio-eufy-security-ws/pull/27))

## 1.7.1

- Updated eufy-security-ws to version [`1.7.1`](https://github.com/bropat/eufy-security-ws/releases/tag/1.7.1)

## 1.7.0

- Updated eufy-security-ws to version [`1.7.0`](https://github.com/bropat/eufy-security-ws/releases/tag/1.7.0)

## 1.6.4

- Updated eufy-security-ws to version [`1.6.4`](https://github.com/bropat/eufy-security-ws/releases/tag/1.6.4)

## 1.6.3

- Updated eufy-security-ws to version [`1.6.3`](https://github.com/bropat/eufy-security-ws/releases/tag/1.6.3)

## 1.6.2

- Updated eufy-security-ws to version [`1.6.2`](https://github.com/bropat/eufy-security-ws/releases/tag/1.6.2)

## 1.6.1

- Updated eufy-security-ws to version [`1.6.1`](https://github.com/bropat/eufy-security-ws/releases/tag/1.6.1)

## 1.6.0

- Updated eufy-security-ws to version [`1.6.0`](https://github.com/bropat/eufy-security-ws/releases/tag/1.6.0)

## 1.5.2-1

- Fixed AppArmor configuration for Home Assistant Supervised installations
- Fixed some links in the main readme

## 1.5.2

- Updated eufy-security-ws to version [`1.5.2`](https://github.com/bropat/eufy-security-ws/releases/tag/1.5.2)

## 1.5.1

- Updated eufy-security-ws to version [`1.5.1`](https://github.com/bropat/eufy-security-ws/releases/tag/1.5.1)

## 1.5.0

- Updated eufy-security-ws to version [`1.5.0`](https://github.com/bropat/eufy-security-ws/releases/tag/1.5.0)

## 1.4.1

- Updated eufy-security-ws to version [`1.4.1`](https://github.com/bropat/eufy-security-ws/releases/tag/1.4.1)

## 1.3.5

- Updated eufy-security-ws to version [`1.3.5`](https://github.com/bropat/eufy-security-ws/releases/tag/1.3.5)

## 1.3.4

- Updated eufy-security-ws to version [`1.3.4`](https://github.com/bropat/eufy-security-ws/releases/tag/1.3.4)
- Fixed AppArmor configuration for some architectures

## 1.3.3

- Updated eufy-security-ws to version [`1.3.3`](https://github.com/bropat/eufy-security-ws/releases/tag/1.3.3)
- Fixed run.sh config generation issue

## 1.3.2

- Updated eufy-security-ws to version [`1.3.2`](https://github.com/bropat/eufy-security-ws/releases/tag/1.3.2)
- Initial add-on release
