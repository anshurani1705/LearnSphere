if (Test-Path "C:\Program Files\Java\jdk-23") {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
} elseif (Test-Path "C:\Program Files\Java\jdk-21") {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
}
$mvnCmd = Join-Path $PSScriptRoot "..\tools\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvnCmd)) {
    $mvnCmd = Join-Path $PSScriptRoot "tools\apache-maven-3.9.6\bin\mvn.cmd"
}
& $mvnCmd @args
