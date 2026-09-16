#!/bin/bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
export PATH="$JAVA_HOME/bin:$PATH"
export DB_PORT="${DB_PORT:-5433}"

cd "$DIR/backend/bs-taxaudit-core-server"
exec mvn spring-boot:run -Dspring-boot.run.profiles=mock -DskipTests
