# cinema-squeeze

This project is a full-stack web application designed to help users compare movie ticket prices from two independent providers — **Cinemaworld** and **Filmworld** — and identify the **cheapest available option**. The application is built with a strong emphasis on **resilience**, **user experience**, and **code quality**, reflecting a real-world scenario where third-party APIs can be unreliable or partially unavailable.

![Image](https://github.com/user-attachments/assets/056984d7-76cb-46e0-8606-1e5ac9d95336)
![Image](https://github.com/user-attachments/assets/2bc98fcd-3371-4232-83c5-1203fd6fa237)
![Image](https://github.com/user-attachments/assets/d6644c45-fa18-434f-a95d-250d1935d859)
![Image](https://github.com/user-attachments/assets/f165d4c4-16da-4adf-bba4-919978c5f119)

The goal is to deliver a responsive, user-friendly interface where users can:

- View a catalog of available movies.
- Compare ticket prices from both providers.
- Clearly identify the **lowest price** for each movie.
- View more details or proceed to buy a ticket (simulated).

### 💡 Key Features

- **Robust error handling**: Ensures the application remains functional even if one or both provider APIs fail or return incomplete data.
- **Backend caching**: Movie data is fetched and stored using **Cron job** with Redis to reduce dependency on real-time API responses and improve performance.
- **Secure token handling**: API tokens are stored securely using `.NET` **Secret Manager** best practices to prevent public exposure.
- **Seamless frontend experience**: Built with `Next.js` and `Tailwind CSS`, offering a modern, responsive UI with a focus on accessibility and performance.
- **Scalable architecture**: Designed to easily extend support for additional movie providers or future enhancements.
- **Search more**: User can search movie by keyword like tile, genre etc.

### 🛠️ Technologies Used

- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: ASP.NET Core Web API
- **Caching**: Redis (local docker)
- **Communication**: RESTful APIs
- **Configuration**: `appsettings.json` and environment variables for managing secrets/API token

## Setup up and run

### environment check

Please check if you have below sdk before you continue setup

| Package       | Installation                                       |
| ------------- | -------------------------------------------------- |
| .NET Core ≥ 9 | https://dotnet.microsoft.com/en-us/download/dotnet |
| node.js ≥ 20  | https://nodejs.org/en/download                     |
| Docker        | https://www.docker.com/products/docker-desktop/    |

The project structure looks like below,

```bash
CinemaSqueeze/
├── backend/                      # .NET Core backend
├── client/                       # React frontend
├── CinemaSqueeze.Tests/
└── CinemaSqueeze.sln
Readme.md
LICENSE

```

Once you clone the repo,

1. install dependencies
   1. go to `client/` and run `npm ci` to install dependencies
   2. go to `backend/` and
      1. Install packages: run `dotnet restore`
      2. Add API key in **Secret Manager:** run `dotnet user-secrets init`
         1. then run `dotnet user-secrets set "Movies:ServiceApiBaseUrl" "base-url"` for base Url
         2. and run `dotnet user-secrets set "Movies:ServiceApiKey" "API-Key”` replace with real key for API token
   3. setup the key with dotnet **Secret Manager**
   4. start Docker: run `docker compose up -d`
   5. start FE: run `npm run dev` in `client/`
   6. start BE: run `dotnet run` in `backend/`
   7. go to [`http://localhost:3000/`](http://localhost:3000/) in your browser
