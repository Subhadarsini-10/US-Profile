# US-Profile 

Welcome to the Unique Schools Joining Platform! This project is a web application that allows users to join a unique school community, manage user details, and interact with a draggable table.

## Features

1. **User Registration:**
   - Users can register with their email, username, and a generated 16-digit hex code.

2. **User Management:**
   - Users can view, edit, and delete their details.
   - User details are encrypted and stored securely in local storage.

3. **Draggable Table:**
   - Implemented using `react-beautiful-dnd` for a smooth and interactive user experience.
   - Users can reorder rows by dragging them.

4. **CSV Download:**
   - Users can download their user details in CSV format.

5. **Responsive Design:**
   - The application is designed to be responsive across various screen sizes.

## Tech Stacks
## 1. HTML:
Used for structuring the web pages and creating user interfaces.

## 2. CSS:
Utilized for styling the user interface, providing a visually appealing experience.

## 3. JavaScript:
Used for dynamic behavior, interactivity, and handling user actions.

## 4. React.js:
A JavaScript library for building user interfaces, providing a smooth and efficient user experience.

## 5.crypto-js:
CryptoJS is a growing collection of standard and secure cryptographic algorithms implemented in JavaScript using best practices and patterns.Here i have used this framework in a way to savethe data in encrypted way.
 
## 6.react-beautiful-dnd:
To make the list reorderable with drag and drop functionality, I have used a library like react-beautiful-dnd. Now, the list is reorderable using drag and drop. The rows can be dragged to rearrange their order.

## 7.file-saver:
To download a CSV file with password protection in a React application, you can use a library like papaparse for CSV conversion and FileSaver for downloading the file. 

## 8.Tailwind CSS:
I have used this framework for styling, helped me to eject from the complexity of abstracting styles away

### As per the bonus counter i have not used any library to generate a 16 digit unique code instead i have used javascript by using Math.random() from the array to create unique hex code.
