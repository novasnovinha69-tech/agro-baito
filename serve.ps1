# Servidor HTTP estático simples em PowerShell para a High Line
# Sobe na porta 8000 servindo a pasta "high-line"
Add-Type -AssemblyName System.Web

$root = Join-Path $PSScriptRoot "high-line"
$port = 8000
$prefix = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Servidor High Line rodando em $prefix  (Ctrl+C para parar)"
Write-Host "Servindo arquivos de: $root"

$mimes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
  ".woff2" = "font/woff2"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
  } catch {
    break
  }
  $req = $ctx.Request
  $res = $ctx.Response

  $path = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath)
  if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }

  $filePath = Join-Path $root ($path.TrimStart("/").Replace("/", "\"))

  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $mime = if ($mimes.ContainsKey($ext)) { $mimes[$ext] } else { "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    Write-Host "[OK] $($req.HttpMethod) $path  -> $mime"
  } else {
    $res.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - Arquivo nao encontrado: $path")
    $res.OutputStream.Write($msg, 0, $msg.Length)
    Write-Host "[404] $path"
  }
  $res.Close()
}
