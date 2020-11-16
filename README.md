# Implementação de um balancer para clusters

### Libs utiliazadas
#
  | Lib | Install |
  | ------ | ------ |
  | Axios | npm i axios |
  | Express | npm i express |
  | Readline | npm i readline |
  | Await-spawn | npm i await-spawn |

### A ideia
A partir de um Docker com uma imagem ARCH Linux juntamente com Node instalado, e uma ferramenta de diagnóstico de rede, foi estabelecido um container 'Master' que observa todos os outros nodos filhos que estiverem mapeados para ele.
A comunicação se da através de uma porta IP a qual o nodo filho informa ao container Master. O mesmo irá repetidamente observar caso alguma atividade seja realizada no nodo que está sendo observado.
Com a comunicação estabelecida, a ideia é aumentar o uso da CPU de alguns dos nodos filhos mandando-os resolver o algoritmo de Fibonacci, a partir disso, pegar o uso da CPU de cada NODO, informar ao container Master, para ele observar o uso da indivudual dos NODOS e distribuir a atividade para o que tiver mais processamento disponivel.

### O começo

Primeiro passo para começar o desenvolvimento é instalar o Docker e configurar uma imagem Linux com Node instalado, liberando uma porta para ser escutada.
Nodos filhos são configurados para ouvir uma porta diferente da do Nodo Mestre, mas informam seu endereço IP, uso de CPU e um status. Esse nodos são 'levantados' manualmente, para que a partir dos nodos existentes, o nodo Mestre tenha mapeado os outros ativos e assim possa distribuir o processamento para os nodos com menos uso de CPU.

### A implementação em código

A linguagem utilizada foi Javascript, usando de um servidor Node no qual foram aplicados conceitos de API's REST, multithreading, Webhooks.  
Através de chamadas REST, o container Master sabe frequentemente do status de cada Nodo existente.
Então, enquanto em um terminal roda e exibe os feedbacks do container Master, em outro terminal paralelo são 'controlados' os Nodos 

### Passo a passo

Buildar containers 'nodo.js' e 'master.js':

```bash
docker build -t "master:latest" /pathDaDockerfile
```

```bash
docker build -t "nodo:latest" /pathDaDockerfile
```

Criar network para possibilitar comunicação entre os containers:

```bash
docker network create --subnet=172.18.0.0/16 balancer-net
```

Subir o container 'master.js':

```bash
docker run --ip 172.18.0.22 -it --net balancer-net master:latest
```

Rodar statusFetcher.js, necessário para pegar o status de processamento de cada Nodo:

```bash
node statusFetcher.js
```

Rodar nodeManager.js, arquivo responsaver por dar run na instância do Docker que roda os nodos:

```bash
node nodeManager.js
```



