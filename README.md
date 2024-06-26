# ColdEmail: Automate Your Job Search with AI-Powered Responses

## Overview

ColdEmail empowers you to streamline your job search communications by leveraging the power of Gmail API and Google Gemini API. It automates email retrieval, content classification, and response generation, freeing up your time to focus on what matters most - landing that dream job.

## Key Features

- **Effortless Email Management**: Retrieve unread emails from your Gmail account automatically, eliminating the need for manual checking.
- **Intelligent Classification**: Utilize Google Gemini's advanced AI to categorize incoming emails into relevant groups like "Interested," "Not Interested," and "More Information," guiding your responses.
- **Personalized Response Generation**: Generate professional and contextually appropriate responses based on the content classification. No more generic replies!
- **Automated Workflows**: Streamline your process by automatically sending generated responses back to the original email sender. Save valuable time and effort.
- **Robust Error Handling**: Experience peace of mind with comprehensive error handling and logging for troubleshooting and smooth operation.

## Getting Started

### Clone the Repository:
```bash
git clone https://your-username/coldemail.git
cd coldemail
```

```Bash
npm install
```
## Set Up Environment Variables:

Create a .env file in the root directory and add the following variables:
```Bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
REFRESH_TOKEN=your_refresh_token
GEMINI_API_KEY=your_gemini_api_key
PORT=your_preferred_port  # default: 3000

```
Important: Replace placeholders like your_client_id with your actual Google API credentials and your_gemini_api_key with your Gemini API key. Obtain these credentials by following the official documentation for Google API Console and Google Generative AI (Gemini API).

## Run the Application:

```Bash

npm start
```

This starts the ColdEmail server on the specified port (default: 3000).

## Access the Interface:

Open your web browser and navigate to http://localhost:3000 (or your chosen port) to interact with the ColdEmail app.

## Workflow

### ColdEmail operates in a seamless workflow:

Automatic Email Fetch: The app regularly retrieves unread emails from your Gmail account.
- **ColdEmail operates in a seamless workflowt**: Using Google Gemini, emails are classified into appropriate categories ("Interested," "Not Interested," etc.).
- **Contextual Response Generation**: Based on the classification, ColdEmail generates professional and personalized email responses.
- **C:Automated Sending:** Generated responses are automatically sent back to the original email senders, saving you time and effort.
Customization (Optional)

Modify the .env file to adjust the port number (default: 3000) or incorporate additional environment variables for advanced customization.
For further customization, explore the project's codebase to tailor it to your specific requirements.
Contributing

We welcome your contributions! If you encounter issues or have suggestions, feel free to open an issue or submit a pull request on GitHub.

# License

This project is licensed under the MIT License. Refer to the LICENSE file for details.

# Acknowledgments

Nodemailer
Google APIs
Google Generative AI (Gemini API)
By leveraging ColdEmail's intelligent features, you can significantly enhance your job search efficiency and land your dream job faster.
