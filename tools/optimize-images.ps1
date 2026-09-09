$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$script = [IO.File]::ReadAllText((Join-Path $projectRoot 'script.js'))
$html = [IO.File]::ReadAllText((Join-Path $projectRoot 'index.html'))
$sources = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($source in @('optimized/Proprietario/Proprietario.jpg', 'Equipe/EquipeBolo.jpeg')) { [void]$sources.Add($source) }
$earlyPhoto = Get-ChildItem -LiteralPath (Join-Path $projectRoot 'Proprietario') -Filter 'RaynerLavando*' -File | Select-Object -First 1
if ($earlyPhoto) { [void]$sources.Add('Proprietario/' + $earlyPhoto.Name) }
foreach ($line in ($script -split "`n" | Where-Object { $_ -match "folder: '" })) {
  $folder = [regex]::Match($line, "folder: '([^']+)'").Groups[1].Value
  $files = [regex]::Match($line, 'files: \[([^\]]+)\]').Groups[1].Value
  $originals = [regex]::Match($line, 'originalFiles: \[([^\]]+)\]').Groups[1].Value
  foreach ($fileMatch in [regex]::Matches($files, "'([^']+)'")) {
    $file = $fileMatch.Groups[1].Value
    $base = if ($line.Contains("basePath: ''") -or $originals.Contains("'$file'")) { '' } else { 'optimized/' }
    [void]$sources.Add("$base$folder/$file")
  }
}
foreach ($m in [regex]::Matches($script + $html, "['""(]((?:optimized/)?(?:Diversos|Proprietario|Equipe|BoloPersonalizado|BolosConfeitados|BolosCaseiros|FatiasBolo|Doces)/[^'""<>]+?\.(?:JPG|jpg|jpeg|png))['"")]")) {
  [void]$sources.Add($m.Groups[1].Value)
}
$encoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$manifest = [ordered]@{}
$before = 0L
$after = 0L
foreach ($source in ($sources | Sort-Object)) {
  $sourcePath = Join-Path $projectRoot $source
  if (-not (Test-Path -LiteralPath $sourcePath)) { throw "Missing source: $source" }
  $photo = [Drawing.Image]::FromFile($sourcePath)
  try {
    if ($photo.PropertyIdList -contains 274) {
      $orientation = $photo.GetPropertyItem(274).Value[0]
      $rotation = @{ 2=4; 3=2; 4=6; 5=5; 6=1; 7=7; 8=3 }
      if ($rotation.ContainsKey([int]$orientation)) { $photo.RotateFlip([Drawing.RotateFlipType]$rotation[[int]$orientation]) }
    }
    $isBackground = $source -match 'Diversos/'
    $limit = if ($isBackground) { 1600 } else { 960 }
    $smallLimit = if ($isBackground) { 800 } else { 480 }
    $variants = @()
    foreach ($size in @($smallLimit, $limit)) {
      $scale = [Math]::Min([double]1, [double]($size / [double]$photo.Width))
      $width = [Math]::Max(1, [int][Math]::Round($photo.Width * $scale))
      $height = [Math]::Max(1, [int][Math]::Round($photo.Height * $scale))
      $relative = 'optimized/web/' + ($source -replace '^optimized/', '') + ".$size.jpg"
      $target = Join-Path $projectRoot $relative
      [void][IO.Directory]::CreateDirectory((Split-Path $target -Parent))
      if ((Test-Path -LiteralPath $target) -and (Get-Item -LiteralPath $target).LastWriteTime -gt (Get-Item -LiteralPath $sourcePath).LastWriteTime) {
        $existing = [Drawing.Image]::FromFile($target)
        $matches = $existing.Width -eq $width -and $existing.Height -eq $height
        $existing.Dispose()
        if ($matches) {
          $variants += @{ src=$relative; width=$width; height=$height; bytes=(Get-Item -LiteralPath $target).Length }
          continue
        }
      }
      $bitmap = New-Object Drawing.Bitmap($width, $height)
      $graphics = [Drawing.Graphics]::FromImage($bitmap)
      $parameters = New-Object Drawing.Imaging.EncoderParameters(1)
      try {
        $graphics.Clear([Drawing.Color]::FromArgb(255,248,237))
        $graphics.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($photo, 0, 0, $width, $height)
        $parameters.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, [long]82)
        $bitmap.Save($target, $encoder, $parameters)
      } finally { $parameters.Dispose(); $graphics.Dispose(); $bitmap.Dispose() }
      $variants += @{ src=$relative; width=$width; height=$height; bytes=(Get-Item -LiteralPath $target).Length }
    }
    $small = $variants[0]; $large = $variants[1]
    $manifest[$source] = @{ src=$large.src; small=$small.src; width=$large.width; height=$large.height; smallWidth=$small.width }
    $before += (Get-Item -LiteralPath $sourcePath).Length
    $after += $large.bytes
  } finally { $photo.Dispose() }
}
$json = $manifest | ConvertTo-Json -Depth 4 -Compress
[IO.File]::WriteAllText((Join-Path $projectRoot 'image-assets.js'), "const imageAssets = $json;", (New-Object Text.UTF8Encoding($false)))
$report = @{ images=$manifest.Count; originalBytes=$before; optimizedBytes=$after; reductionPercent=[Math]::Round((1-$after/[double]$before)*100,1) }
[IO.File]::WriteAllText((Join-Path $projectRoot 'tools/image-report.json'), ($report | ConvertTo-Json))
$report | ConvertTo-Json
