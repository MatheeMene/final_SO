FROM archlinux:latest

ENV CLUSTER_CONTAINER_PORT 3001
COPY package*.json ./
RUN pacman -Sy
RUN pacman -S --noconfirm nodejs npm
RUN pacman -S --noconfirm net-tools
RUN pacman -S --noconfirm vim
RUN pacman -S --noconfirm iputils
RUN pacman -S --noconfirm iproute2
RUN npm i
COPY . .

EXPOSE 3000
CMD [ "node", "nodo.js" ]

