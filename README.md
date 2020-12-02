# Implementação de um Load Balancer 

### Libs utilizadas
#
  | Lib | Install |
  | ------ | ------ |
  | Axios | npm i axios |
  | Express | npm i express |
  | Readline | npm i readline |
  | Await-spawn | npm i await-spawn |

### A ideia
A partir de uma imagem Docker ARCH Linux juntamente com Node instalado e uma ferramenta de diagnóstico de rede, foi estabelecido um container 'Master' que observa todos os outros nodos filhos que estiverem mapeados para ele.
A comunicação se dá por meio de uma chamada de API para o IP do contêiner Master no qual o nodo filho informa sua existência. O Master irá repetidamente observar caso alguma atividade seja realizada no nodo que está sendo observado.
Com a comunicação estabelecida, a ideia é aumentar o uso da CPU de alguns dos nodos filhos mandando-os resolver a sequência de Fibonacci. A partir disso, pegamos o uso da CPU de cada nodo que serve para o master distribuir as atividades para os nodos que estiverem com menor uso de CPU.

### O começo

Primeiro passo para começar o desenvolvimento é instalar o Docker e configurar uma imagem Linux com Node instalado, liberando uma porta para ser escutada.
Nodos filhos são configurados para ouvir uma porta diferente da do Nodo Mestre, mas informam seu endereço IP, uso de CPU e um status. Esse nodos são rodados manualmente, para que a partir dos nodos existentes, o nodo Mestre tenha mapeado os outros ativos e assim possa distribuir o processamento para os nodos com menos uso de CPU.

### A implementação em código

A linguagem utilizada foi Javascript, usando de um servidor Node no qual foram aplicados conceitos de redes, API's REST, multithreading e Webhooks.  
Através de chamadas REST, o container Master sabe frequentemente do status de cada Nodo existente.
Então, enquanto em um terminal roda e exibe os feedbacks do container Master, em outro terminal paralelo são 'controlados' os Nodos 

### Passo a passo

Instalar as dependências necessárias


```bash
npm install
```

Criar os containers 'nodo.js' e 'master.js':

```bash
docker build -t "master:latest" /pathDaDockerfile
```

```bash
docker build -t "nodo:latest" /pathDaDockerfile
```

Criar rede para possibilitar comunicação entre os containers:

```bash
docker network create --subnet=172.18.0.0/16 balancer-net
```

Rodar o container 'master.js':

```bash
docker run --ip 172.18.0.22 -it --net balancer-net master:latest
```

Rodar statusFetcher.js, necessário para pegar o status de processamento de cada Nodo:

```bash
node statusFetcher.js
```

Rodar nodeManager.js, script responsável por criar novas instâncias dos nodos:

```bash
node nodeManager.js
```



