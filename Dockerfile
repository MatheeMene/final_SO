FROM archlinux:latest

COPY package*.json ./

RUN pacman -Sy
RUN pacman -S --noconfirm nodejs npm
RUN pacman -S --noconfirm net-tools
RUN pacman -S --noconfirm vim
RUN npm i
COPY . .

EXPOSE 3000
CMD [ "node", "master.js" ]


