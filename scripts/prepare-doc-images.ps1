Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$imagesDir = Join-Path $root "assets\images"

$targetOrange = [System.Drawing.Color]::FromArgb(255, 255, 90, 44)
$targetHue = 15.4

$imageConfigs = @(
    @{ Name = "AC Tool Window Theme.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "WindowColourThemeLocation.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Information Full.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Folder Information Preview.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Select.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Review.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Mark - Blocked.png"; Scale = 4; Mode = "Nearest" },
    @{ Name = "Mark - Reviewed.png"; Scale = 4; Mode = "Nearest" },
    @{ Name = "Don't Edit.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Don'tEditLockConfig.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Don'tEditLockConfigLocation.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Options for Edit.png"; Scale = 2; Mode = "Bicubic" },
    @{ Name = "Window Tool.png"; Scale = 2; Mode = "Bicubic" }
)

function Convert-ToHsv {
    param([System.Drawing.Color] $Color)

    $r = $Color.R / 255.0
    $g = $Color.G / 255.0
    $b = $Color.B / 255.0

    $max = [Math]::Max($r, [Math]::Max($g, $b))
    $min = [Math]::Min($r, [Math]::Min($g, $b))
    $delta = $max - $min

    $h = 0.0
    if ($delta -gt 0.0) {
        if ($max -eq $r) {
            $h = 60.0 * ((($g - $b) / $delta) % 6.0)
        } elseif ($max -eq $g) {
            $h = 60.0 * ((($b - $r) / $delta) + 2.0)
        } else {
            $h = 60.0 * ((($r - $g) / $delta) + 4.0)
        }
    }

    if ($h -lt 0.0) {
        $h += 360.0
    }

    $s = if ($max -eq 0.0) { 0.0 } else { $delta / $max }
    $v = $max

    return @{
        H = $h
        S = $s
        V = $v
    }
}

function Convert-FromHsv {
    param(
        [double] $Hue,
        [double] $Saturation,
        [double] $Value,
        [int] $Alpha
    )

    $c = $Value * $Saturation
    $x = $c * (1.0 - [Math]::Abs((($Hue / 60.0) % 2.0) - 1.0))
    $m = $Value - $c

    $rPrime = 0.0
    $gPrime = 0.0
    $bPrime = 0.0

    if ($Hue -lt 60.0) {
        $rPrime = $c; $gPrime = $x; $bPrime = 0.0
    } elseif ($Hue -lt 120.0) {
        $rPrime = $x; $gPrime = $c; $bPrime = 0.0
    } elseif ($Hue -lt 180.0) {
        $rPrime = 0.0; $gPrime = $c; $bPrime = $x
    } elseif ($Hue -lt 240.0) {
        $rPrime = 0.0; $gPrime = $x; $bPrime = $c
    } elseif ($Hue -lt 300.0) {
        $rPrime = $x; $gPrime = 0.0; $bPrime = $c
    } else {
        $rPrime = $c; $gPrime = 0.0; $bPrime = $x
    }

    $r = [Math]::Round(($rPrime + $m) * 255.0)
    $g = [Math]::Round(($gPrime + $m) * 255.0)
    $b = [Math]::Round(($bPrime + $m) * 255.0)

    return [System.Drawing.Color]::FromArgb(
        $Alpha,
        [Math]::Min(255, [Math]::Max(0, $r)),
        [Math]::Min(255, [Math]::Max(0, $g)),
        [Math]::Min(255, [Math]::Max(0, $b))
    )
}

function Convert-BlueToOrange {
    param([System.Drawing.Color] $Color)

    if ($Color.A -eq 0) {
        return $Color
    }

    $hsv = Convert-ToHsv -Color $Color
    $h = [double] $hsv.H
    $s = [double] $hsv.S
    $v = [double] $hsv.V

    $isBlueRange = $h -ge 165.0 -and $h -le 255.0
    $isBlueDominant = ($Color.B - $Color.R) -ge 18 -and ($Color.B - $Color.G) -ge 12

    if (-not $isBlueRange -and -not $isBlueDominant) {
        return $Color
    }

    if ($s -lt 0.18 -or $v -lt 0.16) {
        return $Color
    }

    $targetSaturation = [Math]::Max($s, 0.48)
    return Convert-FromHsv -Hue $targetHue -Saturation $targetSaturation -Value $v -Alpha $Color.A
}

function Get-InterpolationMode {
    param([string] $Mode)

    switch ($Mode) {
        "Nearest" { return [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor }
        default { return [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic }
    }
}

foreach ($config in $imageConfigs) {
    $inputPath = Join-Path $imagesDir $config.Name
    if (-not (Test-Path $inputPath)) {
        throw "Image not found: $inputPath"
    }

    $outputName = "{0}-premium{1}" -f [System.IO.Path]::GetFileNameWithoutExtension($config.Name), [System.IO.Path]::GetExtension($config.Name)
    $outputPath = Join-Path $imagesDir $outputName

    if (Test-Path $outputPath) {
        Write-Host "Skipped $($config.Name) -> $outputName"
        continue
    }

    $source = [System.Drawing.Bitmap]::new($inputPath)
    $recolored = [System.Drawing.Bitmap]::new($source.Width, $source.Height)

    try {
        for ($y = 0; $y -lt $source.Height; $y++) {
            for ($x = 0; $x -lt $source.Width; $x++) {
                $pixel = $source.GetPixel($x, $y)
                $recolored.SetPixel($x, $y, (Convert-BlueToOrange -Color $pixel))
            }
        }

        $outputWidth = $source.Width * [int] $config.Scale
        $outputHeight = $source.Height * [int] $config.Scale
        $scaled = [System.Drawing.Bitmap]::new($outputWidth, $outputHeight)

        try {
            $graphics = [System.Drawing.Graphics]::FromImage($scaled)

            try {
                $graphics.Clear([System.Drawing.Color]::Transparent)
                $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.InterpolationMode = Get-InterpolationMode -Mode $config.Mode
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.DrawImage($recolored, 0, 0, $outputWidth, $outputHeight)
            } finally {
                $graphics.Dispose()
            }

            $scaled.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
            Write-Host "Processed $($config.Name) -> $outputName"
        } finally {
            $scaled.Dispose()
        }
    } finally {
        $recolored.Dispose()
        $source.Dispose()
    }
}
