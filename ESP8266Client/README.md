# Setup

1. Install the [PlatformIO VS Code Extension](https://platformio.org/install/ide?install=vscode) to enable embedded development features in Visual Studio Code.
2. Open the project folder containing `platformio.ini` using VS Code with the PlatformIO extension enabled.
3. Connect your ESP8266 development board (with the HC-SR04 sensor attached) to your computer via USB.
4. Use the PlatformIO extension to build, upload, and monitor the firmware directly from VS Code. The extension provides easy access to serial monitoring, build status, and device management.

### Linux:

Ensure your user account has permission to access the serial port (e.g., add your user to the `dialout` group on Linux if needed).

### Windows: CP210x USB Driver Installation

On Windows, many ESP8266/ESP32 development boards use a **Silicon Labs CP210x USB to UART Bridge** chip for USB–serial communication.  
If the board does not show up as a COM port, you likely need to install the CP210x driver.

1. Download the **CP210x USB to UART Bridge VCP Drivers** from Silicon Labs:  
   <https://www.silabs.com/software-and-tools/usb-to-uart-bridge-vcp-drivers?tab=downloads>
2. In the downloads list, select the `CP210x Windows Drivers` package for CP210x and download it.
3. Extract (unzip) the downloaded archive.
4. In the extracted folder, run `CP210xVCPInstaller_x64.exe` (or the x86 installer on older 32-bit systems).
5. Follow the installation wizard and finish the setup.
6. After installation, connect your ESP8266 board via USB.
7. Open **Device Manager** → **Ports (COM & LPT)** and verify that you see an entry like  
   **“Silicon Labs CP210x USB to UART Bridge (COMx)”**.
8. Use that COM port (`COMx`) in PlatformIO’s **Upload** and **Monitor** settings.

For a step-by-step guide with screenshots, you can refer to:  
<https://randomnerdtutorials.com/install-esp32-esp8266-usb-drivers-cp210x-windows/>

> **Note:** Some boards use a different USB-to-serial chip (e.g. CH340). In that case, you’ll need the appropriate driver for that chip instead of CP210x.

**Warning:** The current firmware on the microcontroller only supports connections to **WPA/WPA2 Personal** WiFi networks. It **does not support WPA Enterprise networks** (e.g. those using username/password with a RADIUS server, such as many corporate or university networks).

For development and testing, you can use a **mobile hotspot** or a **local WiFi router** configured with WPA/WPA2 Personal (pre-shared key). Make sure that **client isolation is disabled** or that the hotspot/router is configured to **allow clients to communicate with each other**, so that your microcontroller and your PC/phone can see and talk to each other on the same network.

# Microcontroller Logic

1. On startup, the microcontroller attempts to load its configuration from persistent storage (SPIFFS or EEPROM).
2. If configuration is present and valid, it tries to connect to the specified WiFi network using the stored SSID and password.
3. Once WiFi is connected, the device authenticates with the backend server using the bearer token from the configuration.
4. If all steps succeed, the main loop begins:
   - Every 10 seconds, the microcontroller reads the distance from the HC-SR04 sensor.
   - It builds a JSON payload containing the device MAC address and the sensor reading.
   - The payload is sent to the backend server via an HTTP POST request.
   - The onboard LED provides visual feedback during measurement and transmission.

**Failure Handling:**

- If configuration is missing or invalid, WiFi connection fails, or backend authentication fails, the device enters configuration mode:
  - The microcontroller creates a WiFi hotspot and starts a web-based configuration dashboard.
  - Connect to the hotspot using a phone or computer, then browse to the IP address shown in the serial monitor.
  - Update the configuration via the web interface and submit.
  - If the new configuration is valid, the device automatically restarts and attempts the setup process again.

**Manual Restart:**

- You can manually restart the microcontroller at any time by pressing the reset button on the development board.

# Modules Overview

## Config Module (`config.hpp/cpp`)

Manages configuration persistence and a web-based configuration interface.

**Responsibilities:**

- Loads configuration from persistent storage on the microcontroller
- Validates configuration completeness (SSID, password, host, bearer token)
- Provides a WiFi access point with a web server for remote configuration
- Handles form submission and validates new configuration before storing

**Struct:**

- `Config`: Contains SSID, WiFi password, backend host URL, and authorization bearer token

**Key Functions:**

- `init()`: Initializes the config system and loads stored configuration
- `isValid()`: Checks if all required configuration fields are present
- `isInConfigMode()`: Returns true if in configuration mode
- `startClient()`: Starts the WiFi access point and configuration dashboard
- `handleClient()`: Processes incoming HTTP requests to the configuration portal
- `get()`: Returns a pointer to the current configuration

**Storage Details:**

- Configuration is persisted to the ESP8266 SPIFFS (SPI Flash File System) or EEPROM
- On first boot or if config is invalid, the module switches to configuration mode
- Configuration mode creates a WiFi hotspot (usually named similar to "ESP8266-Config")
- Users can connect to this hotspot and access the configuration web interface via a local IP address displayed on the serial console
- Configuration is validated before storage (no empty required fields allowed)

**Integration Points:**

- Called during setup phase before WiFi connection
- Used to fall back into config mode if authentication fails or WiFi cannot be established
- Provides configuration data to WiFi and HTTP modules for runtime use

## WiFi Module (`wifi.hpp/cpp`)

Handles WiFi connectivity for the microcontroller.

**Responsibilities:**

- Connects to WiFi network using provided SSID and password
- Provides connection timeout functionality
- Reports connection status

**Key Functions:**

- `connect(ssid, password, timeout)`: Attempts to connect to WiFi with optional timeout (in milliseconds)

## HTTP Module (`http.hpp/cpp`)

Manages HTTP communication with the backend server.

**Responsibilities:**

- Initializes HTTP client with backend host URL and bearer token authentication
- Sends HTTP requests with proper authorization headers
- Handles JSON payload serialization and transmission

**Key Functions:**

- `init(host, token)`: Configures the HTTP client with backend details
- `check(endpoint)`: Sends a GET request to verify connectivity and authentication (returns HTTP status code)
- `post(endpoint, json)`: Sends a POST request with JSON payload (returns HTTP status code)

## Sensor Modules

### HCSR04 Module (`sensors/hcsr04.hpp/cpp`)

Driver for the HC-SR04 ultrasonic distance sensor.

**Responsibilities:**

- Initializes GPIO pins for trigger and echo
- Measures distance to objects using ultrasonic pulses
- Provides distance readings in centimeters (or configurable units)

**Key Functions:**

- `init()`: Sets up GPIO pins and prepares the sensor
- `getDistance()`: Returns the measured distance as a float value

## Main Loop

The main application runs the following cycle every 10 seconds:

1. **Check Configuration Mode**: If in config mode, handle incoming configuration requests
   - If true, process any pending HTTP requests from the configuration portal
   - Return early and skip the rest of the loop until configuration is complete
2. **Verify WiFi**: Automatically reconnect to WiFi if connection is lost
   - Check current WiFi status using `WiFi.status()`
   - If disconnected, attempt reconnection with stored credentials
   - Log status messages to serial output for debugging
3. **Read Sensor**: Retrieve distance measurement from HC-SR04 sensor
   - Call `sensors::hcsr04::getDistance()` to get latest reading
   - Value is returned in centimeters
4. **Build Payload**: Create JSON document with hardware MAC address and sensor reading
   - Extract device MAC address using `WiFi.macAddress()`
   - Create ArduinoJson document with `HardwareId` and `Distance` fields
   - Serialize to JSON string
5. **Send Data**: POST measurement to backend API at `/api/measurements`
   - Send HTTP POST request with JSON payload
   - Include bearer token authorization header
   - Capture HTTP response status code
6. **Handle Errors**:
   - Log HTTP response codes to serial output
   - If status code is outside 200-299 range, log error message
   - If 401 (Unauthorized), re-enter configuration mode to allow credential update
   - LED is turned off after measurement/transmission completes
7. **Repeat**: Wait 10 seconds (10000ms) before next cycle

**LED Indicator:**

- GPIO pin 2 is used for LED feedback
- LED is turned ON (LOW logic) at the beginning of measurement
- LED is turned OFF (HIGH logic) after transmission completes
- Provides visual feedback that the device is actively measuring and transmitting

**Timing Considerations:**

- 10-second interval provides a good balance between responsiveness and network efficiency
- Actual loop cycle time includes sensor read and HTTP request duration
- If HTTP request fails, the device still waits the full 10 seconds before retry

---

## Architecture and Data Flow

```
┌─────────────────────────────────────────┐
│          ESP8266 Microcontroller        │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐   │
│  │   Config Module                  │   │
│  │ • SPIFFS/EEPROM Storage          │   │
│  │ • WiFi AP (Config Portal)        │   │
│  │ • HTTP Server (Configuration UI) │   │
│  └──────────────────────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌──────────────────────────────────┐   │
│  │   WiFi Module                    │   │
│  │ • SSID & Password Management     │   │
│  │ • Connection Status Monitoring   │   │
│  │ • Auto-Reconnection              │   │
│  └──────────────────────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌──────────────────────────────────┐   │
│  │   Main Loop (10s Cycle)          │   │
│  │ • Sensor Reading (HCSR04)        │   │
│  │ • Data Serialization (JSON)      │   │
│  │ • LED Feedback                   │   │
│  └──────────────────────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌──────────────────────────────────┐   │
│  │   HTTP Module                    │   │
│  │ • Bearer Token Authentication    │   │
│  │ • HTTP POST to Backend           │   │
│  │ • Error Handling                 │   │
│  └──────────────────────────────────┘   │
│                  │                      │
│                  ▼                      │
│  ┌──────────────────────────────────┐   │
│  │         HCSR04 Sensor            │   │
│  │ • Trigger                        │   │
│  │ • Echo                           │   │
│  │ • Distance                       │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Backend Server              │
│  • /api/measurements/check   │
│  • /api/measurements (POST)  │
└──────────────────────────────┘
```

**Signal Flow:**

1. Device boots and attempts to load configuration
2. If config is valid, WiFi connects using stored credentials
3. HTTP module initializes with backend URL and bearer token
4. Main loop starts, reading sensor data every 10 seconds
5. Sensor measurements are serialized to JSON format
6. JSON payload is sent to backend via HTTP POST
7. Backend responds with status code (200 = success, 401 = auth failed, etc.)
8. If any step fails, device returns to configuration mode
9. Configuration mode serves a web interface on the device's WiFi hotspot

---

## Implementation Details

### Pin Configuration

| GPIO | Purpose              | Direction |
| ---- | -------------------- | --------- |
| 2    | LED Status Indicator | OUTPUT    |
| 12   | HCSR04 Trigger       | OUTPUT    |
| 13   | HCSR04 Echo          | INPUT     |

### HTTP API Endpoints

**Verification Endpoint:**

```
GET /api/measurements/check
Authorization: Bearer <token>
```

- Used during setup to verify backend connectivity and token validity
- Returns 200 if OK, 401 if token is invalid

**Measurement Endpoint:**

```
POST /api/measurements
Authorization: Bearer <token>
Content-Type: application/json

{
  "HardwareId": "AA:BB:CC:DD:EE:FF",
  "Distance": 42.5
}
```

- Receives sensor measurements from the device
- Returns 200 if accepted, 401 if unauthorized, other status codes for errors

### Configuration File Format

Configuration is stored in persistent memory with the following fields:

- **SSID**: WiFi network name
- **Password**: WiFi network password
- **Host**: Backend server URL
- **Bearer Token**: API authentication token

### Serial Output

The device provides debugging information via serial (115200 baud):

- Startup status and configuration loading
- WiFi connection attempts and status
- API authentication results
- HTTP error codes and responses
- Configuration mode activation messages

---
