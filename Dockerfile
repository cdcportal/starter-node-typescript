# Build the file : docker build -f Dockerfile -t <image-name>:<tag-name> .
# Example: docker build -f Dockerfile -t cdcport-depl-aws-img:latest .

# Run container : docker run -it -p <port>:<port> --name <container_name> <image-name>
# Example : docker run -it -p 3000:3000 --name cdcport_depl_aws_cont cdcport-depl-aws-img:latest

# List all containers : docker ps

# Delete container : docker container rm <container_name>

# Stage1: API Build
FROM node:14-slim AS server-build
WORKDIR /usr/src
COPY . ./server/
RUN cd server && npm ci && NODE_ENV=production npm run build
RUN ls

# Stage2: Packaging the app
FROM node:14-slim
WORKDIR /root/
COPY --from=server-build /usr/src/server/dist .
RUN ls

EXPOSE 3000

CMD ["node", "api.bundle.js"]