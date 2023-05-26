# Power Measuring Application

The Power Measuring Application is a web application that allows users to monitor the CPU and memory usage of a specific process. It consists of an API server built with Express.js and a React client for the user interface.

## API Documentation

### Homepage Endpoint

- URL: `/`
- Method: GET

#### Response

- Status: 200 OK
- Body: Text response: "Welcome to the System Usage API!"

### Usage Endpoint

- URL: `/usage`
- Method: GET

#### Query Parameters

- `processName` (required): The name of the process to monitor.

#### Response

##### Success

- Status: 200 OK
- Body: JSON object containing the following properties:
  - `cpuUsage`: The CPU usage of the specified process as a percentage (rounded to 2 decimal places).
  - `memUsage`: The memory usage of the specified process in megabytes (rounded to 2 decimal places).

##### Errors

- Status: 404 Not Found
- Body: JSON object with the following property:

  - `error`: Error message indicating that no process with the specified name was found.

- Status: 500 Internal Server Error
- Body: Error message indicating that an error occurred while monitoring system usage.

## React Client Documentation

### App Component

The `App` component is the main component of the React client application. It provides a user interface for monitoring system usage.

#### State

- `processName`: Stores the name of the process entered by the user.
- `cpuUsage`: Stores the CPU usage of the specified process.
- `memUsage`: Stores the memory usage of the specified process.
- `isLoading`: Indicates whether data is being fetched.
- `error`: Stores an error message if an error occurs while fetching data.
- `noProcessMatch`: Indicates whether there is no process with the specified name.

#### Methods

- `fetchData()`: Fetches the CPU and memory usage data from the API based on the `processName` state.
- `handleProcessNameChange(event)`: Updates the `processName` state based on user input.
- `handleSubmit(event)`: Handles form submission and triggers data fetching.

#### Lifecycle

- `useEffect()`: Invokes `fetchData()` at regular intervals (every 1.5 seconds) to keep data up-to-date. Cleans up the interval on unmount.

#### Rendering

The component renders a form with an input field and a submit button for the user to enter and submit the process name. The component displays loading indicators, error messages, and usage information based on the state values.

- If `isLoading` is true, displays a "Loading..." message.
- If `error` is set, displays an error message.
- If `noProcessMatch` is true, displays a message indicating that no process with the specified name was found.
- If `processName` is set and none of the error states are true, displays the CPU and memory usage information in a progress bar format.

### Dependencies

- React: JavaScript library for building user interfaces.
- axios: Promise-based HTTP client for making API requests.
- @material-ui/core: Material UI library for UI components.

This documentation provides an overview of the API endpoints and the React client application structure. You can expand on it by adding more details, such as input validation, error handling, and additional API endpoints if applicable.
