@echo off
if exist "C:\Program Files\Java\jdk-23" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-23"
) else if exist "C:\Program Files\Java\jdk-21" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
)
set MAVEN_CMD="%~dp0..\tools\apache-maven-3.9.6\bin\mvn.cmd"
if not exist %MAVEN_CMD% set MAVEN_CMD="%~dp0tools\apache-maven-3.9.6\bin\mvn.cmd"
%MAVEN_CMD% %*

