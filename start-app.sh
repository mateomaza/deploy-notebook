#!/bin/bash

if ! command -v node &> /dev/null
then
    echo "Node.js could not be found, please install Node.js to continue."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "npm could not be found, please install npm to continue."
    exit 1
fi

echo "Starting NestJS backend..."
cd backend/notebook-api
npm install
npx nest start &

echo "Starting Next.js frontend..."
cd ../../frontend/notebook-next
npm install
npx next dev &

wait -n

exit $?
