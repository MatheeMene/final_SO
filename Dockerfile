FROM archlinux:latest

COPY package*.json ./

RUN pacman -Sy
RUN pacman -S --noconfirm nodejs npm
RUN pacman -S --noconfirm net-tools
RUN npm i
COPY . .

EXPOSE 3000
CMD [ "node", "node.js" ]


