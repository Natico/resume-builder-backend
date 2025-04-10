# Resume Builder - Backend

This is the backend service for the Resume Builder project. It provides an API to generate resumes in PDF format using HTML templates.

## 🧰 Tech Stack

- Node.js
- Express.js
- Puppeteer
- Body-parser
- CORS

## 📂 Project Structure

```
backend/
├── controllers/        # Handle the PDF generation logic
├── templates/          # Contains HTML templates for resumes
├── utils/              # Helper functions, including puppeteer setup
├── routes.js           # API route definitions
├── server.js           # Entry point of the backend server
└── README.md           # You are here
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the server:
   ```bash
   node server.js
   ```

## 🧪 API Usage

### `POST /api/generate-pdf`

Generates a resume PDF from posted data.

**Request Body** (JSON):
```json
{
  "templateName": "template_01_en",
  "data": {
    "personalInfo": {
      "fullName": "John Doe",
      "jobTitle": "Frontend Developer",
      "summary": "Creative and detail-oriented...",
      ...
    },
    ...
  }
}
```

**Response**:
- `application/pdf` file download

## 📝 Notes

- Ensure templates are complete and styled inline (no external CSS).
- To add a new template, create an HTML file in `templates/` and reference its filename (without `.html`) in the `templateName` field.

## 📎 License

This project is under the MIT License.
