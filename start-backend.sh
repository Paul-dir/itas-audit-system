#!/bin/bash
cd /home/paul/itas-audit-system/backend/bs-taxaudit-core-server
exec mvn spring-boot:run -Dspring-boot.run.profiles=mock
