# Start ASP.NET Core Backend
Start-Process -FilePath "dotnet" -ArgumentList "run --project artifacts/ApiServer.AspNetCore/ApiServer.AspNetCore/ApiServer.AspNetCore.csproj" -NoNewWindow

# Wait a couple seconds to ensure backend starts
Start-Sleep -Seconds 2

# Start Frontend
$env:PORT=8081
$env:BASE_PATH="/"
$env:CI="true"
$env:confirmModulesPurge="false"
pnpm --filter "@workspace/lumora-frontend" run dev
