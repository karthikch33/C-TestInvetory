# Welcome to the Project!

This document provides a comprehensive guide to setting up the project on your local machine. We'll walk you through the setup for both the backend and frontend, and then give you a tour of how to use the application.

## About the Project

This project is a powerful data transformation and analysis tool. It allows you to connect to various data sources, define business rules, and then use a natural language interface to work with your data. The goal is to make data manipulation intuitive and accessible.

## Getting Started: Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Python 3.12:** You can download it from the official Python website.
- **Node.js:** We recommend using a recent LTS version, such as 18.x or 20.x. You can get it from the Node.js website.
- **npm:** The Node Package Manager is included with Node.js, so you don't need to install it separately.

## Backend Setup: The Python Heart

The backend is built with Python and the Django framework. It handles the core logic, data processing, and communication with the database.

1.  **Enter the Backend Directory:**

    Open your terminal and navigate to the `LLM_Backend` folder:

    ```bash
    cd LLM_Backend
    ```

2.  **Create a Virtual Sanctuary:**

    It's a good practice to create a virtual environment to keep the project's dependencies isolated. Think of it as a clean, separate workspace for our Python packages.

    ```bash
    python -m venv venv
    ```

3.  **Activate Your Environment:**

    Now, let's activate the virtual environment. This step ensures that we're using the packages installed specifically for this project.

    -   **On Windows:**
        ```bash
        .\venv\Scripts\activate
        ```
    -   **On macOS and Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  **Install the Dependencies:**

    With the environment active, it's time to install the necessary Python packages. We've listed them all in the `requirements.txt` file.

    *Note: There are two files, `requirements.txt` and `requirments.txt`. We'll use `requirements.txt` as it's the standard naming convention.*

    ```bash
    pip install -r requirements.txt
    ```

5.  **Launch the Backend Server:**

    You're all set! Start the Django development server with this command:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

    The backend is now up and running at `http://127.0.0.1:8000/`. You can leave this terminal window open.

## Frontend Setup: The User's View

The frontend is a modern React application that provides a user-friendly interface to interact with the backend.

1.  **Head to the Frontend Directory:**

    Open a **new** terminal window or tab and navigate to the `LLM_Frontend` folder:

    ```bash
    cd LLM_Frontend
    ```

2.  **Install Node Packages:**

    Just like with the backend, we need to install the frontend's dependencies. These are all listed in the `package.json` file.

    ```bash
    npm install
    ```

3.  **Start the Frontend App:**

    Now, let's bring the user interface to life:

    ```bash
    npm start
    ```

    This will automatically open the application in your default web browser at `http://localhost:3000/`. If it doesn't, you can manually navigate to that address.

## A Tour of the Platform: How to Use It

Now that you have everything running, here’s a typical workflow for using the application. This will give you a good feel for the platform's capabilities.

### 1. Create a New Project

Think of a project as a dedicated workspace for a specific task or data analysis. It's the top-level container that will hold your data connections, business rules, and reports.

-   **Where to go:** Find the "Project" section on the main dashboard.
-   **What to do:** Click on "Manage Projects" and then create a new project. Give it a descriptive name that reflects what you'll be working on.

### 2. Connect to Your Data

This is where you tell the application where to find your data. The platform supports a variety of data sources.

-   **Where to go:** Navigate to the "Connections" section.
-   **What to do:** Here, you can add new connections to databases like ERP, SAP HANA, MySQL, or Oracle. If your data is in a flat file (like a CSV or Excel file), you can use the "Uploads" section to upload it.

### 3. Define Your Business Rules

Business rules are the heart of the data transformation process. They allow you to define how the data should be mapped, cleaned, and transformed.

-   **Where to go:** Head over to the "Business Rules" section.
-   **What to do:** Here, you can create and manage your business rules. For example, you could define a rule to merge columns, calculate new values, or standardize data formats. This step is crucial for ensuring the quality and consistency of your data.

### 4. The Workspace: Your AI-Powered Data Assistant

The Workspace is where the magic happens. It's an interactive environment where you can work with your data using natural language.

-   **Where to go:** Click on the "Work Space" section.
-   **What to do:** The Workspace features a chat interface. You can type in commands in plain English to perform a wide range of tasks, such as:
    -   "Show me all the sales from the last quarter."
    -   "Calculate the total revenue per product."
    -   "Merge the customer data with the sales data."

The AI will interpret your commands, apply the necessary business rules, and show you the results. You can also perform data validation and other transformations here.

### 5. Get Insights from Reports

After you've processed your data, the "Reports" section gives you a clear view of the results.

-   **Where to go:** Navigate to the "Reports" section.
-   **What to do:** Here, you'll find visualizations, summaries, and detailed reports based on your data. This is the best way to understand the output of your data transformations and gain valuable insights.

We hope this guide helps you get up and running with the project. Happy data exploring!
